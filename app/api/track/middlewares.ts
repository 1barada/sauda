import { MiddlewareFunction } from "@/middlewares/handler";
import { HttpStatus } from "@/types/httpStatusEnum";
import { formatZodError } from "@/utils/formatZodError";
import { RequestGetAllSongsData, getAllSongsSchema } from "./dtos";
import { z } from "zod";

export const getAllSongsValidation: MiddlewareFunction<RequestGetAllSongsData> = async (req, next) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');

  const search = req.nextUrl.searchParams.get('search') || undefined;
  const limit = req.nextUrl.searchParams.get('limit') || undefined;
  const page = req.nextUrl.searchParams.get('page') || undefined;

  let result;
  try {
    result = getAllSongsSchema.parse({ search, limit, page });
  } catch (error) {
    if (error instanceof z.ZodError) return {
      status: HttpStatus.BAD_REQUEST,
      data: null,
      error: {
        message: formatZodError(error)
      }
    };
    
    throw new Error('unable to validate get all songs data');
  }

  req.searchData = result; 

  return next();
}