import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getEventsForMonth, createStudyBlock, deleteCalendarEvent } from '@/lib/googleCalendar'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.googleToken) {
    return NextResponse.json({ error: 'Not authenticated with Google' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const now = new Date()
  const year = parseInt(searchParams.get('year') ?? String(now.getFullYear()))
  const month = parseInt(searchParams.get('month') ?? String(now.getMonth() + 1))

  try {
    const events = await getEventsForMonth(session.googleToken, year, month)
    return NextResponse.json(events)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.googleToken) {
    return NextResponse.json({ error: 'Not authenticated with Google' }, { status: 401 })
  }

  const body = (await req.json()) as {
    title: string
    startTime: string
    durationMinutes: number
  }

  if (!body.title || !body.startTime || !body.durationMinutes) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const eventId = await createStudyBlock(session.googleToken, body)
    return NextResponse.json({ eventId })
  } catch {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.googleToken) {
    return NextResponse.json({ error: 'Not authenticated with Google' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('id')
  if (!eventId) {
    return NextResponse.json({ error: 'Missing event ID' }, { status: 400 })
  }

  try {
    await deleteCalendarEvent(session.googleToken, eventId)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
