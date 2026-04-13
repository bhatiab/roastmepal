import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || 'A startup idea'
  const persona = searchParams.get('persona') || 'AI Roaster'
  const emoji = searchParams.get('emoji') || '🔥'
  const excerpt = (searchParams.get('excerpt') || '').slice(0, 140)
  const domain = searchParams.get('domain') || 'roastmepal.com'

  const excerptText = excerpt.length >= 140 ? excerpt + '…' : excerpt
  const titleSafe = title.slice(0, 60).toUpperCase()

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          background: '#0A0A0F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,255,136,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.03) 1px,transparent 1px)',
            backgroundSize: '54px 54px',
            display: 'flex',
          }}
        />

        {/* Green accent bar top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#00FF88',
            display: 'flex',
          }}
        />

        {/* Top: startup idea */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 1,
            gap: '16px',
            paddingTop: '20px',
          }}
        >
          <span style={{ fontSize: '14px', color: '#6B7280', letterSpacing: '4px', fontWeight: 600 }}>
            STARTUP IDEA
          </span>
          <div
            style={{
              color: '#FFFFFF',
              fontSize: titleSafe.length > 30 ? '44px' : '56px',
              fontWeight: 900,
              lineHeight: 1.1,
              textAlign: 'center',
              maxWidth: '100%',
              wordBreak: 'break-word',
              overflow: 'hidden',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {titleSafe}
          </div>
        </div>

        {/* Middle: roast excerpt */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 1,
            maxWidth: '860px',
            gap: '24px',
          }}
        >
          <div style={{ width: '60px', height: '4px', background: '#00FF88', display: 'flex' }} />
          <div
            style={{
              color: '#E5E7EB',
              fontSize: '28px',
              lineHeight: 1.55,
              fontStyle: 'italic',
              textAlign: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {`\u201c${excerptText}\u201d`}
          </div>
          <div style={{ width: '60px', height: '4px', background: '#00FF88', display: 'flex' }} />
        </div>

        {/* Bottom: persona + domain */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: '100%',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '36px' }}>{emoji}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ color: '#00FF88', fontSize: '16px', fontWeight: 700 }}>
                {persona}
              </span>
              <span style={{ color: '#6B7280', fontSize: '13px' }}>Certified Roaster</span>
            </div>
          </div>
          <span style={{ color: '#374151', fontSize: '14px' }}>{domain}</span>
        </div>

        {/* Green accent bar bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#00FF88',
            display: 'flex',
          }}
        />
      </div>
    ),
    { width: 1080, height: 1080 }
  )
}
