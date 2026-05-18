'use client'

import { useCallback } from 'react'
import { useSettingsStore, BackgroundConfig } from '@/store/settingsStore'

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5 MB

export function useBackground() {
  const { background, setBackground } = useSettingsStore()

  const selectPreset = useCallback(
    (url: string) => {
      setBackground({ type: 'preset', url })
    },
    [setBackground],
  )

  const clearBackground = useCallback(() => {
    setBackground({ type: 'none', url: '' })
  }, [setBackground])

  const uploadFile = useCallback(
    (file: File): Promise<{ ok: boolean; error?: string }> => {
      return new Promise((resolve) => {
        if (file.size > MAX_UPLOAD_BYTES) {
          resolve({ ok: false, error: 'File exceeds 5 MB limit.' })
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          setBackground({ type: 'upload', url })
          resolve({ ok: true })
        }
        reader.onerror = () => resolve({ ok: false, error: 'Failed to read file.' })
        reader.readAsDataURL(file)
      })
    },
    [setBackground],
  )

  const setDimmer = useCallback(
    (dimmer: number) => {
      setBackground({ dimmer: Math.min(80, Math.max(0, dimmer)) })
    },
    [setBackground],
  )

  return { background, selectPreset, clearBackground, uploadFile, setDimmer }
}
