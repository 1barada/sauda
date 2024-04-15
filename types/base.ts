import { NextRequest } from "next/server";
import { UserInfo } from "./user";
import { UpdateSongDto, UploadSongDto } from "@/app/api/author/dtos";
import { HttpStatus } from "./httpStatusEnum";

export type InputType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

export type ApiResponse<T> = {
  status: HttpStatus;
} & ({
  data: T;
  error: null;
} | {
  data: null;
  error: {
    message: string;
  };
});

export interface RequestWithAuthorization extends NextRequest {
  user: UserInfo;
}

export interface RequestUploadSongData extends RequestWithAuthorization {
  songData: UploadSongDto;
}

export interface RequestUpdateSongData extends RequestWithAuthorization {
  songData: UpdateSongDto;
}