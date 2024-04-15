import { updateSongSchema } from "@/app/api/author/dtos";
import { RequestUpdateSongData } from "@/types/base";
import { formatZodError } from "@/utils/formatZodError";
import { isFile } from "@/utils/isFile";
import { z } from "zod";
import { MiddlewareFunction } from "../handler";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { HttpStatus } from "@/types/httpStatusEnum";

export const songUpdateValidation: MiddlewareFunction<RequestUpdateSongData> = async (req, next) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');

  const supabase = createClient(cookies());
  const formData = await req.formData();
  const formDataObj: {[key: string]: any} = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });

  let { id, cover: coverFormData, releaseDate, ...formDataObjFields } = formDataObj;
  if (coverFormData && !isFile(coverFormData)) return {
    status: HttpStatus.BAD_REQUEST,
    data: null,
    error: {
      message: 'cover are required'
    }
  };

  const cover = coverFormData as File;

  let coverObj: { type: string; size: number; } | undefined = undefined;
  if (cover) {
    coverObj = {
      type: cover.type,
      size: cover.size
    }
  }  
  
  let result;
  try {
    result = updateSongSchema.parse({ ...formDataObjFields, cover: coverObj, releaseDate, id });
  } catch (error) {
    if (error instanceof z.ZodError) return {
      status: HttpStatus.BAD_REQUEST,
      data: null,
      error: {
        message: formatZodError(error)
      }
    };
    
    throw new Error('unable to validate update song data');
  }

  const { data: songInstanceData, error: songInstanceError } = await supabase.from('songs').select().eq('id', id).maybeSingle();
  
  if (songInstanceError) throw songInstanceError;
  if (songInstanceData === null) return {
    status: HttpStatus.NOT_FOUND,
    data: null,
    error: {
      message: 'song not found'
    }
  } 

  let authors: string | undefined = undefined;
  if ('subAuthors' in formDataObjFields) {
    authors = result.subAuthors ? [req.user.name, ...result.subAuthors.split('&').map(author => author.trim())].join(' & ') : req.user.name;
  }

  req.songData = {
    id: songInstanceData.id,
    title: result.title,
    cover: cover ? {
      file: cover,
      path: songInstanceData.coverUrl
    } : undefined,
    album: result.album,
    authors: authors,
  };

  return next();
}