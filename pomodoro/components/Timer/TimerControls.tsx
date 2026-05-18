'use client'

import { motion } from 'framer-motion'
import { TimerStatus } from '@/store/timerStore'
import { PlayIcon, PauseIcon, ResetIcon } from '@/components/UI/Icons'

interface Props {
  status: TimerStatus
  onToggle: () => void
  onReset: () => void
}

export function TimerControls({ status, onToggle, onReset }: Props) {
  const isRunning = status === 'running'
  const isIdle = status === 'idle'

  return (
    <div className="flex items-center gap-4">
      {/* Play / Pause */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        aria-label={isRunning ? 'Pause timer' : status === 'paused' ? 'Resume timer' : 'Start timer'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
      >
        {isRunning ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
      </motion.button>

      {/* Reset — only shown when not idle */}
      {!isIdle && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          aria-label="Reset timer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-3 text-white/60 transition-colors hover:bg-surface-2 hover:text-white"
        >
          <ResetIcon size={16} />
        </motion.button>
      )}
    </div>
  )
}
