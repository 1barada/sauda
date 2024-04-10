import { NextRequest } from "next/server";
import { UserInfo } from "./user";
import { SongUpdateRequestType } from "./author";
import { UploadSongDto } from "@/app/api/author/dtos";
import { HttpStatus } from "./httpStatusEnum";

export type InputType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

export type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: {
    message: string;
  };
}

export class HttpException extends Error {
  public status: HttpStatus;

  constructor(message: string, status?: HttpStatus) {
    super(message);
    this.status = status || 400;
  }
}

export interface RequestWithAuthorization extends NextRequest {
  user: UserInfo;

}

export interface RequestUploadWithSongData extends RequestWithAuthorization {
  songData: UploadSongDto;
}

export interface RequestUpdateSongData extends RequestWithAuthorization {
  songData: SongUpdateRequestType;
}