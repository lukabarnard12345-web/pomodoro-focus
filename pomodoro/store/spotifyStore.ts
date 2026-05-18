import { create } from 'zustand'

export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string; width: number; height: number }>
  }
  duration_ms: number
}

interface SpotifyState {
  isConnected: boolean
  isPremium: boolean
  isPlaying: boolean
  currentTrack: SpotifyTrack | null
  position: number   // ms
  duration: number   // ms
  volume: number
  deviceId: string | null
  playerReady: boolean
  error: string | null

  setConnected: (connected: boolean) => void
  setPremium: (premium: boolean) => void
  setPlaying: (playing: boolean) => void
  setCurrentTrack: (track: SpotifyTrack | null) => void
  setPosition: (position: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  setDeviceId: (deviceId: string | null) => void
  setPlayerReady: (ready: boolean) => void
  setError: (error: string | null) => void
}

export const useSpotifyStore = create<SpotifyState>()((set) => ({
  isConnected: false,
  isPremium: true,
  isPlaying: false,
  currentTrack: null,
  position: 0,
  duration: 0,
  volume: 50,
  deviceId: null,
  playerReady: false,
  error: null,

  setConnected: (isConnected) => set({ isConnected }),
  setPremium: (isPremium) => set({ isPremium }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTrack: (currentTrack) => set({ currentTrack }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setPlayerReady: (playerReady) => set({ playerReady }),
  setError: (error) => set({ error }),
}))
