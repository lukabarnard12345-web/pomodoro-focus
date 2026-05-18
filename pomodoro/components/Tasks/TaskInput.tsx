'use client'

import { useState, FormEvent } from 'react'
import { Priority } from '@/store/taskStore'

interface Props {
  onAdd: (title: string, priority: Priority) => void
}

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: 'bg-red-500' },
  { value: 'medium', label: 'Med', color: 'bg-amber-400' },
  { value: 'low', label: 'Low', color: 'bg-green-400' },
]

export function TaskInput({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), priority)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task…"
        maxLength={120}
        className="w-full rounded-lg border border-white/10 bg-surface-2 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-brand/50"
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {PRIORITY_OPTIONS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              aria-pressed={priority === p.value}
              className={[
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                priority === p.value ? 'bg-surface-2 text-white ring-1 ring-white/20' : 'text-white/40 hover:text-white/70',
              ].join(' ')}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${p.color}`} />
              {p.label}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-md bg-brand px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-brand-light disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </form>
  )
}
