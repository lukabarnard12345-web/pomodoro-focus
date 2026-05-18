const BASE = 'https://api.spotify.com/v1'

async function spotifyFetch(
  path: string,
  token: string,
  opts: RequestInit = {},
): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  })
}

export async function getPlaybackState(token: string) {
  const res = await spotifyFetch('/me/player', token)
  if (res.status === 204 || !res.ok) return null
  return res.json() as Promise<SpotifyPlaybackState>
}

export async function transferPlayback(token: string, deviceId: string, play = false): Promise<void> {
  await spotifyFetch('/me/player', token, {
    method: 'PUT',
    body: JSON.stringify({ device_ids: [deviceId], play }),
  })
}

export async function setVolume(token: string, volumePercent: number): Promise<void> {
  await spotifyFetch(`/me/player/volume?volume_percent=${volumePercent}`, token, {
    method: 'PUT',
  })
}

export async function startPlayback(token: string, deviceId: string): Promise<void> {
  await spotifyFetch(`/me/player/play?device_id=${deviceId}`, token, {
    method: 'PUT',
    body: '{}',
  })
}

export async function skipNext(token: string): Promise<void> {
  await spotifyFetch('/me/player/next', token, { method: 'POST' })
}

export async function skipPrevious(token: string): Promise<void> {
  await spotifyFetch('/me/player/previous', token, { method: 'POST' })
}

export interface SpotifyPlaybackState {
  is_playing: boolean
  item: {
    id: string
    name: string
    duration_ms: number
    artists: Array<{ name: string }>
    album: {
      name: string
      images: Array<{ url: string; width: number; height: number }>
    }
  } | null
  device: {
    id: string
    name: string
    volume_percent: number
  } | null
}
