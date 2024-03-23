import { NextRequest } from "next/server";
import { UserInfo } from "./user";
import { SongUpdateRequestType, SongUploadRequestType } from "./author";

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

export interface RequestWithAuthorization extends NextRequest {
  user: UserInfo;
}

export interface RequestUploadWithSongData extends RequestWithAuthorization {
  songData: SongUploadRequestType;
}

export interface RequestUpdateSongData extends RequestWithAuthorization {
  songData: SongUpdateRequestType;
}