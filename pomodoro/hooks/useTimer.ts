'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useTimerStore, TimerPhase } from '@/store/timerStore'
import { useSettingsStore } from '@/store/settingsStore'
import { playChime } from '@/lib/audio'

export function useTimer() {
  const {
    phase,
    status,
    studyDuration,
    remaining,
    setPhase,
    setStatus,
    setRemaining,
    incrementSessionCount,
    resetDailyCountIfNeeded,
    reset,
  } = useTimerStore()

  const { shortBreakDuration, longBreakDuration, audioEnabled, notificationsEnabled } =
    useSettingsStore()

  // Refs track timing without stale closure issues
  const startTimeRef = useRef<number>(0)
  const snapshotRemainingRef = useRef<number>(remaining)
  const advancingRef = useRef(false)

  const notify = useCallback(
    (message: string) => {
      if (
        notificationsEnabled &&
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        new Notification('Pomodoro Focus', { body: message })
      }
    },
    [notificationsEnabled],
  )

  const advancePhase = useCallback(() => {
    // Guard against double-firing from the interval
    if (advancingRef.current) return
    advancingRef.current = true

    if (phase === 'study') {
      incrementSessionCount()
      if (audioEnabled) playChime('end')

      // Long break after 30-min or 60-min study block; short break after 15-min
      const isLongBreak = studyDuration >= 30
      const nextPhase: TimerPhase = isLongBreak ? 'longBreak' : 'shortBreak'
      const breakSecs = (isLongBreak ? longBreakDuration : shortBreakDuration) * 60

      notify(`Study session complete! Starting ${isLongBreak ? 'long' : 'short'} break.`)
      snapshotRemainingRef.current = breakSecs
      setPhase(nextPhase)
      setRemaining(breakSecs)
      setStatus('running')
      startTimeRef.current = Date.now()
    } else {
      // Break ended → back to study, auto-start
      if (audioEnabled) playChime('start')
      notify('Break over! Time to focus.')

      const studySecs = studyDuration * 60
      snapshotRemainingRef.current = studySecs
      setPhase('study')
      setRemaining(studySecs)
      setStatus('running')
      startTimeRef.current = Date.now()
    }

    advancingRef.current = false
  }, [
    phase,
    studyDuration,
    shortBreakDuration,
    longBreakDuration,
    audioEnabled,
    setPhase,
    setRemaining,
    setStatus,
    incrementSessionCount,
    notify,
  ])

  // Main countdown interval — re-attaches only when status changes
  useEffect(() => {
    if (status !== 'running') return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const newRemaining = snapshotRemainingRef.current - elapsed

      if (newRemaining <= 0) {
        clearInterval(interval)
        advancePhase()
      } else {
        setRemaining(newRemaining)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [status, advancePhase, setRemaining])

  const start = useCallback(() => {
    resetDailyCountIfNeeded()
    const studySecs = studyDuration * 60
    snapshotRemainingRef.current = studySecs
    startTimeRef.current = Date.now()
    setPhase('study')
    setRemaining(studySecs)
    setStatus('running')
    if (audioEnabled) playChime('start')
  }, [studyDuration, audioEnabled, setPhase, setRemaining, setStatus, resetDailyCountIfNeeded])

  const pause = useCallback(() => {
    snapshotRemainingRef.current = remaining
    setStatus('paused')
  }, [remaining, setStatus])

  const resume = useCallback(() => {
    snapshotRemainingRef.current = remaining
    startTimeRef.current = Date.now()
    setStatus('running')
  }, [remaining, setStatus])

  const toggle = useCallback(() => {
    if (status === 'running') pause()
    else if (status === 'paused') resume()
    else start()
  }, [status, pause, resume, start])

  const handleReset = useCallback(() => {
    reset()
    snapshotRemainingRef.current = studyDuration * 60
  }, [reset, studyDuration])

  // Total duration for progress calculation
  const totalDuration =
    phase === 'study'
      ? studyDuration * 60
      : phase === 'longBreak'
        ? longBreakDuration * 60
        : shortBreakDuration * 60

  const progress = totalDuration > 0 ? remaining / totalDuration : 1

  return { toggle, start, pause, resume, reset: handleReset, phase, status, remaining, progress, totalDuration }
}
