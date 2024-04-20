import { withAuthentication } from "@/middlewares";
import { MiddlewareFunction, handler } from "@/middlewares/handler";
import { Album, Song } from "@/types/audio";
import { HttpStatus } from "@/types/httpStatusEnum";
import { cookies } from "next/headers";
import { getAlbumValidation } from "./middlewares";
import { createClient } from "@/utils/supabase/server";
import { RequestGetAlbumData } from "./dtos";

const getAlbum: MiddlewareFunction<RequestGetAlbumData, Album> = async (req) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  if (!req.searchData) throw new Error('getAlbumValidation middleware not provided');

  const supabase = createClient(cookies());

  const id = req.searchData.id;

  const { data, error } = await supabase
    .from('albums')
    .select('*,songs(*)')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw new Error('unable to retrieve album: ' + error.message);
  if (data === null) return {
    status: HttpStatus.NOT_FOUND,
    data: null,
    error: {
      message: 'album not found'
    }
  }
  
  const songs = data.songs.map(song => {
    const newSong: Song = {
      id: song.id,
      title: song.title,
      authorId: song.authorId,
      authors: song.authors,
      coverUrl: song.coverUrl,
      releaseDate: new Date(song.releaseDate),
      duration: song.duration,
      url: song.songUrl,
    }

    return newSong;
  })

  const album: Album = {
    id: data.id,
    title: data.title,
    authorId: data.authorId,
    authors: data.authors,
    coverUrl: data.coverUrl,
    releaseDate: new Date(data.releaseDate),
    songs
  }

  return {
    status: HttpStatus.OK,
    data: album,
    error: null
  }
}

export const GET = handler<RequestGetAlbumData, Album>(
  withAuthentication,
  getAlbumValidation,
  getAlbum
);