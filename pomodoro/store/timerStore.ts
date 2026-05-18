import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type TimerPhase = 'idle' | 'study' | 'shortBreak' | 'longBreak'
export type TimerStatus = 'idle' | 'running' | 'paused'
export type StudyDuration = 15 | 30 | 60

interface TimerState {
  phase: TimerPhase
  status: TimerStatus
  studyDuration: StudyDuration
  remaining: number
  sessionCount: number
  lastSessionDate: string
  linkedTaskId: string | null

  setPhase: (phase: TimerPhase) => void
  setStatus: (status: TimerStatus) => void
  setStudyDuration: (duration: StudyDuration) => void
  setRemaining: (remaining: number) => void
  incrementSessionCount: () => void
  resetDailyCountIfNeeded: () => void
  setLinkedTask: (taskId: string | null) => void
  reset: () => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      phase: 'idle',
      status: 'idle',
      studyDuration: 30 as StudyDuration,
      remaining: 30 * 60,
      sessionCount: 0,
      lastSessionDate: '',
      linkedTaskId: null,

      setPhase: (phase) => set({ phase }),
      setStatus: (status) => set({ status }),
      setStudyDuration: (studyDuration) =>
        set({ studyDuration, remaining: studyDuration * 60, phase: 'idle', status: 'idle' }),
      setRemaining: (remaining) => set({ remaining }),

      incrementSessionCount: () => {
        const today = new Date().toISOString().slice(0, 10)
        const { lastSessionDate, sessionCount } = get()
        const count = lastSessionDate === today ? sessionCount + 1 : 1
        set({ sessionCount: count, lastSessionDate: today })
      },

      resetDailyCountIfNeeded: () => {
        const today = new Date().toISOString().slice(0, 10)
        if (get().lastSessionDate !== today) {
          set({ sessionCount: 0, lastSessionDate: today })
        }
      },

      setLinkedTask: (linkedTaskId) => set({ linkedTaskId }),

      reset: () =>
        set((state) => ({
          phase: 'idle',
          status: 'idle',
          remaining: state.studyDuration * 60,
        })),
    }),
    {
      name: 'pomodoro-timer',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      // Don't persist running state — resume from paused on reload
      partialize: (state) => ({
        studyDuration: state.studyDuration,
        sessionCount: state.sessionCount,
        lastSessionDate: state.lastSessionDate,
        linkedTaskId: state.linkedTaskId,
      }),
    },
  ),
)
