import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import SpotifyProvider from 'next-auth/providers/spotify'
import GoogleProvider from 'next-auth/providers/google'

async function refreshSpotifyToken(token: JWT): Promise<JWT> {
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token.spotifyRefreshToken ?? '',
    })

    const creds = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
    ).toString('base64')

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${creds}`,
      },
      body: params.toString(),
    })

    const data = (await res.json()) as {
      access_token?: string
      expires_in?: number
      error?: string
    }

    if (data.error || !data.access_token) {
      return { ...token, spotifyAccessToken: undefined }
    }

    return {
      ...token,
      spotifyAccessToken: data.access_token,
      spotifyExpiresAt: Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600),
    }
  } catch {
    return { ...token, spotifyAccessToken: undefined }
  }
}

async function refreshGoogleToken(token: JWT): Promise<JWT> {
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token.googleRefreshToken ?? '',
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    })

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    const data = (await res.json()) as {
      access_token?: string
      expires_in?: number
      error?: string
    }

    if (data.error || !data.access_token) {
      return { ...token, googleAccessToken: undefined }
    }

    return {
      ...token,
      googleAccessToken: data.access_token,
      googleExpiresAt: Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600),
    }
  } catch {
    return { ...token, googleAccessToken: undefined }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID ?? '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope:
            'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing',
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope:
            'openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === 'spotify') {
        token.spotifyAccessToken = account.access_token
        token.spotifyRefreshToken = account.refresh_token
        token.spotifyExpiresAt = account.expires_at
      }
      if (account?.provider === 'google') {
        token.googleAccessToken = account.access_token
        token.googleRefreshToken = account.refresh_token
        token.googleExpiresAt = account.expires_at ?? Math.floor(Date.now() / 1000) + 3600
      }

      // Auto-refresh Spotify token 60s before expiry
      if (token.spotifyExpiresAt && Date.now() / 1000 > token.spotifyExpiresAt - 60) {
        return refreshSpotifyToken(token)
      }

      // Auto-refresh Google token 60s before expiry
      if (
        token.googleRefreshToken &&
        token.googleExpiresAt &&
        Date.now() / 1000 > (token.googleExpiresAt as number) - 60
      ) {
        return refreshGoogleToken(token)
      }

      return token
    },

    async session({ session, token }) {
      session.spotifyToken = token.spotifyAccessToken
      session.googleToken = token.googleAccessToken
      return session
    },
  },

  pages: {
    signIn: '/',
  },
}
