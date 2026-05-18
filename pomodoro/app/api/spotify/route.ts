import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPlaybackState, transferPlayback, setVolume, skipNext, skipPrevious } from '@/lib/spotify'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.spotifyToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const state = await getPlaybackState(session.spotifyToken)
  return NextResponse.json(state ?? {})
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.spotifyToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { action, deviceId, volume } = (await req.json()) as {
    action: string
    deviceId?: string
    volume?: number
    play?: boolean
  }

  try {
    switch (action) {
      case 'transfer':
        if (!deviceId) return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 })
        await transferPlayback(session.spotifyToken, deviceId)
        break
      case 'volume':
        if (volume === undefined) return NextResponse.json({ error: 'Missing volume' }, { status: 400 })
        await setVolume(session.spotifyToken, volume)
        break
      case 'next':
        await skipNext(session.spotifyToken)
        break
      case 'previous':
        await skipPrevious(session.spotifyToken)
        break
      case 'play':
        if (!deviceId) return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 })
        await transferPlayback(session.spotifyToken, deviceId, true)
        break
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Spotify API error' }, { status: 500 })
  }
}
