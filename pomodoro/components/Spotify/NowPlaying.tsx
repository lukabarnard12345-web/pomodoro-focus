'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { SpotifyTrack } from '@/store/spotifyStore'
import { MusicIcon } from '@/components/UI/Icons'

interface Props {
  track: SpotifyTrack
  isPlaying: boolean
}

export function NowPlaying({ track, isPlaying }: Props) {
  const image = track.album.images[0]?.url
  const artistNames = track.artists.map((a) => a.name).join(', ')

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={track.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="relative w-full overflow-hidden rounded-xl"
      >
        {/* Blurred album art backdrop */}
        {image && (
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl brightness-50"
            style={{ backgroundImage: `url(${image})` }}
            aria-hidden="true"
          />
        )}

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />

        {/* Content */}
        <div className="relative flex flex-col items-center gap-4 px-4 pb-5 pt-6">
          {/* Album art */}
          <motion.div
            animate={{ scale: isPlaying ? 1 : 0.92 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative h-48 w-48 overflow-hidden rounded-xl shadow-2xl shadow-black/60"
          >
            {image ? (
              <Image
                src={image}
                alt={track.album.name}
                fill
                className="object-cover"
                sizes="192px"
              />
            ) : (
              <div className="h-full w-full bg-surface-3 flex items-center justify-center">
                <MusicIcon size={40} />
              </div>
            )}

            {isPlaying && (
              <div className="absolute inset-0 animate-pulse rounded-xl ring-2 ring-white/10" />
            )}
          </motion.div>

          {/* Track info */}
          <div className="w-full text-center">
            <p className="truncate text-base font-semibold text-white leading-tight">
              {track.name}
            </p>
            <p className="truncate text-sm text-white/60 mt-0.5">{artistNames}</p>
            <p className="truncate text-xs text-white/30 mt-0.5">{track.album.name}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
