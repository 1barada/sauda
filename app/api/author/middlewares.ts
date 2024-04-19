import { MiddlewareFunction } from "@/middlewares/handler";
import { HttpStatus } from "@/types/httpStatusEnum";
import { formatZodError } from "@/utils/formatZodError";
import { isFile } from "@/utils/isFile";
import { cookies } from "next/headers";
import { z } from "zod";
import { RequestDeleteSongData, RequestUpdateSongData, RequestUploadSongData, deleteSongSchema, updateSongSchema, uploadSongSchema } from "./dtos";
import { createClient } from "@/utils/supabase/server";

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

  const coverObj: { type: string; size: number; } | undefined = cover ? {
    type: cover.type,
    size: cover.size
  } : undefined;
  
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
  
  if (songInstanceError) throw new Error(songInstanceError.message);
  if (songInstanceData === null) return {
    status: HttpStatus.NOT_FOUND,
    data: null,
    error: {
      message: 'song not found'
    }
  } 
  if (songInstanceData.authorId !== req.user.id) return {
    status: HttpStatus.FORBIDDEN,
    data: null,
    error: {
      message: 'you have not rights to update this song'
    }
  } 

  if (result.albumId) {
    const { data: albumInstanceData, error: albumInstanceError } = await supabase.from('albums').select().eq('id', result.albumId).maybeSingle();
    
    if (albumInstanceError) throw new Error(albumInstanceError.message);
    if (albumInstanceData === null) return {
      status: HttpStatus.NOT_FOUND,
      data: null,
      error: {
        message: 'album not found'
      }
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
    albumId: result.albumId,
    authors: authors,
  };

  return next();
}

export const songUploadValidation: MiddlewareFunction<RequestUploadSongData> = async (req, next) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');

  const supabase = createClient(cookies());
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

  if (result.albumId) {
    const { data: albumInstanceData, error: albumInstanceError } = await supabase.from('albums').select().eq('id', result.albumId).maybeSingle();
    
    if (albumInstanceError) throw new Error(albumInstanceError.message);
    if (albumInstanceData === null) return {
      status: HttpStatus.NOT_FOUND,
      data: null,
      error: {
        message: 'album not found'
      }
    } 
  }

  const authors = result.subAuthors ? [req.user.name, ...result.subAuthors.split('&').map(author => author.trim())].join(' & ') : req.user.name;

  req.songData = {
    title: result.title,
    song,
    cover,
    albumId: result.albumId,
    authors: authors,
    releaseDate: new Date(releaseDate)
  };

  return next();
}

export const songDeleteValidation: MiddlewareFunction<RequestDeleteSongData> = async (req, next) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  
  const supabase = createClient(cookies());
  const formData = await req.formData();
  const id = formData.get('id');

  let result;
  try {
    result = deleteSongSchema.parse({ id });
  } catch (error) {
    if (error instanceof z.ZodError) return {
      status: HttpStatus.BAD_REQUEST,
      data: null,
      error: {
        message: formatZodError(error)
      }
    };
    
    throw new Error('unable to validate delete song data');
  }

  const { data, error } = await supabase.from('songs').select().eq('id', result.id).maybeSingle();

  if (error) throw new Error(error.message);
  if (data === null) return {
    status: HttpStatus.NOT_FOUND,
    data: null,
    error: {
      message: 'song not found'
    }
  } 
  if (data.authorId !== req.user.id) return {
    status: HttpStatus.FORBIDDEN,
    data: null,
    error: {
      message: 'you have not rights to delete this song'
    }
  }

  req.songData = {
    id: result.id,
    coverUrl: data.coverUrl,
    songUrl: data.songUrl
  }

  return next();
}