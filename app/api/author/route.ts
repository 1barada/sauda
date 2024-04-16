import { cookies } from "next/headers";
import getSongDuration from "get-mp3-duration";
import NodeID3 from 'node-id3';
import { randomUUID } from "crypto";

import { withAuthentication } from "@/middlewares";
import { MiddlewareFunction, handler } from "@/middlewares/handler";
import { RequestDeleteSongData, RequestUpdateSongData, RequestUploadSongData } from "@/types/base";
import { HttpStatus } from "@/types/httpStatusEnum";
import { createClient } from "@/utils/supabase/server";
import { songUploadValidation, songUpdateValidation, songDeleteValidation } from "./middlewares";

const upload: MiddlewareFunction<RequestUploadSongData, null> = async (req) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  if (!req.songData) throw new Error('songUploadValidation middleware not provided');

  const supabase = createClient(cookies());
  const songData = req.songData;
  const songId = randomUUID();
  const coverId = randomUUID();

  // remove metadata
  const songBuffer = NodeID3.removeTagsFromBuffer(Buffer.from(await songData.song.arrayBuffer()));
  const coverBuffer = NodeID3.removeTagsFromBuffer(Buffer.from(await songData.cover.arrayBuffer()));

  // failed to remove metadata
  if (typeof songBuffer === 'boolean' || typeof coverBuffer === 'boolean') throw new Error('unable to remove tags from buffered song or cover files');
  
  const songUploadPromise = supabase.storage.from('songs').upload(
    songId,
    songBuffer, 
    {
      contentType: 'audio/mpeg'
    }
  );
  
  const coverUploadPromise = supabase.storage.from('covers').upload(
    coverId,
    coverBuffer, 
    {
      contentType: songData.cover.type
    }
  );

  const [songUploadResponse, coverUploadResponse] = await Promise.all([
    songUploadPromise, 
    coverUploadPromise
  ]);
  
  if (songUploadResponse.error || coverUploadResponse.error) throw new Error('unable to upload song. ' + songUploadResponse.error?.message + coverUploadResponse.error?.message);
  
  const songUploadData = songUploadResponse.data;
  const coverUploadData = coverUploadResponse.data;
  const { title, authors, albumId } = songData;
  const duration = Math.floor(getSongDuration(songBuffer) / 1000); 
  const releaseDate = `${songData.releaseDate.getUTCFullYear()}-${songData.releaseDate.getUTCMonth() + 1}-${songData.releaseDate.getUTCDate()}`
  
  const { error } = await supabase.from('songs').insert({
    title,
    authors,
    albumId: albumId ? albumId : null,
    songUrl: songUploadData.path,
    coverUrl: coverUploadData.path,
    authorId: req.user.id,
    duration,
    releaseDate
  });
  
  // if error delete all uploaded data
  if (error) {
    const removeSongPromise = supabase.storage.from('songs').remove([songUploadData.path]);
    const removeCoverPromise = supabase.storage.from('covers').remove([coverUploadData.path]);

    // we are not waiting for promises to finish so client can get response sooner
    Promise.all([removeSongPromise, removeCoverPromise])
    .then(([{ error: removeSongError }, { error: removeCoverError }]) => {
      const message = 'Fatal error:';
      if (removeSongError) console.error(message, removeSongError.message);
      if (removeCoverError) console.error(message, removeCoverError.message);
    });

    console.error(error);
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      error: {
        message: 'internal server error'
      }
    }
  }

  return {
    status: HttpStatus.CREATED,
    data: null,
    error: null
  };
}

const update: MiddlewareFunction<RequestUpdateSongData, null> = async (req) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  if (!req.songData) throw new Error('songUpdateValidation middleware not provided');

  const supabase = createClient(cookies());
  const songData = req.songData;

  if (songData.cover) {
    const coverBuffer = NodeID3.removeTagsFromBuffer(Buffer.from(await songData.cover.file.arrayBuffer()));

    if (typeof coverBuffer === 'boolean') throw new Error('unable to remove tags from buffered cover file');
    const { error } = await supabase.storage.from('covers').update(
      songData.cover.path, 
      coverBuffer,
      {
        contentType: songData.cover.file.type
      }
    );
    
    if (error) throw new Error('unable to update song cover: ' + error.message);
  }

  const { error } = await supabase.from('songs').update({
    title: songData.title,
    albumId: songData.albumId ? songData.albumId : null,
    authors: songData.authors
  }).eq('id', songData.id);

  if (error) throw new Error('ubable to update song data: ' + error.message);;
  
  return {
    status: 200,
    data: null,
    error: null
  };
}

const deleteSong: MiddlewareFunction<RequestDeleteSongData, null> = async (req) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  if (!req.songData) throw new Error('songDeleteValidation middleware not provided');

  const supabase = createClient(cookies());
  const songData = req.songData;

  const deleteCoverPromise = supabase.storage.from('covers').remove([songData.coverUrl]);
  const deleteSongPromise = supabase.storage.from('songs').remove([songData.songUrl]);
  const deleteSongInstancePromise = supabase.from('songs').delete().eq('id', songData.id);

  const [ deleteCoverResponse, deleteSongResponse, deleteSongInstanceResponse ] = await Promise.all([
    deleteCoverPromise, 
    deleteSongPromise, 
    deleteSongInstancePromise
  ]);

  if (deleteCoverResponse.error) throw new Error('unable to delete cover. ' + deleteCoverResponse.error);
  if (deleteSongResponse.error) throw new Error('unable to delete song. ' + deleteSongResponse.error);
  if (deleteSongInstanceResponse.error) throw new Error('unable to delete song instance. ' + deleteSongInstanceResponse.error);

  return {
    status: HttpStatus.OK,
    data: null,
    error: null
  }
}

export const POST = handler<RequestUploadSongData, null>(
  withAuthentication,
  songUploadValidation,
  upload
);

export const PATCH = handler<RequestUpdateSongData, null>(
  withAuthentication,
  songUpdateValidation,
  update
);

export const DELETE = handler<RequestDeleteSongData, null>(
  withAuthentication,
  songDeleteValidation,
  deleteSong
);