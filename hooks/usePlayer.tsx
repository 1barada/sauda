import { playerStore } from "@/store/playerStore";
import { useEffect, useState } from "react";

export default function usePlayer() {
  const {
    song,
    songQueue,
    paused,
    volume,
    shuffle,
    loop,
    currentSongIndex,
    nextSong,
    previousSong,
    changePauseState: changePauseStateStore,
    setVolume: setVolumeStore,
    changeShuffle,
    changeLoop
  } = playerStore();
  const [audio, setAudio] = useState<HTMLAudioElement | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [time, setTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (!song) return;

    function onLoad(audio: HTMLAudioElement) {
      return () => {
        setLoading(false);
        setDuration(audio.duration);

        if (paused) audio.pause();
        else audio.play();
      }
    }
    
    function onEnd() {
      nextSong();
    }

    setLoading(true);
    setTime(0);
    setDuration(0);
    const newAudio = new Audio(song.url);
    newAudio.loop = loop === 'loopCurrent';
    setAudio(newAudio);

    newAudio.addEventListener('loadeddata', onLoad(newAudio));
    newAudio.addEventListener('ended', onEnd);
    const timeInterval = setInterval(() => setTime(newAudio.currentTime), 1000);

    return () => {
      newAudio.removeEventListener('loadeddata', onLoad(newAudio));
      newAudio.removeEventListener('ended', onEnd);
      newAudio.pause();
      setAudio(undefined);
      clearInterval(timeInterval);
    }
  }, [song]);

  useEffect(() => {
    if (!audio) return;

    audio.loop = loop === 'loopCurrent';
  }, [loop]);

  function changePauseState() {
    if (!audio) return;
    
    if (paused) {
      audio.play();
    } else {
      audio.pause();
    }

    changePauseStateStore();
  }

  function setVolume(volume: number) {
    if (!audio) return;

    audio.volume = volume;
    setVolumeStore(volume);
  }

  function setCurrentTime(time: number) {
    if (!audio) return;

    audio.currentTime = time;
    setTime(time);
  }

  return {
    loading,
    song,
    songQueue,
    paused,
    volume,
    shuffle,
    loop,
    time,
    duration,
    currentSongIndex,
    nextSong,
    previousSong,
    changePauseState,
    setVolume,
    changeShuffle,
    changeLoop,
    setCurrentTime
  };
}