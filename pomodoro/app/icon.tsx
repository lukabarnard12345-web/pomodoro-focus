import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#170f10',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          {/* Track */}
          <circle cx="11" cy="11" r="8.5" stroke="rgba(255,255,255,0.1)" strokeWidth="2.2" />
          {/* Progress arc ~75% */}
          <circle
            cx="11" cy="11" r="8.5"
            stroke="#b5697a"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="53.4"
            strokeDashoffset="13.4"
            transform="rotate(-90 11 11)"
          />
          {/* Center dot */}
          <circle cx="11" cy="11" r="2" fill="#b5697a" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
