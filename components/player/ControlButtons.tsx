'use client'

import Button from "@/components/Button";
import { PlayerActions, PlayerState } from "@/store/playerStore";
import { IconType } from "react-icons";
import { 
  IoMdShuffle as ShuffleIcon,
  IoMdRepeat as LoopIcon,
  IoMdPause as PauseIcon, 
  IoMdPlay as PlayIcon,
  IoIosSkipBackward as BackwardIcon,
  IoIosSkipForward as ForwardIcon,
} from "react-icons/io";

type ControlButtonsProps = Pick<PlayerState & PlayerActions, 
'paused' | 
'shuffle' | 
'loop' | 
'currentSongIndex' |
'changeLoop' |
'changeShuffle' |
'changePauseState' |
'nextSong' |
'previousSong'
> & {
  songQueueLength: number;
}

export default function ControlButtons({
  paused,
  shuffle,
  loop,
  currentSongIndex,
  songQueueLength,
  changeLoop,
  previousSong,
  changePauseState,
  nextSong,
  changeShuffle
}: ControlButtonsProps) {
  const loopTitle = {
    'noloop': 'no loop',
    'loopCurrent': 'looped current',
    'loopQueue': 'looped queue'
  }

  return (
    <div className="flex flex-row gap-3">
      <ControlButton onClick={() => changeLoop()} Icon={LoopIcon} className="relative" active={loop !== 'noloop'} title={loopTitle[loop]}>
        {loop === 'loopCurrent' && (
          <div className="absolute inset-0 top-2 text-[8px] font-extrabold left-[-0.5px]">
            1
          </div>
        )}
      </ControlButton>
      <ControlButton onClick={() => previousSong(true)} Icon={BackwardIcon} disabled={loop !== 'loopQueue' && currentSongIndex === 0} title='previous song'/>
      <ControlButton onClick={() => changePauseState()} Icon={paused ? PlayIcon : PauseIcon} title={paused ? 'play' : 'pause'}/>
      <ControlButton onClick={() => nextSong(true)} Icon={ForwardIcon} disabled={loop !== 'loopQueue' && currentSongIndex === songQueueLength - 1} title='next song'/>
      <ControlButton onClick={() => changeShuffle()} Icon={ShuffleIcon} active={shuffle} title={shuffle ? 'shuffled' : 'not shuffled'}/>
    </div>
  )
}

interface ControlButtonProps {
  onClick: () => void;
  Icon: IconType;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  active?: boolean;
  title?: string;
}

function ControlButton({ onClick, Icon, className, disabled, children, active = true, title }: ControlButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      className={`${className || ''} ${!disabled && 'hover:bg-indigo-100'} rounded-full p-1 disabled:cursor-not-allowed`} 
      disabled={disabled}
      title={title}
    >
      <Icon size={20} color={disabled || !active ? 'grey' : ''}/>
      {children}
    </Button>
  );
}