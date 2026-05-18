'use client'

import { useMemo } from 'react'
import { CalendarEvent } from '@/lib/googleCalendar'

const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface Props {
  year: number
  month: number // 1-indexed
  events: CalendarEvent[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
  onNavigate: (delta: number) => void
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
}

export function MonthCalendar({
  year, month, events, selectedDate,
  onSelectDate, onNavigate, onMonthChange, onYearChange,
}: Props) {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const eventsByDate = useMemo(() => {
    const map: Record<string, number> = {}
    for (const event of events) {
      const date = event.start.split('T')[0]
      map[date] = (map[date] ?? 0) + 1
    }
    return map
  }, [events])

  const cells = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay()
    const daysInMonth = new Date(year, month, 0).getDate()
    const result: Array<{ day: number | null; dateStr: string | null }> = []
    for (let i = 0; i < firstDay; i++) result.push({ day: null, dateStr: null })
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({
        day: d,
        dateStr: `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      })
    }
    while (result.length % 7 !== 0) result.push({ day: null, dateStr: null })
    return result
  }, [year, month])

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear()
    return Array.from({ length: 11 }, (_, i) => current - 2 + i)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      {/* Header: prev / month+year / next */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onNavigate(-1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-white/70"
          aria-label="Previous month"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>

        <div className="flex flex-1 items-center justify-center gap-1.5">
          <select
            value={month}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            className="cursor-pointer rounded-md bg-transparent py-0.5 pl-1 pr-4 text-sm font-semibold text-white/80 outline-none appearance-none hover:text-white focus:text-white"
            style={{ backgroundImage: 'none' }}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1} className="bg-surface-2 text-white">
                {m}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className="cursor-pointer rounded-md bg-transparent py-0.5 pl-1 pr-4 text-sm font-semibold text-white/50 outline-none appearance-none hover:text-white/80 focus:text-white/80"
            style={{ backgroundImage: 'none' }}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y} className="bg-surface-2 text-white">
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onNavigate(1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-white/70"
          aria-label="Next month"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="py-1 text-center text-[10px] font-medium uppercase tracking-wide text-white/25">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((cell, i) => {
          if (!cell.day || !cell.dateStr) {
            return <div key={i} className="aspect-square" />
          }
          const isToday = cell.dateStr === todayStr
          const isSelected = cell.dateStr === selectedDate
          const count = eventsByDate[cell.dateStr] ?? 0

          return (
            <button
              key={cell.dateStr}
              onClick={() => onSelectDate(cell.dateStr!)}
              className={`
                relative flex flex-col items-center justify-center gap-0.5
                aspect-square rounded-lg text-xs font-medium transition-all
                ${isSelected
                  ? 'bg-brand text-white'
                  : isToday
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'}
              `}
            >
              <span>{cell.day}</span>
              {count > 0 && (
                <span className={`h-1 w-1 rounded-full ${isSelected ? 'bg-white/70' : 'bg-brand/70'}`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
