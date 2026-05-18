'use client'

import Script from 'next/script'
import { signIn } from 'next-auth/react'
import { useSpotify } from '@/hooks/useSpotify'
import { NowPlaying } from './NowPlaying'
import { SpotifyControls } from './SpotifyControls'

export function SpotifyPlayer() {
  const {
    isLoggedIn,
    isPremium,
    isPlaying,
    currentTrack,
    position,
    duration,
    volume,
    playerReady,
    error,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    resume,
  } = useSpotify()

  return (
    <>
      {isLoggedIn && (
        <Script src="https://sdk.scdn.co/spotify-player.js" strategy="afterInteractive" />
      )}

      <div className="flex flex-col gap-4">
        {/* Not logged in */}
        {!isLoggedIn && (
          <div className="flex flex-col items-center gap-4 py-8">
            <SpotifyLogo size={48} />
            <div className="text-center">
              <p className="text-sm font-medium text-white/80">Connect Spotify</p>
              <p className="mt-1 text-xs text-white/40">Stream music while you focus</p>
            </div>
            <button
              onClick={() => signIn('spotify')}
              className="flex items-center gap-2 rounded-full bg-[#1DB954] px-5 py-2.5 text-sm font-semibold text-black transition-all hover:scale-105 hover:bg-[#1ed760]"
            >
              <SpotifyLogo size={16} />
              Connect Spotify
            </button>
          </div>
        )}

        {/* Not Premium */}
        {isLoggedIn && !isPremium && (
          <div className="rounded-xl bg-surface-2 p-4 text-center">
            <p className="text-sm font-medium text-white/70">Spotify Premium required</p>
            <p className="mt-1 text-xs text-white/40">In-browser playback needs a Premium account</p>
            <a
              href="https://www.spotify.com/premium"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs text-[#1DB954] hover:underline"
            >
              Upgrade to Premium →
            </a>
          </div>
        )}

        {/* Error */}
        {isLoggedIn && isPremium && error && (
          <div className="rounded-xl bg-red-500/10 p-3 text-center">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* Connecting */}
        {isLoggedIn && isPremium && !playerReady && !error && (
          <div className="flex flex-col items-center gap-3 py-8">
            <SpotifyLogo size={32} />
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1DB954]" />
              Connecting…
            </div>
          </div>
        )}

        {/* Player ready */}
        {isLoggedIn && isPremium && playerReady && (
          <>
            {currentTrack ? (
              <>
                <NowPlaying track={currentTrack} isPlaying={isPlaying} />
                <SpotifyControls
                  isPlaying={isPlaying}
                  volume={volume}
                  position={position}
                  duration={duration}
                  onTogglePlay={togglePlay}
                  onNext={nextTrack}
                  onPrevious={previousTrack}
                  onVolumeChange={setVolume}
                  onSeek={seek}
                />
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <SpotifyLogo size={32} />
                <div>
                  <p className="text-sm font-medium text-white/60">Pomodoro Focus is ready</p>
                  <p className="mt-1 text-xs text-white/30">Resume your last Spotify session</p>
                </div>
                <button
                  onClick={resume}
                  className="flex items-center gap-2 rounded-full bg-[#1DB954] px-5 py-2.5 text-sm font-semibold text-black transition-all hover:scale-105 hover:bg-[#1ed760]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  Resume
                </button>
                <p className="text-xs text-white/20 px-4">
                  Or start playing in Spotify, then switch the device to <span className="text-white/40">Pomodoro Focus</span>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

function SpotifyLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DB954">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}
