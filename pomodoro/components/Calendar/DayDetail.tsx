'use client'

import { useState } from 'react'
import { CalendarEvent } from '@/lib/googleCalendar'
import { CloseIcon } from '@/components/UI/Icons'

interface Props {
  date: string // YYYY-MM-DD
  events: CalendarEvent[]
  isConnected: boolean
  onCreateBlock: (title: string, startTime: string, durationMinutes: number) => Promise<{ ok: boolean; error?: string }>
  onDeleteEvent: (id: string) => void
}

function formatTime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

const DURATIONS = [15, 25, 30, 45, 60, 90]

export function DayDetail({ date, events, isConnected, onCreateBlock, onDeleteEvent }: Props) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('Focus Block')
  const [time, setTime] = useState('09:00')
  const [duration, setDuration] = useState(30)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const dayEvents = events.filter((e) => e.start.startsWith(date))

  const handleAdd = async () => {
    setSaving(true)
    setSaveError('')
    const startTime = new Date(`${date}T${time}:00`).toISOString()
    const result = await onCreateBlock(title || 'Focus Block', startTime, duration)
    setSaving(false)
    if (result.ok) {
      setAdding(false)
      setTitle('Focus Block')
      setTime('09:00')
      setDuration(30)
    } else {
      setSaveError(result.error ?? 'Failed to create')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Day label */}
      <p className="text-[11px] font-medium text-white/40">{formatDate(date)}</p>

      {/* Events */}
      {dayEvents.length > 0 ? (
        <ul className="space-y-1">
          {dayEvents.map((event) => (
            <li
              key={event.id}
              className="group flex items-start gap-2 rounded-lg bg-white/[0.04] px-2.5 py-2"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white/80">{event.title}</p>
                {event.start && (
                  <p className="text-[10px] text-white/35">
                    {formatTime(event.start)}
                    {event.end ? ` – ${formatTime(event.end)}` : ''}
                  </p>
                )}
              </div>
              {isConnected && (
                <button
                  onClick={() => onDeleteEvent(event.id)}
                  className="shrink-0 text-white/20 opacity-0 transition-all group-hover:opacity-100 hover:text-red-400"
                  aria-label="Delete event"
                >
                  <CloseIcon size={10} />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[10px] text-white/25">No events this day</p>
      )}

      {/* Add study block */}
      {!adding ? (
        <button
          onClick={() => setAdding(true)}
          className="mt-1 flex items-center gap-1.5 rounded-lg border border-dashed border-white/10 px-3 py-2 text-[11px] text-white/35 transition-colors hover:border-white/20 hover:text-white/60"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Add study block
        </button>
      ) : (
        <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Block title"
            className="w-full rounded-md border border-white/10 bg-surface-2 px-2.5 py-1.5 text-xs text-white/80 placeholder-white/25 outline-none focus:border-brand/40"
          />
          <div className="flex gap-2">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex-1 rounded-md border border-white/10 bg-surface-2 px-2.5 py-1.5 text-xs text-white/80 outline-none focus:border-brand/40 [color-scheme:dark]"
            />
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="rounded-md border border-white/10 bg-surface-2 px-2 py-1.5 text-xs text-white/80 outline-none focus:border-brand/40"
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d}>{d}m</option>
              ))}
            </select>
          </div>
          {saveError && <p className="text-[10px] text-red-400">{saveError}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="flex-1 rounded-lg bg-brand py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-light disabled:opacity-50"
            >
              {saving ? 'Adding…' : 'Add'}
            </button>
            <button
              onClick={() => { setAdding(false); setSaveError('') }}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
