import { RequestWithAuthorization } from "@/types/base";
import { MAX_AUTHORS_SIZE, MAX_COVER_SIZE, MAX_SONG_SIZE, MAX_TITLE_SIZE } from "@/utils/constants";
import { z } from "zod";

//#region Upload
export const uploadSongSchema = z.object({
  title: z.string().min(1).max(MAX_TITLE_SIZE),
  song: z.object({
    type: z.enum(['audio/mpeg']),
    size: z.number().max(MAX_SONG_SIZE)
  }),
  cover: z.object({
    type: z.enum(['image/jpeg', 'image/png']),
    size: z.number().max(MAX_COVER_SIZE)
  }),
  albumId: z.string().uuid().optional(),
  subAuthors: z.string().min(1).max(MAX_AUTHORS_SIZE).optional(),
  releaseDate: z.coerce.date().max(new Date(), 'release date must be before now')
});

export interface UploadSongDto {
  title: string;
  song: File;
  cover: File;
  albumId?: string;
  authors: string;
  releaseDate: Date;
}

export interface RequestUploadSongData extends RequestWithAuthorization {
  songData: UploadSongDto;
}
//#endregion

//#region Update
export const updateSongSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(MAX_TITLE_SIZE).optional(),
  cover: z.object({
    type: z.enum(['image/jpeg', 'image/png']),
    size: z.number().max(MAX_COVER_SIZE)
  }).optional(),
  albumId: z.string().uuid().optional(),
  subAuthors: z.string().min(1).max(MAX_AUTHORS_SIZE).optional(),
});

export type UpdateSongDto = { 
  id: string; 
} & Partial<{
  title: string;
  cover: {
    file: File;
    path: string;
  };
  albumId: string;
  authors: string;
}>

export interface RequestUpdateSongData extends RequestWithAuthorization {
  songData: UpdateSongDto;
}
//#endregion

//#region Delete
export const deleteSongSchema = z.object({
  id: z.string().uuid()
});

export type DeleteSongDto = { 
  id: string; 
  coverUrl: string;
  songUrl: string;
}

export interface RequestDeleteSongData extends RequestWithAuthorization {
  songData: DeleteSongDto;
}
//#endregion
