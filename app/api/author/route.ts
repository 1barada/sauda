import { cookies } from "next/headers";
import getSongDuration from "get-mp3-duration";
import NodeID3 from 'node-id3';
import { randomUUID } from "crypto";

import { songUpdateValidation, songUploadValidation, withAuthentication } from "@/middlewares";
import { MiddlewareFunction, handler } from "@/middlewares/handler";
import { RequestUpdateSongData, RequestUploadSongData } from "@/types/base";
import { HttpStatus } from "@/types/httpStatusEnum";
import { createClient } from "@/utils/supabase/server";

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
  const { title, authors, album } = songData;
  const duration = Math.floor(getSongDuration(songBuffer) / 1000); 
  const releaseDate = `${songData.releaseDate.getUTCFullYear()}-${songData.releaseDate.getUTCMonth() + 1}-${songData.releaseDate.getUTCDate()}`
  
  const { error } = await supabase.from('songs').insert({
    title,
    authors,
    album,
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
    album: songData.album,
    authors: songData.authors
  }).eq('id', songData.id);

  if (error) throw new Error('ubable to update song data: ' + error.message);;
  
  return {
    status: 200,
    data: null,
    error: null
  };
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