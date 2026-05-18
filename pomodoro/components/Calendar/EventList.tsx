'use client'

import { CalendarEvent } from '@/lib/googleCalendar'

interface Props {
  events: CalendarEvent[]
}

function formatTime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function EventList({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/15"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <p className="text-xs text-white/30">No events today</p>
        <p className="text-[10px] text-white/20">Your schedule is clear</p>
      </div>
    )
  }

  return (
    <ul className="space-y-1.5">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex items-start gap-2 rounded-lg bg-surface-2 px-3 py-2"
        >
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand/70" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white/80">{event.title}</p>
            <p className="text-[10px] text-white/40">
              {formatTime(event.start)}
              {event.end ? ` – ${formatTime(event.end)}` : ''}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
