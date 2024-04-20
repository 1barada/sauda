import { MiddlewareFunction } from "@/middlewares/handler";
import { z } from "zod";
import { HttpStatus } from "@/types/httpStatusEnum";
import { formatZodError } from "@/utils/formatZodError";
import { RequestGetAlbumData, getAlbumSchema } from "./dtos";

export const getAlbumValidation: MiddlewareFunction<RequestGetAlbumData> = async (req, next) => {
  if (!req.user) throw new Error('withAuthorization middleware not provided');

  const id = req.query.get('id');

  let result;
  try {
    result = getAlbumSchema.parse({ id });
  } catch (error) {
    if (error instanceof z.ZodError) return {
      status: HttpStatus.BAD_REQUEST,
      data: null,
      error: {
        message: formatZodError(error)
      }
    };
    
    throw new Error('unable to validate get album data');
  }

  req.searchData = result;

  return next();
}