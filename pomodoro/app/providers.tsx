'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { useTaskStore } from '@/store/taskStore'
import { useTimerStore } from '@/store/timerStore'
import { useCalendarStore } from '@/store/calendarStore'

function StoreHydrator() {
  useEffect(() => {
    useSettingsStore.persist.rehydrate()
    useTaskStore.persist.rehydrate()
    useTimerStore.persist.rehydrate()
    useCalendarStore.persist.rehydrate()
  }, [])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreHydrator />
      {children}
    </SessionProvider>
  )
}
