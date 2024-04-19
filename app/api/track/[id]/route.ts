import { withAuthentication } from "@/middlewares";
import { MiddlewareFunction, handler } from "@/middlewares/handler";
import { Song } from "@/types/audio";
import { HttpStatus } from "@/types/httpStatusEnum";
import { cookies } from "next/headers";
import { RequestGetOneSongData } from "./dtos";
import { getOneSongValidation } from "./middlewares";
import { createClient } from "@/utils/supabase/server";

const getOne: MiddlewareFunction<RequestGetOneSongData, Song> = async (req) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  if (!req.searchData) throw new Error('getOneSongValidation middleware not provided');

  const supabase = createClient(cookies());

  const id = req.searchData.id;

  const { data, error } = await supabase
    .from('songs')
    .select('*,albums(*)')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw new Error('unable to retrieve song: ' + error.message);
  if (data === null) return {
    status: HttpStatus.NOT_FOUND,
    data: null,
    error: {
      message: 'song not found'
    }
  }

  const song: Song = {
    id: data.id,
    title: data.title,
    authorId: data.authorId,
    authors: data.authors,
    coverUrl: data.coverUrl,
    releaseDate: new Date(data.releaseDate),
    url: data.songUrl,
    duration: data.duration,
  }

  if (data.albums) {
    const album = data.albums;
    song.album = {
      id: album.id,
      title: album.title,
      authorId: album.authorId,
      authors: album.authors,
      coverUrl: album.coverUrl,
      releaseDate: new Date(album.releaseDate)
    }
  }

  return {
    status: HttpStatus.OK,
    data: song,
    error: null
  }
}

export const GET = handler<RequestGetOneSongData, Song>(
  withAuthentication,
  getOneSongValidation,
  getOne
);