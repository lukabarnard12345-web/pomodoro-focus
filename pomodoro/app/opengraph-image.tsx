import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#170f10',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(181,105,122,0.12) 0%, transparent 65%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Left — timer ring */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 520, flexShrink: 0 }}>
          <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
            <circle cx="130" cy="130" r="110" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
            <circle
              cx="130" cy="130" r="110"
              stroke="#b5697a"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="691.1"
              strokeDashoffset="173"
              transform="rotate(-90 130 130)"
            />
            <circle cx="130" cy="130" r="22" fill="#b5697a" opacity="0.85" />
            <circle cx="130" cy="130" r="11" fill="#d49aa6" />
            {/* Timer text */}
            <text x="130" y="228" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="18" fontFamily="system-ui" letterSpacing="4">25:00</text>
          </svg>
        </div>

        {/* Right — text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            paddingRight: 80,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.22em',
              color: 'rgba(181,105,122,0.8)',
              textTransform: 'uppercase',
            }}
          >
            Pomodoro Focus
          </div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Deep work,{'\n'}beautifully simple.
          </div>
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.01em',
              marginTop: 8,
            }}
          >
            Spotify · Google Calendar · Focus timer
          </div>

          {/* Pill badges */}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            {['Focus Timer', 'Spotify', 'Google Calendar'].map((label) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 999,
                  padding: '6px 16px',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
