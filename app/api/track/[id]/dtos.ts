import { RequestWithAuthorization } from "@/types/base";
import { z } from "zod";

export const getOneSongSchema = z.object({
  id: z.string().uuid(),
});

export type GetOneSongDto = {
  id: string;
}

export interface RequestGetOneSongData extends RequestWithAuthorization {
  searchData: GetOneSongDto;
}