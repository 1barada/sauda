import { MiddlewareFunction } from "@/middlewares/handler";
import { RequestDeleteAlbumData, RequestUpdateAlbumData, RequestUploadAlbumData } from "@/types/base";
import { HttpStatus } from "@/types/httpStatusEnum";
import { formatZodError } from "@/utils/formatZodError";
import { isFile } from "@/utils/isFile";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { deleteAlbumSchema, updateAlbumSchema, uploadAlbumSchema } from "./dtos";

export const albumUpdateValidation: MiddlewareFunction<RequestUpdateAlbumData> = async (req, next) => {
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

  const coverObj: { type: string; size: number; } | undefined = cover ? {
    type: cover.type,
    size: cover.size
  } : undefined;
  
  let result;
  try {
    result = updateAlbumSchema.parse({ ...formDataObjFields, cover: coverObj, releaseDate, id });
  } catch (error) {
    if (error instanceof z.ZodError) return {
      status: HttpStatus.BAD_REQUEST,
      data: null,
      error: {
        message: formatZodError(error)
      }
    };
    
    throw new Error('unable to validate update album data');
  }

  const { data: albumInstanceData, error: albumInstanceError } = await supabase.from('albums').select().eq('id', id).maybeSingle();
  
  if (albumInstanceError) throw new Error(albumInstanceError.message);
  if (albumInstanceData === null) return {
    status: HttpStatus.NOT_FOUND,
    data: null,
    error: {
      message: 'album not found'
    }
  } 
  if (albumInstanceData.authorId !== req.user.id) return {
    status: HttpStatus.FORBIDDEN,
    data: null,
    error: {
      message: 'you have not rights to update this album'
    }
  } 

  let authors: string | undefined = undefined;
  if ('subAuthors' in formDataObjFields) {
    authors = result.subAuthors ? [req.user.name, ...result.subAuthors.split('&').map(author => author.trim())].join(' & ') : req.user.name;
  }

  req.albumData = {
    id: albumInstanceData.id,
    title: result.title,
    cover: cover ? {
      file: cover,
      path: albumInstanceData.coverUrl
    } : undefined,
    authors: authors,
  };

  return next();
}

export const albumUploadValidation: MiddlewareFunction<RequestUploadAlbumData> = async (req, next) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');

  const supabase = createClient(cookies());
  const formData = await req.formData();
  const formDataObj: {[key: string]: any} = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });

  let { cover: coverFormData, releaseDate, ...formDataObjFields } = formDataObj;
  if (!isFile(coverFormData)) return {
    status: HttpStatus.BAD_REQUEST,
    data: null,
    error: {
      message: 'cover are required'
    }
  }

  const cover = coverFormData as File;

  const coverObj = {
    type: cover.type,
    size: cover.size
  }

  let result;
  try {
    result = uploadAlbumSchema.parse({ ...formDataObjFields, cover: coverObj, releaseDate });
  } catch (error) {
    if (error instanceof z.ZodError) return {
      status: HttpStatus.BAD_REQUEST,
      data: null,
      error: {
        message: formatZodError(error)
      }
    };
    
    throw new Error('unable to validate upload album data');
  }

  const authors = result.subAuthors ? [req.user.name, ...result.subAuthors.split('&').map(author => author.trim())].join(' & ') : req.user.name;

  req.albumData = {
    title: result.title,
    cover,
    authors: authors,
    releaseDate: new Date(releaseDate)
  };

  return next();
}

export const albumDeleteValidation: MiddlewareFunction<RequestDeleteAlbumData> = async (req, next) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  
  const supabase = createClient(cookies());
  const formData = await req.formData();
  const id = formData.get('id');

  let result;
  try {
    result = deleteAlbumSchema.parse({ id });
  } catch (error) {
    if (error instanceof z.ZodError) return {
      status: HttpStatus.BAD_REQUEST,
      data: null,
      error: {
        message: formatZodError(error)
      }
    };
    
    throw new Error('unable to validate delete album data');
  }

  const { data, error } = await supabase.from('albums').select().eq('id', result.id).maybeSingle();

  if (error) throw new Error(error.message);
  if (data === null) return {
    status: HttpStatus.NOT_FOUND,
    data: null,
    error: {
      message: 'album not found'
    }
  } 
  if (data.authorId !== req.user.id) return {
    status: HttpStatus.FORBIDDEN,
    data: null,
    error: {
      message: 'you have not rights to delete this album'
    }
  }

  req.albumData = {
    id: result.id,
    coverUrl: data.coverUrl
  }

  return next();
}