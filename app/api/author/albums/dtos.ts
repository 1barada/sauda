import { RequestWithAuthorization } from "@/types/base";
import { MAX_AUTHORS_SIZE, MAX_COVER_SIZE, MAX_TITLE_SIZE } from "@/utils/constants";
import { z } from "zod";

//#region Update
export const updateAlbumSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(MAX_TITLE_SIZE).optional(),
  cover: z.object({
    type: z.enum(['image/jpeg', 'image/png']),
    size: z.number().max(MAX_COVER_SIZE)
  }).optional(),
  subAuthors: z.string().min(1).max(MAX_AUTHORS_SIZE).optional(),
});

export type UpdateAlbumDto = { 
  id: string; 
} & Partial<{
  title: string;
  cover: {
    file: File;
    path: string;
  };
  authors: string;
}>

export interface RequestUpdateAlbumData extends RequestWithAuthorization {
  albumData: UpdateAlbumDto;
}
//#endregion

//#region Upload
export const uploadAlbumSchema = z.object({
  title: z.string().min(1).max(MAX_TITLE_SIZE),
  cover: z.object({
    type: z.enum(['image/jpeg', 'image/png']),
    size: z.number().max(MAX_COVER_SIZE)
  }),
  subAuthors: z.string().min(1).max(MAX_AUTHORS_SIZE).optional(),
  releaseDate: z.coerce.date().max(new Date(), 'release date must be before now')
});

export type UploadAlbumDto = { 
  title: string;
  cover: File;
  authors: string;
  releaseDate: Date;
}

export interface RequestUploadAlbumData extends RequestWithAuthorization {
  albumData: UploadAlbumDto;
}
//#endregion

//#region Delete
export const deleteAlbumSchema = z.object({
  id: z.string().uuid()
});

export type DeleteAlbumDto = { 
  id: string; 
  coverUrl: string;
}

export interface RequestDeleteAlbumData extends RequestWithAuthorization {
  albumData: DeleteAlbumDto;
}
//#endregion
