import { cookies } from "next/headers";
import NodeID3 from 'node-id3';
import getSongDuration from "get-mp3-duration";

import { songUploadValidation, withAuthentication } from "@/middlewares";
import { MiddlewareFunction, handler } from "@/middlewares/handler";
import { RequestUploadWithSongData } from "@/types/base";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { HttpStatus } from "@/types/httpStatusEnum";

const upload: MiddlewareFunction<RequestUploadWithSongData, null> = async (req) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  if (!req.songData) throw new Error('validateUploadSong middleware not provided');

  const supabase = createClient(cookies());
  const songData = req.songData;
  const songPath = `${randomUUID()}.mp3`;
  const coverPath = `${randomUUID()}.${songData.cover.type.split('/')[1]}`;

  // remove metadata
  const songBuffer = NodeID3.removeTagsFromBuffer(Buffer.from(await songData.song.arrayBuffer()));
  const coverBuffer = NodeID3.removeTagsFromBuffer(Buffer.from(await songData.cover.arrayBuffer()));

  // failed to remove metadata
  if (typeof songBuffer === 'boolean' || typeof coverBuffer === 'boolean') throw new Error('Unable to remove tags from buffered song or cover files');
  
  const songUploadPromise = supabase.storage.from('songs').upload(
    songPath,
    songBuffer, 
    {
      contentType: 'audio/mpeg'
    }
  );
  
  const coverUploadPromise = supabase.storage.from('covers').upload(
    coverPath,
    coverBuffer, 
    {
      contentType: songData.cover.type
    }
  );

  const [songUploadResponse, coverUploadResponse] = await Promise.all([
    songUploadPromise, 
    coverUploadPromise
  ]);
  
  if (songUploadResponse.error || coverUploadResponse.error) throw new Error('Unable to upload song. ' + songUploadResponse.error?.message + coverUploadResponse.error?.message);
  
  const songUploadData = songUploadResponse.data as { id: string; path: string; fullPath: string };
  const coverUploadData = coverUploadResponse.data as { id: string; path: string; fullPath: string };
  const { title, authors, album } = songData;
  const duration = Math.floor(getSongDuration(songBuffer as Buffer) / 1000); 
  
  const { data, error } = await supabase.from('songs').insert({
    title,
    authors,
    album,
    songId: songUploadData.id,
    coverId: coverUploadData.id,
    authorId: req.user.id,
    duration
  });

  if (error) throw new Error('Unable to insert upload song data to database.' + error.message);

  return {
    data: null,
    status: HttpStatus.CREATED
  };
}

export const POST = handler<RequestUploadWithSongData, null>(
  withAuthentication,
  songUploadValidation,
  upload
);