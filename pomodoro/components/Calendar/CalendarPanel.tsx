'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useCalendar } from '@/hooks/useCalendar'
import { MonthCalendar } from './MonthCalendar'
import { DayDetail } from './DayDetail'
import { Button } from '@/components/UI/Button'
import { GoogleIcon, RefreshIcon } from '@/components/UI/Icons'

export function CalendarPanel() {
  const { data: session } = useSession()
  const {
    events,
    loading,
    error,
    isGoogleConnected,
    viewYear,
    viewMonth,
    selectedDate,
    setSelectedDate,
    setViewMonth,
    setViewYear,
    navigateMonth,
    fetchEvents,
    createStudyBlock,
    deleteEvent,
  } = useCalendar()

  const isTokenError = error?.includes('401') || error?.toLowerCase().includes('token')

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Not connected */}
      {!isGoogleConnected && (
        <div className="flex flex-col gap-3 rounded-xl bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
              <GoogleIcon size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Google Calendar</p>
              <p className="mt-0.5 text-xs text-white/40">Sync events and schedule study blocks</p>
            </div>
          </div>
          <Button variant="primary" size="sm" pill onClick={() => signIn('google')} className="w-full justify-center">
            <GoogleIcon size={13} />
            Sign in with Google
          </Button>
        </div>
      )}

      {/* Connected — account row */}
      {isGoogleConnected && (
        <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2">
          {session?.user?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="" className="h-5 w-5 rounded-full" />
          )}
          <span className="flex-1 truncate text-[11px] text-white/50">{session?.user?.email}</span>
          <button
            onClick={fetchEvents}
            aria-label="Refresh"
            className="flex h-5 w-5 items-center justify-center rounded text-white/25 transition-colors hover:text-white/60"
          >
            <RefreshIcon size={11} />
          </button>
          <button
            onClick={() => signOut({ redirect: false })}
            className="text-[10px] text-white/25 transition-colors hover:text-white/50"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {isTokenError ? 'Session expired.' : error}
          {isTokenError && (
            <button onClick={() => signIn('google')} className="ml-1.5 underline hover:no-underline">
              Reconnect
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-[11px] text-white/30">
          <div className="h-3 w-3 animate-spin rounded-full border border-white/20 border-t-white/50" />
          Loading…
        </div>
      )}

      {/* Calendar grid */}
      <MonthCalendar
        year={viewYear}
        month={viewMonth}
        events={events}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onNavigate={navigateMonth}
        onMonthChange={(m) => setViewMonth(m)}
        onYearChange={(y) => setViewYear(y)}
      />

      {/* Divider */}
      <div className="border-t border-white/[0.06]" />

      {/* Day detail */}
      {selectedDate && (
        <div className="flex-1 overflow-y-auto">
          <DayDetail
            date={selectedDate}
            events={events}
            isConnected={isGoogleConnected}
            onCreateBlock={createStudyBlock}
            onDeleteEvent={deleteEvent}
          />
        </div>
      )}
    </div>
  )
}
