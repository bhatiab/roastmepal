import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const style = searchParams.get('style') || 'failure'
  const theme = searchParams.get('theme') || 'dark'
  const title = searchParams.get('title') || 'A startup idea'
  const persona = searchParams.get('persona') || 'AI Roaster'
  const emoji = searchParams.get('emoji') || '🔥'
  const excerpt = (searchParams.get('excerpt') || '').slice(0, 140)
  const id = searchParams.get('id') || ''
  const domain = searchParams.get('domain') || 'roastmepal.com'
  const titleSafe = title.slice(0, 80)

  const excerptText = excerpt.length >= 140 ? excerpt + '…' : excerpt
  const footerUrl = `${domain}${id ? `/roast/${id}` : ''}`
  const isLight = theme === 'light'

  // ── Theme tokens ──────────────────────────────────────────
  const bg         = isLight ? '#FDFAF3' : '#0C0A05'
  const goldBright = isLight ? '#8B6914' : '#D4AF37'
  const goldFaint  = isLight ? 'rgba(139,105,20,0.3)' : 'rgba(212,175,55,0.3)'
  const goldMid    = isLight ? 'rgba(139,105,20,0.7)' : 'rgba(212,175,55,0.65)'
  const titleColor = isLight ? '#1C1200'  : '#F5F0E0'
  const bodyColor  = isLight ? 'rgba(50,35,0,0.7)'  : 'rgba(245,240,220,0.6)'
  const footerColor = isLight ? 'rgba(100,75,10,0.6)' : 'rgba(212,175,55,0.55)'

  if (style === 'rejection') {
    const rBg        = isLight ? '#FDFAF3' : '#0C0A05'
    const rBorder    = isLight ? '#8B6914' : '#D4AF37'
    const rBorderFaint = isLight ? 'rgba(139,105,20,0.25)' : 'rgba(212,175,55,0.25)'
    const rHead      = isLight ? '#1C1200' : '#00FF88'
    const rHeadSub   = isLight ? 'rgba(50,35,0,0.5)' : '#6B7280'
    const rBody      = isLight ? '#2D1A00' : '#E5E7EB'
    const rGreeting  = isLight ? 'rgba(50,35,0,0.55)' : '#6B7280'
    const rSig       = isLight ? '#1C1200' : '#FFFFFF'
    const rUrl       = isLight ? 'rgba(100,75,10,0.45)' : '#374151'
    const stampColor = '#EF4444'

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: rBg,
            display: 'flex',
            flexDirection: 'column',
            padding: '56px 64px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Outer border */}
          <div style={{ position: 'absolute', inset: '14px', border: `5px solid ${rBorder}`, display: 'flex' }} />
          {/* Inner border */}
          <div style={{ position: 'absolute', inset: '24px', border: `1px solid ${rBorderFaint}`, display: 'flex' }} />

          {/* Letterhead row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: rHead, fontSize: '22px', fontWeight: 700, letterSpacing: '2px' }}>
                TEMPORAL VENTURES LLC
              </span>
              <span style={{ color: rHeadSub, fontSize: '14px', marginTop: '4px' }}>
                San Francisco · Year 2030
              </span>
            </div>
            <div
              style={{
                border: `3px solid ${stampColor}`,
                color: stampColor,
                fontSize: '26px',
                fontWeight: 800,
                padding: '6px 18px',
                letterSpacing: '4px',
                transform: 'rotate(-12deg)',
                display: 'flex',
                alignItems: 'center',
                marginTop: '8px',
              }}
            >
              REJECTED
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: rBorderFaint, margin: '28px 0', zIndex: 1, display: 'flex' }} />

          {/* Letter body */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, zIndex: 1 }}>
            <span style={{ color: rGreeting, fontSize: '17px', marginBottom: '16px' }}>
              Dear Founder,
            </span>
            <div style={{ color: rBody, fontSize: '18px', lineHeight: 1.6, flex: 1, display: 'flex', alignItems: 'flex-start', overflow: 'hidden', maxWidth: '100%' }}>
              {excerptText}
            </div>
          </div>

          {/* Signature */}
          <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1, marginTop: '28px' }}>
            <div style={{ height: '1px', background: rBorderFaint, marginBottom: '20px', display: 'flex' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: rGreeting, fontSize: '13px' }}>Yours in pessimism,</span>
                <span style={{ color: rSig, fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>
                  {`${emoji} ${persona}`}
                </span>
              </div>
              <span style={{ color: rUrl, fontSize: '13px' }}>{footerUrl}</span>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  // ── Certificate of Startup Failure ────────────────────────
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Outer thick gold border */}
        <div style={{ position: 'absolute', inset: '14px', border: `6px solid ${goldBright}`, display: 'flex' }} />
        {/* Inner thin border */}
        <div style={{ position: 'absolute', inset: '26px', border: `1px solid ${goldFaint}`, display: 'flex' }} />

        {/* Corner diamonds */}
        <span style={{ position: 'absolute', top: '6px',  left: '6px',  color: goldBright, fontSize: '24px', lineHeight: 1 }}>◆</span>
        <span style={{ position: 'absolute', top: '6px',  right: '6px', color: goldBright, fontSize: '24px', lineHeight: 1 }}>◆</span>
        <span style={{ position: 'absolute', bottom: '6px', left: '6px',  color: goldBright, fontSize: '24px', lineHeight: 1 }}>◆</span>
        <span style={{ position: 'absolute', bottom: '6px', right: '6px', color: goldBright, fontSize: '24px', lineHeight: 1 }}>◆</span>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '48px 100px',
            zIndex: 1,
            width: '100%',
          }}
        >
          {/* Top ornament */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', width: '100%', justifyContent: 'center' }}>
            <div style={{ width: '140px', height: '2px', background: goldFaint, display: 'flex' }} />
            <span style={{ color: goldMid, fontSize: '18px' }}>◆</span>
            <div style={{ width: '140px', height: '2px', background: goldFaint, display: 'flex' }} />
          </div>

          {/* Title */}
          <div style={{ color: goldBright, fontSize: '15px', letterSpacing: '8px', textTransform: 'uppercase', marginBottom: '8px', display: 'flex' }}>
            Certificate of Startup Failure
          </div>

          {/* Issued by */}
          <div style={{ color: goldMid, fontSize: '12px', letterSpacing: '3px', marginBottom: '20px', display: 'flex' }}>
            ISSUED BY ROASTMEPAL · EST. MMXXIV
          </div>

          {/* Middle ornament */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', width: '100%', justifyContent: 'center' }}>
            <div style={{ width: '220px', height: '1px', background: goldFaint, display: 'flex' }} />
            <span style={{ color: goldFaint, fontSize: '13px' }}>◆  ◆  ◆</span>
            <div style={{ width: '220px', height: '1px', background: goldFaint, display: 'flex' }} />
          </div>

          {/* Certifies text */}
          <div style={{ color: bodyColor, fontSize: '13px', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex' }}>
            This certifies that the following startup idea has been officially and mercilessly destroyed:
          </div>

          {/* Idea title */}
          <div style={{ color: titleColor, fontSize: titleSafe.length > 50 ? '22px' : '30px', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2, display: 'flex', maxWidth: '100%', wordBreak: 'break-word', overflow: 'hidden' }}>
            {`\u201c${titleSafe}\u201d`}
          </div>

          {/* Excerpt */}
          {excerptText && (
            <div style={{ color: bodyColor, fontSize: '15px', lineHeight: 1.5, marginBottom: '20px', fontStyle: 'italic', display: 'flex', maxWidth: '100%', overflow: 'hidden' }}>
              {excerptText}
            </div>
          )}

          {/* Bottom ornament */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', width: '100%', justifyContent: 'center' }}>
            <div style={{ width: '140px', height: '1px', background: goldFaint, display: 'flex' }} />
            <span style={{ color: goldMid, fontSize: '14px' }}>◆</span>
            <div style={{ width: '140px', height: '1px', background: goldFaint, display: 'flex' }} />
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: goldMid, fontSize: '13px', letterSpacing: '1px' }}>
              {`${emoji} ${persona} — Certified Roaster`}
            </span>
            <span style={{ color: goldFaint, fontSize: '13px' }}>|</span>
            <span style={{ color: footerColor, fontSize: '13px' }}>{domain}</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
