import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { songUploadValidation, withAuthentication } from "@/middlewares";
import { MiddlewareFunction, handler } from "@/middlewares/handler";
import { ApiResponse, RequestUploadWithSongData } from "@/types/base";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";

const upload: MiddlewareFunction<RequestUploadWithSongData> = async (req) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  if (!req.songData) throw new Error('validateUploadSong middleware not provided');

  const supabase = createClient(cookies());
  const songData = req.songData;
  const songPath = `${randomUUID()}.mp3`;
  const coverPath = `${randomUUID()}.${songData.cover.type.split('/')[1]}`;

  const songUploadPromise = supabase.storage.from('songs').upload(
    songPath,
    songData.song
  );

  const coverUploadPromise = supabase.storage.from('covers').upload(
    coverPath,
    songData.cover
  );

  // await for promises and create db record

  return NextResponse.json<ApiResponse<{ success: boolean; }>>({
    data: {
      success: true
    },
    error: null
  }, {
    status: 200
  });
}

export const POST = handler<RequestUploadWithSongData>(
  withAuthentication,
  songUploadValidation,
  upload
);