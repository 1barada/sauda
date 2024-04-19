export interface Song {
  id: string;
  title: string;
  duration: number;
  url: string;
  coverUrl: string;
  authors: string;
  authorId: string;
  releaseDate: Date;
  album?: Omit<Album, 'songUrls'>;
}

export interface Album {
  id: string;
  title: string;
  authors: string;
  authorId: string;
  songUrls: Omit<Song, 'album'>[];
  coverUrl: string;
  releaseDate: Date;
}