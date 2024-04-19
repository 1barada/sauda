import { MiddlewareFunction, handler } from "@/middlewares/handler";
import { RequestGetAllSongsData } from "./dtos";
import { Album, Song } from "@/types/audio";
import { withAuthentication } from "@/middlewares";
import { getAllSongsValidation } from "./middlewares";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { HttpStatus } from "@/types/httpStatusEnum";
import { PAGE_LIMIT } from "@/utils/constants";

const getAll: MiddlewareFunction<RequestGetAllSongsData, Song[]> = async (req) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  if (!req.searchData) throw new Error('getAllSongsValidation middleware not provided');

  const supabase = createClient(cookies());

  const searchData = req.searchData;

  const search = searchData.search;
  const limit = searchData.limit || PAGE_LIMIT;
  const page = searchData.page || 1;

  let response;
  if (search) {
    response = await supabase
      .from('songs')
      .select('*,albums(*)')
      .ilike('title', `%${search}%`)
      .range((page - 1) * limit, page * limit);
  } else {
    response = await supabase
      .from('songs')
      .select('*,albums(*)')
      .range((page - 1) * limit, page * limit);
  }
  const { data, error } = response;
  
  if (error) throw new Error('unable to retrieve all songs: ' + error.message);

  const songs = data.map(song => {
    const newSong: Song = {
      id: song.id,
      title: song.title,
      authorId: song.authorId,
      authors: song.authors,
      coverUrl: song.coverUrl,
      releaseDate: new Date(song.releaseDate),
      url: song.songUrl,
      duration: song.duration,
    }

    if (song.albums) {
      const album = song.albums;
      newSong.album = {
        id: album.id,
        title: album.title,
        authorId: album.authorId,
        authors: album.authors,
        coverUrl: album.coverUrl,
        releaseDate: new Date(album.releaseDate)
      }
    }

    return newSong;
  });

  return {
    status: HttpStatus.OK,
    data: songs,
    error: null
  }
}

export const GET = handler<RequestGetAllSongsData, Song[]>(
  withAuthentication,
  getAllSongsValidation,
  getAll
);