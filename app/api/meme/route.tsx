import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || 'A startup idea'
  const persona = searchParams.get('persona') || 'AI Roaster'
  const emoji = searchParams.get('emoji') || '🔥'
  const excerpt = (searchParams.get('excerpt') || '').slice(0, 120)
  const domain = searchParams.get('domain') || 'roastmepal.com'

  const excerptText = excerpt.length >= 120 ? excerpt + '…' : excerpt
  const titleSafe = title.slice(0, 50).toUpperCase()
  const personaUpper = persona.toUpperCase()

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Top half — white/cream, emoji + title */}
        <div
          style={{
            flex: '0 0 520px',
            background: '#F9FAFB',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 72px 32px',
            gap: '24px',
            position: 'relative',
          }}
        >
          {/* Top label strip */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: '#00FF88',
              display: 'flex',
            }}
          />

          {/* Big emoji */}
          <span style={{ fontSize: '180px', lineHeight: 1 }}>{emoji}</span>

          {/* Idea title */}
          <div
            style={{
              color: '#111827',
              fontSize: titleSafe.length > 30 ? '36px' : '46px',
              fontWeight: 900,
              textAlign: 'center',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {titleSafe}
          </div>
        </div>

        {/* Bottom half — dark, roast quote */}
        <div
          style={{
            flex: 1,
            background: '#0A0A0F',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '36px 72px 40px',
            position: 'relative',
          }}
        >
          {/* Green accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '72px',
              right: '72px',
              height: '2px',
              background: 'rgba(0,255,136,0.4)',
              display: 'flex',
            }}
          />

          {/* Attribution + quote */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span
              style={{
                color: '#00FF88',
                fontSize: '13px',
                letterSpacing: '4px',
                fontWeight: 700,
              }}
            >
              ACCORDING TO {personaUpper}
            </span>

            <div
              style={{
                color: '#F9FAFB',
                fontSize: excerptText.length > 80 ? '26px' : '30px',
                lineHeight: 1.55,
                fontStyle: 'italic',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {`\u201c${excerptText}\u201d`}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#374151', fontSize: '14px' }}>roastmepal.com</span>
            <span style={{ color: '#374151', fontSize: '14px' }}>{domain}</span>
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  )
}
