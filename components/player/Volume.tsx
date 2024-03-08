import { PlayerActions, PlayerState } from "@/store/playerStore";
import { Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { IoMdVolumeHigh as VolumeOnIcon, IoMdVolumeOff as VolumeOffIcon } from "react-icons/io";

type VolumeProps = Pick<PlayerState & PlayerActions, 'volume' | 'setVolume'>;

export default function Volume({ volume, setVolume }: VolumeProps) {
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [savedVolume, setSavedVolume] = useState<number | undefined>(undefined);
  const VolumeIcon = volume === 0 ? VolumeOffIcon : VolumeOnIcon;

  useEffect(() => {
    function onMouseUp(this: Document, ev: MouseEvent) {
      if (mouseDown && ev.button === 0) setVolume(position);
      setMouseDown(false);
    }

    document.addEventListener('mouseup', onMouseUp);

    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [position, mouseDown]);

  function onMouseDown(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    if (e.button === 0) setMouseDown(true);
  }

  function onIconClick() {
    if (savedVolume) {
      setVolume(savedVolume);
      setSavedVolume(undefined);
    } else {
      setSavedVolume(volume);
      setVolume(0);
    }
  }

  function handleChange(event: Event, value: number | number[], activeThumb: number) {
    setPosition(typeof value === 'number' ? value : value[0]);
  }

  return (
    <div className="flex flex-row items-center gap-2 w-36">
      <div
        onClick={onIconClick}
        className="cursor-pointer hover:bg-indigo-100 rounded-full p-1 "
      >
        <VolumeIcon size={20}/>
      </div>
      <Slider
        value={mouseDown ? position : volume}
        step={0.01}
        min={0}
        max={1}
        defaultValue={1}
        onChange={handleChange}
        onMouseDown={onMouseDown}
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
    </div>
  )
}
