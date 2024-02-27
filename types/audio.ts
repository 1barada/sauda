export interface Song {
  id: string;
  name: string;
  duration: number;
  url: string;
  author: string;
  album?: string;
  image?: string;
}

export interface Album {
  id: string;
  name: string;
  author: string;
  songs: Song[];
  images?: string[];
}