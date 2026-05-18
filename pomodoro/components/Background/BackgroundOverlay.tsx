'use client'

import { useSettingsStore } from '@/store/settingsStore'

export function BackgroundOverlay() {
  const { background } = useSettingsStore()

  if (background.type === 'none' || !background.url) return null

  return (
    <>
      {/* Background image layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${background.url})` }}
        aria-hidden="true"
      />
      {/* Dimmer overlay */}
      <div
        className="fixed inset-0 z-[1]"
        style={{ backgroundColor: `rgba(0,0,0,${background.dimmer / 100})` }}
        aria-hidden="true"
      />
    </>
  )
}
