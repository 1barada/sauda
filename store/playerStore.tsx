import { Song } from "@/types/audio";
import newShuffledArray from "@/utils/newShuffledArray";
import { create } from "zustand";

export interface PlayerState {
  song?: Song;
  songQueue: Song[];
  initialSongQueue: Song[];
  currentSongIndex: number;
  paused: boolean;
  volume: number;
  shuffle: boolean;
  loop: 'noloop' | 'loopCurrent' | 'loopQueue';
}

export interface PlayerActions {
  setSongQueue: (songQueue: Song[], initialSongIndex?: number) => void;
  nextSong: (forced?: boolean) => void;
  previousSong: (forced?: boolean) => void;
  changePauseState: () => void;
  setVolume: (volume: number) => void;
  changeShuffle: () => void;
  changeLoop: () => void;
}

const initialValues: PlayerState = {
  song: undefined,
  initialSongQueue: [],
  songQueue: [],
  currentSongIndex: 0,
  paused: false,
  volume: 1,
  shuffle: false,
  loop: 'noloop',
}

export const playerStore = create<PlayerState & PlayerActions>((set, get) => ({
  ...initialValues,
  setSongQueue: (songQueue, initialSongIndex = 0) => {
    if (initialSongIndex < 0 || songQueue.length <= initialSongIndex)
      throw new Error('PlayerStore.setSongQueue: passed invalid initialSongIndex value');
    
    set({
      ...initialValues,
      song: songQueue[initialSongIndex],
      initialSongQueue: songQueue,
      songQueue: songQueue,
      currentSongIndex: initialSongIndex,
      paused: false
    });
  },
  nextSong: (forced = false) => {
    const { loop, songQueue, currentSongIndex } = get();

    switch(loop) {
      case "noloop": 
        if (currentSongIndex === songQueue.length - 1) {
          set({paused: true});
          break;
        } 

        set({
          song: songQueue[currentSongIndex + 1],
          currentSongIndex: currentSongIndex + 1,
        });
        break;
      case "loopCurrent":
        if (forced && currentSongIndex !== songQueue.length - 1) {
          set({
            song: songQueue[currentSongIndex + 1],
            currentSongIndex: currentSongIndex + 1
          });
        } 
        break;
      case "loopQueue": 
        if (currentSongIndex === songQueue.length - 1) {
          set({
            song: songQueue[0],
            currentSongIndex: 0
          });
          break;
        } 

        set({
          song: songQueue[currentSongIndex + 1],
          currentSongIndex: currentSongIndex + 1 
        });
        break;
    }
  },
  previousSong: (forced = false) => {
    const { loop, currentSongIndex, songQueue } = get();

    switch(loop) {
      case 'noloop': 
        if (currentSongIndex === 0) {
          break;
        }

        set({
          song: songQueue[currentSongIndex - 1],
          currentSongIndex: currentSongIndex - 1
        });
        break;
      case 'loopCurrent': 
        if (forced && currentSongIndex !== 0) {
        
        set({
            song: songQueue[currentSongIndex - 1],
            currentSongIndex: currentSongIndex - 1
          });
        }
        break;
      case 'loopQueue': 
        if (currentSongIndex === 0) {
          set({
            song: songQueue[songQueue.length - 1],
            currentSongIndex: songQueue.length - 1
          });
          break;
        }

        set({
          song: songQueue[currentSongIndex - 1],
          currentSongIndex: currentSongIndex - 1
        });
        break;
    }
  },
  changePauseState: () => {
    set({
      paused: !get().paused
    });
  },
  setVolume: (volume) => {
    if (volume < 0 || volume > 1) {
      throw new Error('PlayerStore.setVolume: volume must be from 0 to 1. You are passing: ' + volume);
    }
    set({volume: volume})
  },
  changeShuffle: () => {
    const { shuffle, initialSongQueue, song } = get();
    if (!song) return;

    if (shuffle) {
      const index = initialSongQueue.findIndex((value) => value.url === song.url);
      if (index === -1) throw new Error('PlayerStore.changeShuffle: could not find song in songQueue');

      set({
        shuffle: false,
        songQueue: initialSongQueue,
        currentSongIndex: index
      })
    } else {
      const shuffledSongs = newShuffledArray<Song>(initialSongQueue);
      const index = shuffledSongs.findIndex((value) => value.url === song.url);
      if (index === -1) throw new Error('PlayerStore.changeShuffle: could not find song in songQueue');

      [shuffledSongs[index], shuffledSongs[0]] = [shuffledSongs[0], shuffledSongs[index]];
      
      set({
        shuffle: !get().shuffle,
        songQueue: shuffledSongs,
        currentSongIndex: 0
      });
    }
  },
  changeLoop: () => {
    switch(get().loop) {
      case 'noloop': 
        set({ loop: 'loopCurrent' });
        break;
      case 'loopCurrent': 
        set({ loop: 'loopQueue' });
        break;
      case 'loopQueue': 
        set({ loop: 'noloop' });
        break;
    }
  }
})); 