export interface Song {
  id: string;
  title: string;
  duration: number;
  url: string;
  coverUrl: string;
  authors: string;
  authorId: string;
  releaseDate: Date;
  album?: Omit<Album, 'songs'>;
}

export interface Album {
  id: string;
  title: string;
  authors: string;
  authorId: string;
  songs: Omit<Song, 'album'>[];
  coverUrl: string;
  releaseDate: Date;
}