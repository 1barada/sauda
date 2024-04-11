import { uploadSongSchema } from "@/app/api/author/dtos";
import { RequestUploadWithSongData, HttpException } from "@/types/base";
import { formatZodError } from "@/utils/formatZodError";
import { isFile } from "@/utils/isFile";
import { z } from "zod";
import { MiddlewareFunction } from "../handler";

export const songUploadValidation: MiddlewareFunction<RequestUploadWithSongData> = async (req, next) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');

  const formData = await req.formData();
  const formDataObj: {[key: string]: any} = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });

  let { song: songFormData, cover: coverFormData, ...formDataObjFields } = formDataObj;
  if (!isFile(songFormData) || !isFile(coverFormData)) throw new HttpException('song and cover are required', 400);

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
    result = uploadSongSchema.parse({ ...formDataObj, song: songObj, cover: coverObj });
  } catch (error) {
    if (error instanceof z.ZodError) throw new HttpException(formatZodError(error));
    throw new Error('unable to validate upload song data');
  }

  const authors = result.subAuthors ? [req.user.name, ...result.subAuthors.split('&').map(author => author.trim())].join(' & ') : req.user.name;

  req.songData = {
    title: result.title,
    song,
    cover,
    album: result.album,
    authors: authors,
  };

  return next();
}