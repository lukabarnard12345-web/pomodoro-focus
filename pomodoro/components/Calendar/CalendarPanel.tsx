'use client'

import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useCalendar } from '@/hooks/useCalendar'
import { useTimerStore } from '@/store/timerStore'
import { EventList } from './EventList'
import { Button } from '@/components/UI/Button'
import { GoogleIcon, RefreshIcon, CloseIcon } from '@/components/UI/Icons'

export function CalendarPanel() {
  const { data: session } = useSession()
  const {
    events,
    localBlocks,
    loading,
    error,
    isGoogleConnected,
    fetchEvents,
    createStudyBlock,
    removeLocalBlock,
  } = useCalendar()

  const { studyDuration } = useTimerStore()
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const handleCreateBlock = async () => {
    setCreating(true)
    setCreateError('')
    const now = new Date()
    now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5, 0, 0)
    const result = await createStudyBlock('Focus Block', now.toISOString(), studyDuration)
    if (!result.ok) setCreateError(result.error ?? 'Failed to create block.')
    setCreating(false)
  }

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const isTokenError = error?.includes('401') || error?.toLowerCase().includes('token')

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Date + refresh */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-white/50">{today}</p>
        {isGoogleConnected && (
          <button
            onClick={fetchEvents}
            aria-label="Refresh events"
            className="flex h-6 w-6 items-center justify-center rounded text-white/30 transition-colors hover:bg-surface-3 hover:text-white"
          >
            <RefreshIcon size={12} />
          </button>
        )}
      </div>

      {/* Not connected */}
      {!isGoogleConnected && (
        <div className="flex flex-col gap-3 rounded-xl bg-surface-2 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
              <GoogleIcon size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Google Calendar</p>
              <p className="text-xs text-white/40 mt-0.5">See events and schedule study blocks</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            pill
            onClick={() => signIn('google')}
            className="w-full justify-center"
          >
            <GoogleIcon size={13} />
            Sign in with Google
          </Button>
        </div>
      )}

      {/* Connected */}
      {isGoogleConnected && (
        <>
          {/* Account row */}
          <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2">
            {session?.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="" className="h-5 w-5 rounded-full" />
            )}
            <span className="flex-1 truncate text-xs text-white/60">{session?.user?.email}</span>
            <button
              onClick={() => signOut({ redirect: false })}
              className="text-[10px] text-white/30 transition-colors hover:text-white/60"
            >
              Disconnect
            </button>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-xs text-white/30">
              <div className="h-3 w-3 animate-spin rounded-full border border-white/20 border-t-white/60" />
              Loading events…
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {isTokenError ? 'Session expired. Please reconnect.' : error}
              {isTokenError && (
                <button
                  onClick={() => signIn('google')}
                  className="ml-1.5 underline hover:no-underline"
                >
                  Reconnect
                </button>
              )}
            </div>
          )}

          {!loading && !error && <EventList events={events} />}
        </>
      )}

      {/* Local blocks (offline) */}
      {!isGoogleConnected && localBlocks.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
            Local blocks
          </p>
          {localBlocks.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-xs"
            >
              <span className="text-white/70">{b.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-white/30">{b.durationMinutes}m</span>
                <button
                  onClick={() => removeLocalBlock(b.id)}
                  aria-label="Remove block"
                  className="text-white/30 transition-colors hover:text-red-400"
                >
                  <CloseIcon size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule study block */}
      <div className="mt-auto pt-2 border-t border-white/[0.06]">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCreateBlock}
          disabled={creating}
          className="w-full justify-center"
        >
          {creating ? 'Scheduling…' : `+ Schedule ${studyDuration}m study block`}
        </Button>
        {createError && <p className="mt-1 text-xs text-red-400">{createError}</p>}
      </div>
    </div>
  )
}
