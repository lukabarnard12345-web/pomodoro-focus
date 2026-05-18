'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTimer } from '@/hooks/useTimer'
import { useTimerStore } from '@/store/timerStore'
import { TimerRing } from '@/components/Timer/TimerRing'
import { TimerControls } from '@/components/Timer/TimerControls'
import { SessionToggle } from '@/components/Timer/SessionToggle'
import { SpotifyPlayer } from '@/components/Spotify/SpotifyPlayer'
import { TaskBar } from '@/components/Tasks/TaskBar'
import { CalendarPanel } from '@/components/Calendar/CalendarPanel'
import { BackgroundOverlay } from '@/components/Background/BackgroundOverlay'
import { BackgroundSelector } from '@/components/Background/BackgroundSelector'
import { SettingsModal } from '@/components/Settings/SettingsModal'
import { Sidebar } from '@/components/UI/Sidebar'
import { IconButton } from '@/components/UI/IconButton'
import {
  TasksIcon,
  CalendarIcon,
  SpotifyIcon,
  ImageIcon,
  SettingsIcon,
} from '@/components/UI/Icons'

type Panel = 'tasks' | 'calendar' | 'spotify' | null

const PHASE_LABEL: Record<string, string> = {
  idle: 'Ready to focus',
  study: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}

const PHASE_BG: Record<string, string> = {
  idle: 'from-surface to-surface-1',
  study: 'from-rose-950/60 to-surface',
  shortBreak: 'from-amber-950/60 to-surface',
  longBreak: 'from-orange-950/60 to-surface',
}

export default function Home() {
  const { toggle, reset, phase, status, remaining, progress } = useTimer()
  const { studyDuration, setStudyDuration, sessionCount } = useTimerStore()

  const [activePanel, setActivePanel] = useState<Panel>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showBackground, setShowBackground] = useState(false)

  // Space bar — pause/resume
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [toggle])

  const togglePanel = (panel: Panel) =>
    setActivePanel((prev) => (prev === panel ? null : panel))

  // Session dots: groups of 4, max 8 visible
  const visibleSessions = Math.min(sessionCount, 8)
  const overflowSessions = sessionCount > 8 ? sessionCount - 8 : 0

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface">
      {/* Background image + dimmer */}
      <BackgroundOverlay />

      {/* Phase-tinted gradient overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`pointer-events-none fixed inset-0 z-[2] bg-gradient-to-b ${PHASE_BG[phase]}`}
        />
      </AnimatePresence>

      {/* Main layout */}
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-2 md:px-6">
          <div className="flex items-center gap-0.5">
            <IconButton
              label="Tasks"
              showLabel
              active={activePanel === 'tasks'}
              onClick={() => togglePanel('tasks')}
            >
              <TasksIcon />
            </IconButton>
            <IconButton
              label="Calendar"
              showLabel
              active={activePanel === 'calendar'}
              onClick={() => togglePanel('calendar')}
            >
              <CalendarIcon />
            </IconButton>
          </div>

          <motion.span
            className="hidden text-xs font-medium tracking-widest text-white/30 uppercase md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Pomodoro Focus
          </motion.span>

          <div className="flex items-center gap-0.5">
            <IconButton
              label="Music"
              showLabel
              active={activePanel === 'spotify'}
              onClick={() => togglePanel('spotify')}
            >
              <SpotifyIcon />
            </IconButton>
            <IconButton label="Background" showLabel onClick={() => setShowBackground(true)}>
              <ImageIcon />
            </IconButton>
            <IconButton label="Settings" showLabel onClick={() => setShowSettings(true)}>
              <SettingsIcon />
            </IconButton>
          </div>
        </header>

        {/* Center stage */}
        <main className="flex flex-1 w-full flex-col items-center justify-center gap-8 px-4">
          {/* Session counter */}
          {sessionCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
                {Array.from({ length: Math.ceil(visibleSessions / 4) }).map((_, rowIdx) => (
                  <div key={rowIdx} className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(4, visibleSessions - rowIdx * 4) }).map((_, i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-brand/60" />
                    ))}
                  </div>
                ))}
              </div>
              {overflowSessions > 0 && (
                <span className="text-[10px] text-white/40">+{overflowSessions} more</span>
              )}
              <span className="text-[10px] text-white/30">
                {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'} today
              </span>
            </motion.div>
          )}

          {/* Phase label */}
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-sm font-medium tracking-wider text-white/50 uppercase"
            >
              {PHASE_LABEL[phase]}
            </motion.p>
          </AnimatePresence>

          {/* Timer ring */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <TimerRing progress={progress} phase={phase} remaining={remaining}>
                <span className="text-xs text-white/40">
                  {status === 'paused' ? 'Paused' : status === 'idle' ? 'Space to start' : ''}
                </span>
              </TimerRing>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <TimerControls status={status} onToggle={toggle} onReset={reset} />

          {/* Session toggle — only in idle */}
          <AnimatePresence>
            {status === 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <SessionToggle
                  current={studyDuration as 15 | 30 | 60}
                  status={status}
                  onChange={setStudyDuration}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom hint */}
        <footer className="py-4 text-center">
          <p className="text-[10px] text-white/20">Press Space to start / pause</p>
        </footer>
      </div>

      {/* Sidebars */}
      <Sidebar
        title="Tasks"
        isOpen={activePanel === 'tasks'}
        onClose={() => setActivePanel(null)}
        side="left"
      >
        <TaskBar />
      </Sidebar>

      <Sidebar
        title="Calendar"
        isOpen={activePanel === 'calendar'}
        onClose={() => setActivePanel(null)}
        side="left"
        width={300}
      >
        <CalendarPanel />
      </Sidebar>

      <Sidebar
        title="Spotify"
        isOpen={activePanel === 'spotify'}
        onClose={() => setActivePanel(null)}
        side="right"
        width={320}
      >
        <SpotifyPlayer />
      </Sidebar>

      {/* Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BackgroundSelector isOpen={showBackground} onClose={() => setShowBackground(false)} />
    </div>
  )
}
