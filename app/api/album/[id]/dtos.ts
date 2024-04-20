import { RequestWithAuthorization } from "@/types/base";
import { z } from "zod";

export const getAlbumSchema = z.object({
  id: z.string().uuid(),
});

export type GetAlbumDto = {
  id: string;
}

export interface RequestGetAlbumData extends RequestWithAuthorization {
  searchData: GetAlbumDto;
}