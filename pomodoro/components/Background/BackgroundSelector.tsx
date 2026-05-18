'use client'

import { useRef, useState } from 'react'
import { useBackground } from '@/hooks/useBackground'
import { BACKGROUND_PRESETS, BackgroundCategory } from '@/lib/constants'
import { Modal } from '@/components/UI/Modal'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES = Object.keys(BACKGROUND_PRESETS) as BackgroundCategory[]

export function BackgroundSelector({ isOpen, onClose }: Props) {
  const { background, selectPreset, clearBackground, uploadFile, setDimmer } = useBackground()
  const [activeCategory, setActiveCategory] = useState<BackgroundCategory>('Nature')
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    const result = await uploadFile(file)
    if (!result.ok) setUploadError(result.error ?? 'Upload failed.')
    e.target.value = ''
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Background" position="bottom">
      {/* Category tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={[
              'shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors',
              activeCategory === cat
                ? 'bg-brand text-white'
                : 'bg-surface-3 text-white/60 hover:text-white',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Preset grid */}
      <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {BACKGROUND_PRESETS[activeCategory].map((url) => (
          <button
            key={url}
            onClick={() => selectPreset(url)}
            className={[
              'relative h-20 overflow-hidden rounded-lg bg-cover bg-center transition-all hover:ring-2 hover:ring-brand',
              background.url === url ? 'ring-2 ring-brand' : '',
            ].join(' ')}
            style={{ backgroundImage: `url(${url})` }}
            aria-label="Select background"
          />
        ))}
      </div>

      {/* Upload + clear */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          className="rounded-lg bg-surface-3 px-3 py-2 text-xs text-white/70 transition-colors hover:bg-surface-2 hover:text-white"
        >
          Upload image / GIF
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.gif"
          className="hidden"
          onChange={handleUpload}
        />
        {background.type !== 'none' && (
          <button
            onClick={clearBackground}
            className="rounded-lg bg-surface-3 px-3 py-2 text-xs text-white/50 transition-colors hover:text-red-400"
          >
            Remove background
          </button>
        )}
        {uploadError && <p className="w-full text-xs text-red-400">{uploadError}</p>}
      </div>

      {/* Dimmer slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-white/50">
          <span>Dimmer</span>
          <span>{background.dimmer}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={80}
          value={background.dimmer}
          onChange={(e) => setDimmer(Number(e.target.value))}
          className="w-full accent-brand"
        />
      </div>
    </Modal>
  )
}
