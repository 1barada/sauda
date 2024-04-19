import { RequestWithAuthorization } from "@/types/base";
import { PAGE_LIMIT } from "@/utils/constants";
import { z } from "zod";

export const getAllSongsSchema = z.object({
  search: z.string().optional(),
  limit: z.number().min(1).max(PAGE_LIMIT).default(PAGE_LIMIT).optional(),
  page: z.number().min(1).default(1).optional()
});

export type GetAllSongsDto = Partial<{
  search: string;
  limit: number;
  page: number;
}>

export interface RequestGetAllSongsData extends RequestWithAuthorization {
  searchData: GetAllSongsDto;
}