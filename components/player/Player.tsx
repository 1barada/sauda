"use client";

import Image from "next/image";
import Skeleton from "@/components/Skeleton";
import ProgressBar from "./ProgressBar";
import ControlButtons from "./ControlButtons";
import usePlayer from "@/hooks/usePlayer";

import Volume from "./Volume";

export default function Player({ className }: { className?: string; }) {
  const {
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
  } = usePlayer();

  if (songQueue.length === 0 || !song) return <></>;

  return (
    <div
      className={`${className || ''} flex flex-row [&>*]:basis-1/3 items-center`}
      style={{
        borderRightWidth: 0,
        borderLeftWidth: 0
      }}
    >
      {loading ? (
        <PlayerAboutLoadingSkeleton/>
      ) : (
        <div className="flex flex-row gap-4">
          <div>
            <Image src={song.coverUrl || ''} alt='cover' width={100} height={100}/>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xl text-gray-900">{song.title}</p>
            <p className="text-sm text-gray-400">{song.authors}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center gap-4">
        <ControlButtons
          paused={paused}
          shuffle={shuffle}
          loop={loop}
          currentSongIndex={currentSongIndex}
          songQueueLength={songQueue.length}
          changeLoop={changeLoop}
          previousSong={previousSong}
          changePauseState={changePauseState}
          nextSong={nextSong}
          changeShuffle={changeShuffle}
        />
        <div className="w-full">
          <ProgressBar time={time} duration={duration} onChange={setCurrentTime}/>
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <Volume volume={volume} setVolume={setVolume}/>
      </div>
    </div>
  );
}


function PlayerAboutLoadingSkeleton() {
  return (
    <div className="flex flex-row gap-4">
      <div>
        <Skeleton className="h-100px w-100px"/>
      </div>
      <div className="flex flex-col justify-center gap-2">
        <Skeleton className="h-5 w-20 rounded"/>
        <Skeleton className="h-4 w-16 rounded"/>
      </div>
    </div>
  );
}