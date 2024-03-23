import { MiddlewareFunction } from "./handler";
import getServerUser from "@/utils/getServerUser";
import { NextResponse } from "next/server";
import { ApiResponse, RequestUploadWithSongData, RequestWithAuthorization } from "@/types/base";

export const withAuthentication: MiddlewareFunction<RequestWithAuthorization> = async (req, next) => {
  const user = await getServerUser();

  if (!user) {
    return NextResponse.json<ApiResponse<null>>({
      data: null,
      error: {
        message: 'not authorized'
      }
    }, { status: 401 });
  }

  req.user = user;

  return next();
}

export const songUploadValidation: MiddlewareFunction<RequestUploadWithSongData> = async (req, next) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');

  const formData = await req.formData();

  let titleData = formData.get('title');
  let albumData = formData.get('album');
  let subAuthorsData = formData.get('subAuthors');
  let songData = formData.get('song');
  let coverData = formData.get('cover');

  if (titleData === null || songData === null || coverData === null) {
    return NextResponse.json<ApiResponse<null>>({
      data: null,
      error: {
        message: 'title, song and cover are required'
      }
    }, {
      status: 400
    });
  }

  const title = titleData as string;
  const album = albumData === null ? undefined : albumData as string;
  const subAuthors = subAuthorsData === null ? undefined : (subAuthorsData as string).split('&').map(author => author.trim()).join(' & ');
  const song = songData as File;
  const cover = coverData as File;

  // validation
  if (
    (title.length < 1 || title.length > 20) || // title
    (album !== undefined && (album.length < 1 || album.length > 20)) || // album
    (subAuthors !== undefined && (subAuthors.length < 1 || subAuthors.length > 100)) || // subAuthors
    (song.type !== 'audio/mpeg') || // song
    (['image/png', 'image/jpeg'].indexOf(cover.type) === -1)
  ) {
    return NextResponse.json<ApiResponse<null>>({
      data: null,
      error: {
        message: 'invalid song data'
      }
    }, {
      status: 400
    });
  }

  const authors = subAuthors ? `${req.user.name} & ${subAuthors}` : req.user.name

  req.songData = {
    title,
    album,
    authors,
    song,
    cover
  }

  return next();
}