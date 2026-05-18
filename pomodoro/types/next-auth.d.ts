import 'next-auth'

declare module 'next-auth' {
  interface Session {
    spotifyToken?: string
    googleToken?: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    spotifyAccessToken?: string
    spotifyRefreshToken?: string
    spotifyExpiresAt?: number
    googleAccessToken?: string
    googleRefreshToken?: string
  }
}
