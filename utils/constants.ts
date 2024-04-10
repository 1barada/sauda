export const NODE_ENV: 'development' | 'production' | 'test' = process.env.NODE_ENV; 
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const MAX_SONG_SIZE = 20971520; // 20 mb
export const MAX_COVER_SIZE = 5242880; // 5 mb
export const MAX_TITLE_SIZE = 20;
export const MAX_AUTHORS_SIZE = 40;