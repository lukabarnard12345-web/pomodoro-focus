declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: typeof Spotify
  }

  namespace Spotify {
    class Player {
      constructor(options: PlayerInit)
      connect(): Promise<boolean>
      disconnect(): void
      addListener(event: 'ready', cb: (data: { device_id: string }) => void): boolean
      addListener(event: 'not_ready', cb: (data: { device_id: string }) => void): boolean
      addListener(
        event: 'player_state_changed',
        cb: (state: PlaybackState | null) => void,
      ): boolean
      addListener(event: 'initialization_error', cb: (data: { message: string }) => void): boolean
      addListener(event: 'authentication_error', cb: (data: { message: string }) => void): boolean
      addListener(event: 'account_error', cb: (data: { message: string }) => void): boolean
      removeListener(event: string, cb?: (data: unknown) => void): boolean
      getCurrentState(): Promise<PlaybackState | null>
      setName(name: string): Promise<void>
      getVolume(): Promise<number>
      setVolume(volume: number): Promise<void>
      pause(): Promise<void>
      resume(): Promise<void>
      togglePlay(): Promise<void>
      seek(position_ms: number): Promise<void>
      previousTrack(): Promise<void>
      nextTrack(): Promise<void>
    }

    interface PlayerInit {
      name: string
      getOAuthToken: (cb: (token: string) => void) => void
      volume?: number
      enableMediaSession?: boolean
    }

    interface PlaybackState {
      context: { uri: string; metadata: Record<string, unknown> }
      disallows: { resuming?: boolean; skipping_prev?: boolean }
      duration: number
      paused: boolean
      position: number
      repeat_mode: number
      shuffle: boolean
      track_window: {
        current_track: Track
        next_tracks: Track[]
        previous_tracks: Track[]
      }
    }

    interface Track {
      id: string
      uri: string
      type: string
      name: string
      duration_ms: number
      artists: Array<{ uri: string; name: string }>
      album: {
        uri: string
        name: string
        images: Array<{ url: string }>
      }
    }
  }
}

export {}
