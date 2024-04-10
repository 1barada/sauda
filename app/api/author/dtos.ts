import { MAX_AUTHORS_SIZE, MAX_COVER_SIZE, MAX_SONG_SIZE, MAX_TITLE_SIZE } from "@/utils/constants";
import { z } from "zod";

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
  album: z.string().optional(),
  subAuthors: z.string().min(1).max(MAX_AUTHORS_SIZE).optional()
});

export interface UploadSongDto {
  title: string;
  song: File;
  cover: File;
  album?: string;
  authors: string;
}