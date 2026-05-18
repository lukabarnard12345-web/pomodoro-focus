import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTodaysEvents, createStudyBlock } from '@/lib/googleCalendar'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.googleToken) {
    return NextResponse.json({ error: 'Not authenticated with Google' }, { status: 401 })
  }

  try {
    const events = await getTodaysEvents(session.googleToken)
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
