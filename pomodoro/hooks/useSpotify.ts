'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useSpotifyStore, SpotifyTrack } from '@/store/spotifyStore'

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: typeof Spotify
  }
}

export function useSpotify() {
  const { data: session } = useSession()
  const playerRef = useRef<Spotify.Player | null>(null)
  const store = useSpotifyStore()
  const positionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const token = session?.spotifyToken

  // Poll position every second while playing for smooth progress bar
  const startPositionPoll = useCallback(() => {
    if (positionIntervalRef.current) return
    positionIntervalRef.current = setInterval(async () => {
      const state = await playerRef.current?.getCurrentState()
      if (state) {
        store.setPosition(state.position)
        store.setDuration(state.duration)
      }
    }, 1000)
  }, [store])

  const stopPositionPoll = useCallback(() => {
    if (positionIntervalRef.current) {
      clearInterval(positionIntervalRef.current)
      positionIntervalRef.current = null
    }
  }, [])

  const initPlayer = useCallback(() => {
    if (!token || playerRef.current) return

    const player = new window.Spotify.Player({
      name: 'Pomodoro Focus',
      volume: store.volume / 100,
      getOAuthToken: (cb) => cb(token),
    })

    player.addListener('ready', ({ device_id }) => {
      store.setDeviceId(device_id)
      store.setPlayerReady(true)
      store.setConnected(true)
      fetch('/api/spotify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'transfer', deviceId: device_id }),
      }).catch(() => null)
    })

    player.addListener('not_ready', () => {
      store.setPlayerReady(false)
      stopPositionPoll()
    })

    player.addListener('player_state_changed', (state) => {
      if (!state) return
      const t = state.track_window.current_track
      const track: SpotifyTrack = {
        id: t.id,
        name: t.name,
        artists: t.artists.map((a) => ({ name: a.name })),
        album: {
          name: t.album.name,
          images: t.album.images.map((img) => ({ url: img.url, width: 0, height: 0 })),
        },
        duration_ms: t.duration_ms,
      }
      store.setCurrentTrack(track)
      store.setPlaying(!state.paused)
      store.setPosition(state.position)
      store.setDuration(state.duration)

      if (!state.paused) startPositionPoll()
      else stopPositionPoll()
    })

    player.addListener('initialization_error', ({ message }) => {
      store.setError(`Init error: ${message}`)
    })

    player.addListener('authentication_error', ({ message }) => {
      store.setError(`Auth error: ${message}`)
      store.setConnected(false)
    })

    player.addListener('account_error', () => {
      store.setPremium(false)
      store.setError('Spotify Premium is required for in-browser playback.')
    })

    player.connect().then((success) => {
      if (!success) store.setError('Failed to connect Spotify player.')
    })

    playerRef.current = player
  }, [token, store, startPositionPoll, stopPositionPoll])

  useEffect(() => {
    if (!token) return

    if (typeof window !== 'undefined' && window.Spotify) {
      initPlayer()
      return
    }

    window.onSpotifyWebPlaybackSDKReady = initPlayer

    return () => {
      stopPositionPoll()
      playerRef.current?.disconnect()
      playerRef.current = null
    }
  }, [token, initPlayer, stopPositionPoll])

  const togglePlay = useCallback(async () => {
    await playerRef.current?.togglePlay()
  }, [])

  const nextTrack = useCallback(async () => {
    await playerRef.current?.nextTrack()
  }, [])

  const previousTrack = useCallback(async () => {
    await playerRef.current?.previousTrack()
  }, [])

  const seek = useCallback(async (ms: number) => {
    await playerRef.current?.seek(ms)
    store.setPosition(ms)
  }, [store])

  const setVolume = useCallback(
    async (vol: number) => {
      const clamped = Math.min(100, Math.max(0, vol))
      store.setVolume(clamped)
      await playerRef.current?.setVolume(clamped / 100)
      fetch('/api/spotify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'volume', volume: clamped }),
      }).catch(() => null)
    },
    [store],
  )

  const resume = useCallback(async () => {
    if (!store.deviceId) return
    await fetch('/api/spotify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'play', deviceId: store.deviceId }),
    })
  }, [store.deviceId])

  return {
    ...store,
    isLoggedIn: !!token,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    resume,
  }
}
