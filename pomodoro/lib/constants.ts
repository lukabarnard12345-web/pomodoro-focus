export const STUDY_DURATIONS = [15, 30, 60] as const

export const DEFAULT_SHORT_BREAK = 5
export const DEFAULT_LONG_BREAK = 10

export type BackgroundCategory = 'Nature' | 'City' | 'Abstract' | 'Space' | 'Cozy'

export const BACKGROUND_PRESETS: Record<BackgroundCategory, string[]> = {
  Nature: [
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80',
  ],
  City: [
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80',
  ],
  Abstract: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
    'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80',
  ],
  Space: [
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
  ],
  Cozy: [
    'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1920&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
  ],
}
