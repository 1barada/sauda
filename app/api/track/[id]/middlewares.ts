import { MiddlewareFunction } from "@/middlewares/handler";
import { RequestGetOneSongData, getOneSongSchema } from "./dtos";
import { z } from "zod";
import { HttpStatus } from "@/types/httpStatusEnum";
import { formatZodError } from "@/utils/formatZodError";

export const getOneSongValidation: MiddlewareFunction<RequestGetOneSongData> = async (req, next) => {
  if (!req.user) throw new Error('withAuthorization middleware not provided');

  const id = req.query.get('id');

  let result;
  try {
    result = getOneSongSchema.parse({ id });
  } catch (error) {
    if (error instanceof z.ZodError) return {
      status: HttpStatus.BAD_REQUEST,
      data: null,
      error: {
        message: formatZodError(error)
      }
    };
    
    throw new Error('unable to validate get one song data');
  }

  req.searchData = result;

  return next();
}