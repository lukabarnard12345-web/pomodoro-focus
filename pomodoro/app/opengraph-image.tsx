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
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(181,105,122,0.14) 0%, transparent 65%)',
            top: 15,
            left: 300,
            display: 'flex',
          }}
        />

        {/* Left — ring */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 460,
            flexShrink: 0,
          }}
        >
          <svg width="240" height="240" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r="100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
            <circle
              cx="120" cy="120" r="100"
              fill="none"
              stroke="#b5697a"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="628"
              strokeDashoffset="157"
              transform="rotate(-90 120 120)"
            />
            <circle cx="120" cy="120" r="18" fill="#b5697a" opacity="0.85" />
            <circle cx="120" cy="120" r="9" fill="#d49aa6" />
          </svg>
        </div>

        {/* Right — text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            paddingRight: 80,
            flex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.22em',
              color: 'rgba(181,105,122,0.85)',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Pomodoro Focus
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 58,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: 20,
            }}
          >
            Deep work, beautifully simple.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 28,
            }}
          >
            Spotify · Google Calendar · Focus timer
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Focus Timer', 'Spotify', 'Google Calendar'].map((label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 999,
                  padding: '6px 18px',
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
