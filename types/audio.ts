export interface Song {
  id: string;
  title: string;
  duration: number;
  url: string;
  coverUrl: string;
  authors: string;
  album?: string;
}

export interface Album {
  id: string;
  title: string;
  authors: string;
  songUrls: Song[];
  coverUrl: string;
}