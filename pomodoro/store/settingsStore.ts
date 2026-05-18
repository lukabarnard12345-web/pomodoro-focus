import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface BackgroundConfig {
  type: 'preset' | 'upload' | 'none'
  url: string
  dimmer: number // 0–80
}

interface SettingsState {
  shortBreakDuration: number
  longBreakDuration: number
  audioEnabled: boolean
  notificationsEnabled: boolean
  background: BackgroundConfig

  setShortBreakDuration: (duration: number) => void
  setLongBreakDuration: (duration: number) => void
  setAudioEnabled: (enabled: boolean) => void
  setNotificationsEnabled: (enabled: boolean) => void
  setBackground: (bg: Partial<BackgroundConfig>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      shortBreakDuration: 5,
      longBreakDuration: 10,
      audioEnabled: true,
      notificationsEnabled: true,
      background: { type: 'none', url: '', dimmer: 40 },

      setShortBreakDuration: (shortBreakDuration) => set({ shortBreakDuration }),
      setLongBreakDuration: (longBreakDuration) => set({ longBreakDuration }),
      setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setBackground: (bg) => set({ background: { ...get().background, ...bg } }),
    }),
    {
      name: 'pomodoro-settings',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
)
