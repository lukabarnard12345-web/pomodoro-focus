'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { CalendarEvent } from '@/lib/googleCalendar'
import { useCalendarStore } from '@/store/calendarStore'

export function useCalendar() {
  const { data: session } = useSession()
  const isGoogleConnected = !!session?.googleToken
  const { localBlocks, addLocalBlock, removeLocalBlock } = useCalendarStore()

  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    if (!isGoogleConnected) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/calendar')
      if (!res.ok) throw new Error('Failed to fetch calendar events')
      const data = (await res.json()) as CalendarEvent[]
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [isGoogleConnected])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const createStudyBlock = useCallback(
    async (title: string, startTime: string, durationMinutes: number) => {
      if (!isGoogleConnected) {
        addLocalBlock({ id: crypto.randomUUID(), title, startTime, durationMinutes })
        return { ok: true }
      }

      try {
        const res = await fetch('/api/calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, startTime, durationMinutes }),
        })
        if (!res.ok) throw new Error('Failed to create event')
        await fetchEvents()
        return { ok: true }
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' }
      }
    },
    [isGoogleConnected, fetchEvents, addLocalBlock],
  )

  return {
    events,
    localBlocks,
    loading,
    error,
    isGoogleConnected,
    fetchEvents,
    createStudyBlock,
    removeLocalBlock,
  }
}
