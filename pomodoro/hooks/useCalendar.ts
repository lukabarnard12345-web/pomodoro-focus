'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { CalendarEvent } from '@/lib/googleCalendar'
import { useCalendarStore } from '@/store/calendarStore'

export function useCalendar() {
  const { data: session } = useSession()
  const isGoogleConnected = !!session?.googleToken
  const { localBlocks, addLocalBlock, removeLocalBlock } = useCalendarStore()

  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState<string | null>(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
  )

  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(
    async (year?: number, month?: number) => {
      if (!isGoogleConnected) return
      const y = year ?? viewYear
      const m = month ?? viewMonth
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/calendar?year=${y}&month=${m}`)
        if (!res.ok) throw new Error('Failed to fetch calendar events')
        const data = (await res.json()) as CalendarEvent[]
        setEvents(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    },
    [isGoogleConnected, viewYear, viewMonth],
  )

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const navigateMonth = useCallback(
    (delta: number) => {
      let newMonth = viewMonth + delta
      let newYear = viewYear
      if (newMonth > 12) { newMonth = 1; newYear++ }
      if (newMonth < 1) { newMonth = 12; newYear-- }
      setViewMonth(newMonth)
      setViewYear(newYear)
    },
    [viewMonth, viewYear],
  )

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      await fetch(`/api/calendar?id=${eventId}`, { method: 'DELETE' })
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
    } catch {}
  }, [])

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
    viewYear,
    viewMonth,
    selectedDate,
    setSelectedDate,
    setViewYear,
    setViewMonth,
    navigateMonth,
    fetchEvents: () => fetchEvents(),
    createStudyBlock,
    removeLocalBlock,
    deleteEvent,
  }
}
