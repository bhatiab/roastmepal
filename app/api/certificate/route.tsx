import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}&display=swap`
    const css = await fetch(cssUrl, {
      headers: {
        // Old IE user-agent: returns TTF/OTF format that Satori supports
        'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)',
      },
    }).then(r => r.text())
    const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype|woff)'\)/)
    if (!match?.[1]) return null
    return fetch(match[1]).then(r => r.arrayBuffer())
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const style = searchParams.get('style') || 'failure'
  const theme = searchParams.get('theme') || 'dark'
  const title = searchParams.get('title') || 'A startup idea'
  const persona = searchParams.get('persona') || 'AI Roaster'
  const emoji = searchParams.get('emoji') || '🔥'
  const excerpt = (searchParams.get('excerpt') || '').slice(0, 300)
  const id = searchParams.get('id') || ''
  const domain = searchParams.get('domain') || 'roastmepal.com'
  const founder = (searchParams.get('founder') || 'The Anonymous Founder').slice(0, 50)
  const titleSafe = title.slice(0, 80)
  const founderSafe = founder.slice(0, 40)

  const excerptText = excerpt.length >= 300 ? excerpt + '…' : excerpt
  const footerUrl = `${domain}${id ? `/roast/${id}` : ''}`
  const isLight = theme === 'light'

  // ── delusion: parchment certificate of distinguished delusion ────────────
  if (style === 'delusion') {
    const [playfairData, garamondData, dancingData] = await Promise.all([
      loadGoogleFont('Playfair Display', 700),
      loadGoogleFont('EB Garamond', 400),
      loadGoogleFont('Dancing Script', 700),
    ])

    const fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style?: 'normal' | 'italic' }[] = []
    if (playfairData) fonts.push({ name: 'Playfair', data: playfairData, weight: 700 })
    if (garamondData) fonts.push({ name: 'Garamond', data: garamondData, weight: 400 })
    if (dancingData) fonts.push({ name: 'Dancing', data: dancingData, weight: 700 })

    const pText = '#2C1A0E'
    const pBrown = '#5C3317'
    const pGold = '#8B6914'
    const pGoldBright = '#D4AF37'
    const pMuted = 'rgba(44,26,14,0.6)'
    const pTitle = fonts.some(f => f.name === 'Playfair') ? 'Playfair, serif' : 'serif'
    const pBody = fonts.some(f => f.name === 'Garamond') ? 'Garamond, serif' : 'serif'
    const pSig = fonts.some(f => f.name === 'Dancing') ? 'Dancing, cursive' : 'cursive'

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: 'radial-gradient(ellipse at center, #F5E8C7 0%, #EDD8A8 55%, #C8A870 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontFamily: pBody,
          }}
        >
          {/* Outer border */}
          <div style={{ position: 'absolute', inset: '10px', border: `8px solid ${pBrown}`, display: 'flex' }} />
          {/* Inner border */}
          <div style={{ position: 'absolute', inset: '24px', border: `1.5px solid ${pGold}`, display: 'flex' }} />
          {/* Corner ornaments */}
          <span style={{ position: 'absolute', top: '5px', left: '5px', color: pGold, fontSize: '20px', lineHeight: 1 }}>◆</span>
          <span style={{ position: 'absolute', top: '5px', right: '5px', color: pGold, fontSize: '20px', lineHeight: 1 }}>◆</span>
          <span style={{ position: 'absolute', bottom: '5px', left: '5px', color: pGold, fontSize: '20px', lineHeight: 1 }}>◆</span>
          <span style={{ position: 'absolute', bottom: '5px', right: '5px', color: pGold, fontSize: '20px', lineHeight: 1 }}>◆</span>

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '38px 80px 26px',
              zIndex: 1,
              width: '100%',
              gap: '4px',
            }}
          >
            {/* Institution */}
            <div style={{ color: pBrown, fontSize: '14px', letterSpacing: '2px', fontStyle: 'italic', display: 'flex' }}>
              The Royal Academy of Startup Failures
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center', margin: '4px 0' }}>
              <div style={{ flex: 1, height: '1px', background: pGold, display: 'flex' }} />
              <span style={{ color: pGold, fontSize: '16px' }}>◆</span>
              <div style={{ flex: 1, height: '1px', background: pGold, display: 'flex' }} />
            </div>

            {/* Main title */}
            <div
              style={{
                color: pText,
                fontSize: '50px',
                fontWeight: 700,
                fontFamily: pTitle,
                lineHeight: 1.05,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0px',
              }}
            >
              <span style={{ display: 'flex' }}>Certificate of</span>
              <span style={{ display: 'flex' }}>Distinguished Delusion</span>
            </div>

            {/* Awarded to label */}
            <div style={{ color: pMuted, fontSize: '12px', marginTop: '6px', fontStyle: 'italic', display: 'flex' }}>
              Awarded to:
            </div>

            {/* Recipient */}
            <div style={{ color: pText, fontSize: '19px', fontWeight: 700, letterSpacing: '2px', fontFamily: pTitle, display: 'flex' }}>
              {founderSafe}
            </div>

            {/* For the ability */}
            <div
              style={{
                color: pMuted,
                fontSize: '12px',
                fontStyle: 'italic',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: '720px',
                lineHeight: 1.4,
              }}
            >
              For the exceptional ability to ignore all user feedback, market data, and common sense in the pursuit of:
            </div>

            {/* Startup idea */}
            <div
              style={{
                color: pText,
                fontSize: '18px',
                fontWeight: 700,
                fontFamily: pTitle,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {`[STARTUP IDEA: ${titleSafe.toUpperCase()}]`}
            </div>

            {/* Citation heading */}
            <div style={{ color: pBrown, fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', marginTop: '4px', display: 'flex' }}>
              Citation for Achievement
            </div>

            {/* Citation body */}
            {excerptText && (
              <div
                style={{
                  color: pText,
                  fontSize: '11.5px',
                  lineHeight: 1.55,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  maxWidth: '840px',
                  fontStyle: 'italic',
                }}
              >
                {excerptText.slice(0, 200)}
              </div>
            )}

            {/* Footer row: signatures + wax seal */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '12px' }}>
              {/* Left signature */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                <span style={{ fontFamily: pSig, fontSize: '24px', color: pText, display: 'flex' }}>Dr. R. Pal</span>
                <div style={{ width: '140px', height: '1px', background: pBrown, display: 'flex' }} />
                <span style={{ fontSize: '10px', color: pMuted, display: 'flex' }}>Dr. R. Pal, Dean of Incineration</span>
              </div>

              {/* Wax seal */}
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: '#8B0000',
                  border: `4px solid ${pGoldBright}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1px',
                }}
              >
                <span style={{ fontSize: '24px', lineHeight: 1 }}>🔥</span>
                <span style={{ fontSize: '6px', color: '#F5E8C7', letterSpacing: '0.5px', display: 'flex' }}>ROASTMEPAL.COM</span>
              </div>

              {/* Right signature */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <span style={{ fontFamily: pSig, fontSize: '24px', color: pText, display: 'flex' }}>{`${emoji} ${persona}`}</span>
                <div style={{ width: '140px', height: '1px', background: pBrown, display: 'flex' }} />
                <span style={{ fontSize: '10px', color: pMuted, display: 'flex' }}>{`${persona}, Chief Morale Destroyer.`}</span>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts }
    )
  }

  // ── death: startup death certificate ────────────────────────────────────
  if (style === 'death') {
    const dCream = '#F5F0E0'
    const dMuted = 'rgba(245,240,224,0.55)'
    const dRed = '#EF4444'
    const dGold = 'rgba(212,175,55,0.35)'
    const causeOfDeath = excerptText.slice(0, 140) || 'Catastrophic delusion of market relevance'

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: '#0C0A05',
            display: 'flex',
            flexDirection: 'column',
            padding: '44px 64px',
            fontFamily: 'monospace',
            position: 'relative',
          }}
        >
          {/* Outer border */}
          <div style={{ position: 'absolute', inset: '12px', border: `3px solid ${dGold}`, display: 'flex' }} />
          {/* Inner border */}
          <div style={{ position: 'absolute', inset: '20px', border: `1px solid rgba(212,175,55,0.12)`, display: 'flex' }} />

          {/* DECEASED stamp */}
          <div
            style={{
              position: 'absolute',
              top: '52px',
              right: '76px',
              border: `3px solid ${dRed}`,
              color: dRed,
              fontSize: '26px',
              fontWeight: 800,
              padding: '6px 16px',
              letterSpacing: '6px',
              transform: 'rotate(-12deg)',
              display: 'flex',
            }}
          >
            DECEASED
          </div>

          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 1 }}>
            <div style={{ color: dMuted, fontSize: '12px', letterSpacing: '4px', display: 'flex' }}>
              OFFICE OF VENTURE MORTALITY — EST. MMXXIV
            </div>
            <div style={{ color: dCream, fontSize: '28px', fontWeight: 700, letterSpacing: '3px', display: 'flex' }}>
              CERTIFICATE OF STARTUP DEATH
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: dGold, margin: '18px 0', zIndex: 1, display: 'flex' }} />

          {/* Form fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, zIndex: 1 }}>
            {[
              { label: 'FOUNDER NAME', value: founderSafe },
              { label: 'DECEASED', value: titleSafe },
              { label: 'TIME OF IMPLOSION', value: '3 seconds after reading this roast' },
              { label: 'PRIMARY CAUSE OF DEATH', value: causeOfDeath },
              { label: 'PRONOUNCED DEAD BY', value: `${emoji} ${persona}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ color: dMuted, fontSize: '11px', letterSpacing: '2px', width: '220px', paddingTop: '2px', display: 'flex', flexShrink: 0 }}>
                  {label}:
                </div>
                <div style={{ color: dCream, fontSize: '14px', lineHeight: 1.45, display: 'flex', flexWrap: 'wrap', flex: 1 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Fine print */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1 }}>
            <div style={{ height: '1px', background: dGold, display: 'flex' }} />
            <div style={{ color: dMuted, fontSize: '11px', fontStyle: 'italic', display: 'flex', flexWrap: 'wrap' }}>
              {`This idea is survived by its embarrassed founder and $0.00 in committed capital.  ·  ${footerUrl}`}
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  // ── pivot: official pivot command ────────────────────────────────────────
  if (style === 'pivot') {
    const pvRed = '#EF4444'
    const pvWhite = '#F9FAFB'
    const pvMuted = '#6B7280'
    const refId = id.slice(0, 8).toUpperCase() || 'XXXXXXXX'

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: '#0A0A0F',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'monospace',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Red border frame */}
          <div style={{ position: 'absolute', inset: '12px', border: `2px solid rgba(239,68,68,0.4)`, display: 'flex' }} />

          {/* Red alert bar */}
          <div
            style={{
              background: pvRed,
              padding: '18px 56px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '22px' }}>⚠</span>
            <span style={{ color: pvWhite, fontSize: '20px', fontWeight: 800, letterSpacing: '4px', display: 'flex' }}>
              PIVOT ORDER ISSUED — ROASTMEPAL COMMAND
            </span>
          </div>

          {/* Body */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '30px 56px 36px', gap: '18px', zIndex: 1 }}>
            {/* Order reference */}
            <div style={{ color: pvMuted, fontSize: '12px', letterSpacing: '3px', display: 'flex' }}>
              {`ORDER REF: RMP-${refId}  ·  CLASSIFICATION: URGENT  ·  NON-NEGOTIABLE`}
            </div>

            {/* Order text */}
            <div style={{ color: pvWhite, fontSize: '18px', lineHeight: 1.6, display: 'flex', flexWrap: 'wrap' }}>
              {`By order of RoastMePal.com, the idea "${titleSafe}" has been deemed UNSALVAGEABLE. The founder is hereby commanded to PIVOT immediately.`}
            </div>

            {/* Supporting evidence */}
            {excerptText && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ color: pvRed, fontSize: '11px', letterSpacing: '3px', fontWeight: 700, display: 'flex' }}>
                  SUPPORTING EVIDENCE:
                </div>
                <div style={{ color: pvMuted, fontSize: '13px', lineHeight: 1.6, fontStyle: 'italic', display: 'flex', flexWrap: 'wrap' }}>
                  {`"${excerptText.slice(0, 180)}"`}
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ color: pvMuted, fontSize: '11px', letterSpacing: '2px', display: 'flex' }}>AUTHORIZED BY:</div>
                <div style={{ color: pvWhite, fontSize: '16px', display: 'flex' }}>{`${emoji} ${persona}`}</div>
              </div>
              <div style={{ color: pvMuted, fontSize: '12px', display: 'flex' }}>{footerUrl}</div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  // ── burn: master of burn rate ────────────────────────────────────────────
  if (style === 'burn') {
    const bBg1 = '#E8F5DC'
    const bBg2 = '#C8E0A8'
    const bBg3 = '#7DAF68'
    const bDark = '#1A3A0A'
    const bMid = '#2E6614'
    const bMuted = 'rgba(26,58,10,0.55)'
    const bGold = '#8B7A00'
    const bGoldBright = '#C8A800'
    const bSeal = '#0A6B14'

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: `radial-gradient(ellipse at center, ${bBg1} 0%, ${bBg2} 55%, ${bBg3} 100%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Outer border */}
          <div style={{ position: 'absolute', inset: '10px', border: `8px solid ${bMid}`, display: 'flex' }} />
          {/* Inner border */}
          <div style={{ position: 'absolute', inset: '24px', border: `1.5px solid ${bGold}`, display: 'flex' }} />
          {/* Dollar corners */}
          <span style={{ position: 'absolute', top: '6px', left: '6px', color: bGold, fontSize: '22px', lineHeight: 1, fontWeight: 700 }}>$</span>
          <span style={{ position: 'absolute', top: '6px', right: '6px', color: bGold, fontSize: '22px', lineHeight: 1, fontWeight: 700 }}>$</span>
          <span style={{ position: 'absolute', bottom: '6px', left: '6px', color: bGold, fontSize: '22px', lineHeight: 1, fontWeight: 700 }}>$</span>
          <span style={{ position: 'absolute', bottom: '6px', right: '6px', color: bGold, fontSize: '22px', lineHeight: 1, fontWeight: 700 }}>$</span>

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '36px 80px 24px',
              zIndex: 1,
              width: '100%',
              gap: '4px',
            }}
          >
            {/* Institution */}
            <div style={{ color: bMid, fontSize: '13px', letterSpacing: '2px', fontStyle: 'italic', display: 'flex' }}>
              Institute of Financial Incineration
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center', margin: '4px 0' }}>
              <div style={{ flex: 1, height: '1px', background: bGold, display: 'flex' }} />
              <span style={{ color: bGold, fontSize: '16px' }}>$</span>
              <div style={{ flex: 1, height: '1px', background: bGold, display: 'flex' }} />
            </div>

            {/* Main title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '28px' }}>🔥</span>
              <div
                style={{
                  color: bDark,
                  fontSize: '46px',
                  fontWeight: 700,
                  lineHeight: 1.05,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span style={{ display: 'flex' }}>Master of Burn Rate</span>
                <span style={{ fontSize: '18px', letterSpacing: '3px', color: bMid, display: 'flex', fontWeight: 400 }}>MBR</span>
              </div>
              <span style={{ fontSize: '28px' }}>🔥</span>
            </div>

            {/* Awarded to label */}
            <div style={{ color: bMuted, fontSize: '12px', marginTop: '6px', fontStyle: 'italic', display: 'flex' }}>
              Awarded to:
            </div>

            {/* Recipient */}
            <div style={{ color: bDark, fontSize: '19px', fontWeight: 700, letterSpacing: '2px', display: 'flex' }}>
              {founderSafe}
            </div>

            {/* For the ability */}
            <div style={{ color: bMuted, fontSize: '12px', fontStyle: 'italic', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '720px', lineHeight: 1.4 }}>
              For demonstrating unparalleled proficiency in incinerating capital on behalf of:
            </div>

            {/* Startup idea */}
            <div style={{ color: bDark, fontSize: '16px', fontWeight: 700, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {`[${titleSafe.toUpperCase()}]`}
            </div>

            {/* Rank */}
            <div style={{ color: bMid, fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', marginTop: '2px', display: 'flex' }}>
              RANK: CHIEF INCINERATION OFFICER (CIO)
            </div>

            {/* Citation body */}
            {excerptText && (
              <div
                style={{
                  color: bDark,
                  fontSize: '11px',
                  lineHeight: 1.55,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  maxWidth: '840px',
                  fontStyle: 'italic',
                  opacity: 0.75,
                }}
              >
                {excerptText.slice(0, 180)}
              </div>
            )}

            {/* Footer row: signatures + wax seal */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
              {/* Left signature */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                <span style={{ fontSize: '20px', color: bDark, display: 'flex' }}>💸 Venture Capitalist AI</span>
                <div style={{ width: '160px', height: '1px', background: bMid, display: 'flex' }} />
                <span style={{ fontSize: '10px', color: bMuted, display: 'flex' }}>Investment Destroyer</span>
              </div>

              {/* Wax seal */}
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: bSeal,
                  border: `4px solid ${bGoldBright}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1px',
                }}
              >
                <span style={{ fontSize: '24px', lineHeight: 1 }}>💰</span>
                <span style={{ fontSize: '6px', color: '#D8F0C8', letterSpacing: '0.5px', display: 'flex' }}>ROASTMEPAL.COM</span>
              </div>

              {/* Right signature */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <span style={{ fontSize: '20px', color: bDark, display: 'flex' }}>{`${emoji} ${persona}`}</span>
                <div style={{ width: '160px', height: '1px', background: bMid, display: 'flex' }} />
                <span style={{ fontSize: '10px', color: bMuted, display: 'flex' }}>Unit Economics Calculator</span>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  // ── rejection: VC letter from 2030 ───────────────────────────────────────
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
          <div style={{ position: 'absolute', inset: '14px', border: `5px solid ${rBorder}`, display: 'flex' }} />
          <div style={{ position: 'absolute', inset: '24px', border: `1px solid ${rBorderFaint}`, display: 'flex' }} />

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

          <div style={{ height: '1px', background: rBorderFaint, margin: '28px 0', zIndex: 1, display: 'flex' }} />

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, zIndex: 1 }}>
            <span style={{ color: rGreeting, fontSize: '17px', marginBottom: '16px' }}>{`Dear ${founderSafe},`}</span>
            <div style={{ color: rBody, fontSize: '16px', lineHeight: 1.65, flex: 1, display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', maxWidth: '100%' }}>
              {excerptText}
            </div>
          </div>

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

  // ── failure (default): certificate of startup failure ────────────────────
  const bg         = isLight ? '#FDFAF3' : '#0C0A05'
  const goldBright = isLight ? '#8B6914' : '#D4AF37'
  const goldFaint  = isLight ? 'rgba(139,105,20,0.3)' : 'rgba(212,175,55,0.3)'
  const goldMid    = isLight ? 'rgba(139,105,20,0.7)' : 'rgba(212,175,55,0.65)'
  const titleColor = isLight ? '#1C1200'  : '#F5F0E0'
  const bodyColor  = isLight ? 'rgba(50,35,0,0.7)'  : 'rgba(245,240,220,0.6)'
  const footerColor = isLight ? 'rgba(100,75,10,0.6)' : 'rgba(212,175,55,0.55)'

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
        <div style={{ position: 'absolute', inset: '14px', border: `6px solid ${goldBright}`, display: 'flex' }} />
        <div style={{ position: 'absolute', inset: '26px', border: `1px solid ${goldFaint}`, display: 'flex' }} />

        <span style={{ position: 'absolute', top: '6px',  left: '6px',  color: goldBright, fontSize: '24px', lineHeight: 1 }}>◆</span>
        <span style={{ position: 'absolute', top: '6px',  right: '6px', color: goldBright, fontSize: '24px', lineHeight: 1 }}>◆</span>
        <span style={{ position: 'absolute', bottom: '6px', left: '6px',  color: goldBright, fontSize: '24px', lineHeight: 1 }}>◆</span>
        <span style={{ position: 'absolute', bottom: '6px', right: '6px', color: goldBright, fontSize: '24px', lineHeight: 1 }}>◆</span>

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', width: '100%', justifyContent: 'center' }}>
            <div style={{ width: '140px', height: '2px', background: goldFaint, display: 'flex' }} />
            <span style={{ color: goldMid, fontSize: '18px' }}>◆</span>
            <div style={{ width: '140px', height: '2px', background: goldFaint, display: 'flex' }} />
          </div>

          <div style={{ color: goldBright, fontSize: '15px', letterSpacing: '8px', textTransform: 'uppercase', marginBottom: '8px', display: 'flex' }}>
            Certificate of Startup Failure
          </div>

          <div style={{ color: goldMid, fontSize: '12px', letterSpacing: '3px', marginBottom: '20px', display: 'flex' }}>
            ISSUED BY ROASTMEPAL · EST. MMXXIV
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', width: '100%', justifyContent: 'center' }}>
            <div style={{ width: '220px', height: '1px', background: goldFaint, display: 'flex' }} />
            <span style={{ color: goldFaint, fontSize: '13px' }}>◆  ◆  ◆</span>
            <div style={{ width: '220px', height: '1px', background: goldFaint, display: 'flex' }} />
          </div>

          <div style={{ color: bodyColor, fontSize: '13px', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex' }}>
            This certifies that the following startup idea has been officially and mercilessly destroyed:
          </div>

          <div style={{ color: titleColor, fontSize: titleSafe.length > 50 ? '22px' : '30px', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2, display: 'flex', maxWidth: '100%', wordBreak: 'break-word', overflow: 'hidden' }}>
            {`\u201c${titleSafe}\u201d`}
          </div>

          {excerptText && (
            <div style={{ color: bodyColor, fontSize: '14px', lineHeight: 1.6, marginBottom: '20px', fontStyle: 'italic', display: 'flex', flexWrap: 'wrap', maxWidth: '100%' }}>
              {excerptText}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', width: '100%', justifyContent: 'center' }}>
            <div style={{ width: '140px', height: '1px', background: goldFaint, display: 'flex' }} />
            <span style={{ color: goldMid, fontSize: '14px' }}>◆</span>
            <div style={{ width: '140px', height: '1px', background: goldFaint, display: 'flex' }} />
          </div>

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
