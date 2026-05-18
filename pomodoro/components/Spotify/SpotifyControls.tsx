'use client'

import { PlayIcon, PauseIcon, PrevIcon, NextIcon, VolumeIcon } from '@/components/UI/Icons'

interface Props {
  isPlaying: boolean
  volume: number
  position: number
  duration: number
  onTogglePlay: () => void
  onNext: () => void
  onPrevious: () => void
  onVolumeChange: (v: number) => void
  onSeek: (ms: number) => void
}

function formatMs(ms: number): string {
  const totalSecs = Math.floor(ms / 1000)
  const m = Math.floor(totalSecs / 60)
  const s = totalSecs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function SpotifyControls({
  isPlaying,
  volume,
  position,
  duration,
  onTogglePlay,
  onNext,
  onPrevious,
  onVolumeChange,
  onSeek,
}: Props) {
  const progress = duration > 0 ? position / duration : 0

  return (
    <div className="flex flex-col gap-4 px-1">
      {/* Progress bar */}
      <div className="flex flex-col gap-1">
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={position}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full accent-[#1DB954] cursor-pointer"
          aria-label="Track position"
          style={{
            background: `linear-gradient(to right, #1DB954 ${progress * 100}%, rgba(255,255,255,0.15) ${progress * 100}%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-white/30">
          <span>{formatMs(position)}</span>
          <span>{formatMs(duration)}</span>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={onPrevious}
          aria-label="Previous track"
          className="text-white/50 transition-all hover:scale-110 hover:text-white"
        >
          <PrevIcon size={20} />
        </button>

        <button
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-lg shadow-[#1DB954]/30 transition-all hover:scale-105 hover:bg-[#1ed760] active:scale-95"
        >
          {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
        </button>

        <button
          onClick={onNext}
          aria-label="Next track"
          className="text-white/50 transition-all hover:scale-110 hover:text-white"
        >
          <NextIcon size={20} />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onVolumeChange(volume === 0 ? 50 : 0)}
          aria-label={volume === 0 ? 'Unmute' : 'Mute'}
          className="shrink-0 text-white/30 transition-colors hover:text-white"
        >
          <VolumeIcon muted={volume === 0} size={16} />
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-full cursor-pointer accent-white/60"
          aria-label="Volume"
          style={{
            background: `linear-gradient(to right, rgba(255,255,255,0.6) ${volume}%, rgba(255,255,255,0.12) ${volume}%)`,
          }}
        />
        <span className="w-6 shrink-0 text-right text-[10px] text-white/30">{volume}</span>
      </div>
    </div>
  )
}
