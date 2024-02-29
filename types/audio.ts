export interface Song {
  id: string;
  name: string;
  duration: number;
  url: string;
  authors: string[];
  album?: string;
  image: string;
}

export interface Album {
  id: string;
  name: string;
  authors: string[];
  songs: Song[];
  image: string;
}