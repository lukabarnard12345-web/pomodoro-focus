import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface LocalStudyBlock {
  id: string
  title: string
  startTime: string
  durationMinutes: number
}

interface CalendarState {
  localBlocks: LocalStudyBlock[]
  addLocalBlock: (block: LocalStudyBlock) => void
  removeLocalBlock: (id: string) => void
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      localBlocks: [],

      addLocalBlock: (block) =>
        set((state) => ({ localBlocks: [...state.localBlocks, block] })),

      removeLocalBlock: (id) =>
        set((state) => ({ localBlocks: state.localBlocks.filter((b) => b.id !== id) })),
    }),
    {
      name: 'pomodoro-calendar',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
)
