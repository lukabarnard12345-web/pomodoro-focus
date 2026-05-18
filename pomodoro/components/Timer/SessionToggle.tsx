'use client'

import { StudyDuration } from '@/store/timerStore'
import { TimerStatus } from '@/store/timerStore'

interface Props {
  current: StudyDuration
  status: TimerStatus
  onChange: (duration: StudyDuration) => void
}

const OPTIONS: StudyDuration[] = [15, 30, 60]

export function SessionToggle({ current, status, onChange }: Props) {
  const disabled = status !== 'idle'

  return (
    <div className="flex items-center gap-1 rounded-full bg-surface-2 p-1">
      {OPTIONS.map((d) => (
        <button
          key={d}
          onClick={() => !disabled && onChange(d)}
          disabled={disabled}
          aria-label={`${d} minute session`}
          aria-pressed={current === d}
          className={[
            'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
            current === d
              ? 'bg-brand text-white shadow-sm shadow-brand/40'
              : 'text-white/50 hover:text-white/80',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          ].join(' ')}
        >
          {d}m
        </button>
      ))}
    </div>
  )
}
