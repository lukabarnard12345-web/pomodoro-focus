'use client'

import { motion } from 'framer-motion'
import { TimerPhase } from '@/store/timerStore'

interface Props {
  progress: number // 0–1
  phase: TimerPhase
  remaining: number
  children?: React.ReactNode
}

const RADIUS = 120
const STROKE = 8
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const PHASE_COLOR: Record<TimerPhase, string> = {
  idle: '#4c1d95',
  study: '#7c3aed',
  shortBreak: '#06b6d4',
  longBreak: '#14b8a6',
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function TimerRing({ progress, phase, remaining, children }: Props) {
  const color = PHASE_COLOR[phase]
  const offset = CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, progress)))

  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      <svg
        width={280}
        height={280}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={140}
          cy={140}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="ring-track"
        />
        {/* Progress */}
        <motion.circle
          cx={140}
          cy={140}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: offset, stroke: color }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ strokeDashoffset: offset }}
        />
      </svg>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-1 select-none">
        <motion.span
          key={phase}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-mono text-6xl font-light tracking-tighter text-white"
          style={{ textShadow: `0 0 30px ${color}60` }}
        >
          {formatTime(remaining)}
        </motion.span>
        {children}
      </div>
    </div>
  )
}
