// Web Audio API chime — no external files required.
// AudioContext must be created after a user gesture; we cache it here.
let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx || ctx.state === 'closed') {
      ctx = new AudioContext()
    }
    return ctx
  } catch {
    return null
  }
}

function scheduleChime(
  context: AudioContext,
  freqStart: number,
  freqEnd: number,
  gain: number,
  startAt: number,
  duration: number,
): void {
  const osc = context.createOscillator()
  const gainNode = context.createGain()

  osc.connect(gainNode)
  gainNode.connect(context.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(freqStart, startAt)
  osc.frequency.exponentialRampToValueAtTime(freqEnd, startAt + duration * 0.6)

  gainNode.gain.setValueAtTime(gain, startAt)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startAt + duration)

  osc.start(startAt)
  osc.stop(startAt + duration)
}

export function playChime(type: 'start' | 'end'): void {
  const context = getContext()
  if (!context) return

  // Resume suspended context (browser autoplay policy)
  if (context.state === 'suspended') {
    context.resume().catch(() => null)
  }

  const now = context.currentTime

  if (type === 'start') {
    // Two ascending tones: signal work begins
    scheduleChime(context, 660, 880, 0.25, now, 0.8)
    scheduleChime(context, 880, 1100, 0.18, now + 0.15, 0.7)
  } else {
    // Three descending tones: signal session over
    scheduleChime(context, 880, 660, 0.28, now, 0.9)
    scheduleChime(context, 660, 550, 0.22, now + 0.2, 0.9)
    scheduleChime(context, 550, 440, 0.16, now + 0.45, 1.1)
  }
}
