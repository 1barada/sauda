'use client'

import { Slider } from "@mui/material";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  time: number;
  duration: number;
  onChange: (time: number) => void;
}

export default function ProgressBar({
  time,
  duration,
  onChange
}: ProgressBarProps) {
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);

  useEffect(() => {
    function onMouseUp(this: Document, ev: MouseEvent) {
      if (mouseDown && ev.button === 0) onChange(position);
      setMouseDown(false);
    }

    document.addEventListener('mouseup', onMouseUp);

    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [position, mouseDown]);

  function onMouseDown(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    if (e.button === 0) setMouseDown(true);
  }

  function handleChange(event: Event, value: number | number[], activeThumb: number) {
    setPosition(typeof value === 'number' ? value : value[0]);
  }

  return (
    <div className="grid grid-cols-[30px_1fr_30px] gap-1">
      <TimeStamp seconds={mouseDown ? position : time}/>
      <Slider
        value={mouseDown ? position : time}
        min={0}
        max={duration}
        defaultValue={0}
        onMouseDown={onMouseDown}
        onChange={handleChange}
        sx={{
          '& .MuiSlider-rail': {
            backgroundColor: 'rgb(203 213 225)'
          },
          '& .MuiSlider-track': {
            backgroundColor: 'rgb(107 114 128)',
            border: 'none'
          },
          '& .MuiSlider-thumb': {
            backgroundColor: 'rgb(107 114 128)',
            boxShadow: 'none',
            width: 8,
            height: 8,
          },
          '& .MuiSlider-thumb:hover': {
            boxShadow: 'none',
          },
        }}
      />
      <TimeStamp seconds={duration}/>
    </div>
  );
}

interface TimeStampProps {
  seconds: number;
}

function TimeStamp({ seconds }: TimeStampProps) {
  function milisecondsToTimeStamp(seconds: number): string {
    const secondsLeft = Math.floor(seconds % 60);
    const minutes = Math.floor(seconds / 60);

    return `${minutes}:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;
  }

  return (
    <div className="text-xs flex items-center">
      {milisecondsToTimeStamp(seconds)}
    </div>
  );
}