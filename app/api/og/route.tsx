import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || 'A startup idea'
  const persona = searchParams.get('persona') || 'AI Roaster'
  const emoji = searchParams.get('emoji') || '🔥'
  const excerpt = (searchParams.get('excerpt') || '').slice(0, 160)

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0A0A0F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,255,136,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.04) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Card */}
        <div
          style={{
            background: '#13131A',
            border: '1px solid #1F1F2E',
            borderRadius: '20px',
            padding: '48px 56px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '40px' }}>{emoji}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#00FF88', fontSize: '18px', fontWeight: 700 }}>{persona}</span>
              <span style={{ color: '#6B7280', fontSize: '14px' }}>
                roasting &ldquo;{title}&rdquo;
              </span>
            </div>
          </div>

          {/* Excerpt */}
          {excerpt && (
            <p
              style={{
                color: '#E5E7EB',
                fontSize: '20px',
                lineHeight: 1.6,
                margin: 0,
                borderTop: '1px solid #1F1F2E',
                paddingTop: '20px',
              }}
            >
              {excerpt}
              {excerpt.length >= 160 ? '…' : ''}
            </p>
          )}
        </div>

        {/* Footer branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🔥</span>
          <span style={{ color: '#6B7280', fontSize: '16px' }}>roastmepal.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
