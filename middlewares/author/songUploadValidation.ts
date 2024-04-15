import { uploadSongSchema } from "@/app/api/author/dtos";
import { RequestUploadSongData } from "@/types/base";
import { formatZodError } from "@/utils/formatZodError";
import { isFile } from "@/utils/isFile";
import { z } from "zod";
import { MiddlewareFunction } from "../handler";
import { HttpStatus } from "@/types/httpStatusEnum";

export const songUploadValidation: MiddlewareFunction<RequestUploadSongData> = async (req, next) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');

  const formData = await req.formData();
  const formDataObj: {[key: string]: any} = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });

  let { song: songFormData, cover: coverFormData, releaseDate, ...formDataObjFields } = formDataObj;
  if (!isFile(songFormData) || !isFile(coverFormData)) return {
    status: HttpStatus.BAD_REQUEST,
    data: null,
    error: {
      message: 'song and cover are required'
    }
  }

  const song = songFormData as File;
  const cover = coverFormData as File;

  const songObj = {
    type: song.type,
    size: song.size
  }

  const coverObj = {
    type: cover.type,
    size: cover.size
  }

  let result;
  try {
    result = uploadSongSchema.parse({ ...formDataObjFields, song: songObj, cover: coverObj, releaseDate });
  } catch (error) {
    if (error instanceof z.ZodError) return {
      status: HttpStatus.BAD_REQUEST,
      data: null,
      error: {
        message: formatZodError(error)
      }
    };
    
    throw new Error('unable to validate upload song data');
  }

  const authors = result.subAuthors ? [req.user.name, ...result.subAuthors.split('&').map(author => author.trim())].join(' & ') : req.user.name;

  req.songData = {
    title: result.title,
    song,
    cover,
    album: result.album,
    authors: authors,
    releaseDate: new Date(releaseDate)
  };

  return next();
}