'use client'

import { useSettingsStore } from '@/store/settingsStore'
import { Modal } from '@/components/UI/Modal'

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        'relative h-6 w-11 rounded-full transition-colors',
        checked ? 'bg-brand' : 'bg-surface-3',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  )
}

interface NumberInputProps {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  label: string
}

function NumberInput({ value, min, max, onChange, label }: NumberInputProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label={`Decrease ${label}`}
        className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-3 text-white/70 transition-colors hover:bg-surface-2 hover:text-white"
      >
        −
      </button>
      <span className="w-8 text-center font-mono text-sm text-white">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label={`Increase ${label}`}
        className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-3 text-white/70 transition-colors hover:bg-surface-2 hover:text-white"
      >
        +
      </button>
    </div>
  )
}

export function SettingsModal({ isOpen, onClose }: Props) {
  const {
    shortBreakDuration,
    longBreakDuration,
    audioEnabled,
    notificationsEnabled,
    setShortBreakDuration,
    setLongBreakDuration,
    setAudioEnabled,
    setNotificationsEnabled,
  } = useSettingsStore()

  const handleNotifications = async (enabled: boolean) => {
    if (enabled && typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') return
    }
    setNotificationsEnabled(enabled)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-5">
        <Row label="Short break" hint="minutes">
          <NumberInput
            value={shortBreakDuration}
            min={1}
            max={30}
            onChange={setShortBreakDuration}
            label="short break"
          />
        </Row>

        <Row label="Long break" hint="minutes">
          <NumberInput
            value={longBreakDuration}
            min={1}
            max={60}
            onChange={setLongBreakDuration}
            label="long break"
          />
        </Row>

        <div className="my-4 h-px bg-white/[0.06]" />

        <Row label="Sound cues">
          <Toggle checked={audioEnabled} onChange={setAudioEnabled} label="Toggle sound" />
        </Row>

        <Row label="Notifications">
          <Toggle
            checked={notificationsEnabled}
            onChange={handleNotifications}
            label="Toggle notifications"
          />
        </Row>
      </div>
    </Modal>
  )
}

function Row({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-white/80">{label}</p>
        {hint && <p className="text-xs text-white/40">{hint}</p>}
      </div>
      {children}
    </div>
  )
}
