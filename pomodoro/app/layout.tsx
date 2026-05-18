import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

const SITE_URL = 'https://pomodoro-focus-lyart.vercel.app'

export const metadata: Metadata = {
  title: 'Pomodoro Focus',
  description: 'Deep work timer with Spotify and Google Calendar integration.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'Pomodoro Focus',
    description: 'Deep work timer with Spotify and Google Calendar integration.',
    url: SITE_URL,
    siteName: 'Pomodoro Focus',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pomodoro Focus',
    description: 'Deep work timer with Spotify and Google Calendar integration.',
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
