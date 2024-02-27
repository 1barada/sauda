import { Song } from "@/types/audio";
import { create } from "zustand";

export interface PlayerState {
  song?: Song;
  songQueue: Song[];
  pause: boolean;
  volume: number;
  shufle: boolean;
  loop: 'noloop' | 'loopCurrent' | 'loopQueue';
  setSongQueue: (songQueue: Song[], initialSongIndex?: number) => void;
  nextSong: () => void;
  previousSong: () => void;
  changePauseState: () => void;
  setVolume: (volume: number) => void;
  changeShufle: () => void;
  changeLoop: () => void;
}

export const PlayerStore = create<PlayerState>((set, get) => ({
  song: undefined,
  songQueue: [],
  pause: true,
  volume: 1,
  shufle: false,
  loop: 'noloop',
  setSongQueue: (songQueue, initialSongIndex = 0) => {
    if (initialSongIndex < 0 || songQueue.length <= initialSongIndex)
      throw new Error('PlayerStore.setSongQueue: passed invalid initialSongIndex value');

    set({
      song: songQueue[initialSongIndex],
      songQueue: songQueue,
      pause: false
    });
  },
  nextSong: () => {
    switch(get().loop) {
      case "noloop": 
        
        break;
    }
  },
  previousSong: () => {

  },
  changePauseState: () => {

  },
  setVolume: (volume) => {

  },
  changeShufle: () => {

  },
  changeLoop: () => {

  }
})); 

export function usePlayer() {
}