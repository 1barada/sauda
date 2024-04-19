import { NextRequest } from "next/server";
import { UserInfo } from "./user";
import { DeleteSongDto, UpdateSongDto, UploadSongDto } from "@/app/api/author/dtos";
import { HttpStatus } from "./httpStatusEnum";
import { UploadAlbumDto, UpdateAlbumDto, DeleteAlbumDto } from "@/app/api/author/albums/dtos";

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

export interface BaseRequest extends NextRequest {
  query: URLSearchParams;
}

export interface RequestWithAuthorization extends BaseRequest {
  user: UserInfo;
}
