export interface SongUploadRequestType {
  title: string;
  cover: File;
  song: File;
  authors: string;
  album?: string;
}

export type SongUpdateRequestType = Partial<{
  title: string;
  cover: File;
  subAuthors: string;
  album: string;
}>;

export interface UploadFormInputTypes {
  title: string;
  cover: FileList;
  song: FileList;
  subAuthors?: string;
  album?: string;
}