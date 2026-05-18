import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#170f10',
          borderRadius: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(181,105,122,0.18) 0%, transparent 70%)',
          }}
        />
        <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
          <circle cx="55" cy="55" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
          <circle
            cx="55" cy="55" r="42"
            stroke="#b5697a"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="263.9"
            strokeDashoffset="66"
            transform="rotate(-90 55 55)"
          />
          <circle cx="55" cy="55" r="10" fill="#b5697a" opacity="0.9" />
          <circle cx="55" cy="55" r="5" fill="#d49aa6" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
