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

  // ── delusion: certificate of distinguished delusion ──────────────────────
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

    const pText = '#1C1200'
    const pGold = '#B8960C'
    const pGoldBright = '#D4AF37'
    const pMuted = 'rgba(28,18,0,0.55)'
    const pTitle = fonts.some(f => f.name === 'Playfair') ? 'Playfair, serif' : 'serif'
    const pBody = fonts.some(f => f.name === 'Garamond') ? 'Garamond, serif' : 'serif'
    const pSig = fonts.some(f => f.name === 'Dancing') ? 'Dancing, cursive' : 'cursive'

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: '#FDFAF0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontFamily: pBody,
          }}
        >
          {/* Outer border */}
          <div style={{ position: 'absolute', inset: '12px', border: `5px solid ${pGold}`, display: 'flex' }} />
          {/* Inner border */}
          <div style={{ position: 'absolute', inset: '26px', border: `1px solid rgba(184,150,12,0.35)`, display: 'flex' }} />
          {/* Corner ornaments */}
          <span style={{ position: 'absolute', top: '5px', left: '5px', color: pGold, fontSize: '22px', lineHeight: 1 }}>◆</span>
          <span style={{ position: 'absolute', top: '5px', right: '5px', color: pGold, fontSize: '22px', lineHeight: 1 }}>◆</span>
          <span style={{ position: 'absolute', bottom: '5px', left: '5px', color: pGold, fontSize: '22px', lineHeight: 1 }}>◆</span>
          <span style={{ position: 'absolute', bottom: '5px', right: '5px', color: pGold, fontSize: '22px', lineHeight: 1 }}>◆</span>

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '52px 100px',
              zIndex: 1,
              width: '100%',
              gap: '6px',
            }}
          >
            {/* Title */}
            <div
              style={{
                color: pText,
                fontSize: '56px',
                fontWeight: 700,
                fontFamily: pTitle,
                lineHeight: 1.05,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span style={{ display: 'flex' }}>Certificate of</span>
              <span style={{ display: 'flex' }}>Distinguished Delusion</span>
            </div>

            {/* Divider */}
            <div style={{ width: '50%', height: '1px', background: pGold, display: 'flex', margin: '8px 0' }} />

            {/* Awarded to */}
            <div style={{ color: pMuted, fontSize: '15px', fontStyle: 'italic', fontFamily: pBody, display: 'flex' }}>
              Awarded to
            </div>

            {/* Founder name — prominent */}
            <div style={{ color: pText, fontSize: '32px', fontWeight: 700, fontFamily: pTitle, display: 'flex', letterSpacing: '1px' }}>
              {founderSafe}
            </div>

            {/* Body text */}
            <div
              style={{
                color: pMuted,
                fontSize: '14px',
                fontStyle: 'italic',
                fontFamily: pBody,
                lineHeight: 1.5,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: '680px',
                marginTop: '2px',
              }}
            >
              for exceptional ability to ignore all user feedback, market data, and common sense in pursuit of
            </div>

            {/* Startup name */}
            <div style={{ color: pText, fontSize: '18px', fontWeight: 700, fontFamily: pTitle, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {`[${titleSafe}]`}
            </div>

            {/* Signatures + gold coin seal */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '18px' }}>
              {/* Left sig */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                <span style={{ fontFamily: pSig, fontSize: '26px', color: pText, display: 'flex' }}>Dr. R. Pal</span>
                <div style={{ width: '140px', height: '1px', background: pGold, display: 'flex' }} />
                <span style={{ fontSize: '10px', color: pMuted, display: 'flex' }}>Dr. R. Pal, Dean of Incineration</span>
              </div>

              {/* Gold coin seal */}
              <div
                style={{
                  width: '78px',
                  height: '78px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 38% 38%, #F5D060 0%, #C8A020 58%, #906800 100%)`,
                  border: `4px solid ${pGoldBright}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '34px', lineHeight: 1 }}>🎓</span>
              </div>

              {/* Right sig */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <span style={{ fontFamily: pSig, fontSize: '26px', color: pText, display: 'flex' }}>{`${emoji} ${persona}`}</span>
                <div style={{ width: '140px', height: '1px', background: pGold, display: 'flex' }} />
                <span style={{ fontSize: '10px', color: pMuted, display: 'flex' }}>Chief Morale Destroyer</span>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts }
    )
  }

  // ── death: decree of incineration — startup death certificate ────────────
  if (style === 'death') {
    const [playfairData, dancingData] = await Promise.all([
      loadGoogleFont('Playfair Display', 700),
      loadGoogleFont('Dancing Script', 700),
    ])

    const fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style?: 'normal' | 'italic' }[] = []
    if (playfairData) fonts.push({ name: 'Playfair', data: playfairData, weight: 700 })
    if (dancingData) fonts.push({ name: 'Dancing', data: dancingData, weight: 700 })

    const dText = '#1A0A00'
    const dBrown = '#3D1C00'
    const dGold = '#8B6914'
    const dMuted = 'rgba(26,10,0,0.55)'
    const dTitle = fonts.some(f => f.name === 'Playfair') ? 'Playfair, serif' : 'serif'
    const dSig = fonts.some(f => f.name === 'Dancing') ? 'Dancing, cursive' : 'cursive'
    const causeOfDeath = excerptText.slice(0, 140) || 'Catastrophic delusion of market relevance'

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: 'radial-gradient(ellipse at center, #F5EDD0 0%, #E5D098 55%, #C4A060 100%)',
            display: 'flex',
            position: 'relative',
            fontFamily: dTitle,
            overflow: 'hidden',
          }}
        >
          {/* Borders */}
          <div style={{ position: 'absolute', inset: '10px', border: `8px solid ${dBrown}`, display: 'flex' }} />
          <div style={{ position: 'absolute', inset: '24px', border: `1.5px solid ${dGold}`, display: 'flex' }} />

          {/* Two-column layout */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              padding: '44px 56px 36px',
              gap: '28px',
              zIndex: 1,
            }}
          >
            {/* Left: skull */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '170px',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '120px', lineHeight: 1 }}>💀</span>
            </div>

            {/* Right: content */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* Title */}
              <div
                style={{
                  color: dText,
                  fontFamily: dTitle,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '10px',
                }}
              >
                <span style={{ fontSize: '20px', display: 'flex', letterSpacing: '1.5px' }}>DECREE OF INCINERATION:</span>
                <span style={{ fontSize: '28px', display: 'flex' }}>STARTUP DEATH CERTIFICATE</span>
              </div>

              {/* Divider */}
              <div style={{ height: '2px', background: dBrown, marginBottom: '14px', display: 'flex' }} />

              {/* Form fields */}
              {[
                { label: 'Founder Name', value: founderSafe },
                { label: 'Startup Idea', value: titleSafe },
                { label: 'Time of Implosion', value: 'Immediately upon conception' },
                { label: 'Primary Cause of Death', value: causeOfDeath },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '8px', marginBottom: '9px', alignItems: 'flex-start' }}>
                  <span style={{ color: dMuted, fontSize: '12px', width: '180px', flexShrink: 0, paddingTop: '1px', display: 'flex' }}>
                    {label}:
                  </span>
                  <span style={{ color: dText, fontSize: '13px', fontWeight: 700, flex: 1, display: 'flex', flexWrap: 'wrap', lineHeight: 1.4 }}>
                    {value}
                  </span>
                </div>
              ))}

              {/* Signatures + red wax seal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                {/* Left sig */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontFamily: dSig, fontSize: '28px', color: dText, display: 'flex' }}>Dr. R. Pal</span>
                  <div style={{ width: '140px', height: '1px', background: dBrown, display: 'flex' }} />
                  <span style={{ fontSize: '10px', color: dMuted, display: 'flex' }}>Dr. R. Pal, Dean of Incineration</span>
                </div>

                {/* Red wax seal with R */}
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #DD2200 0%, #AA1000 55%, #770800 100%)',
                    border: '4px solid #8B1000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: '#FFE8E8', fontSize: '30px', fontWeight: 900, fontFamily: 'sans-serif', display: 'flex' }}>R</span>
                </div>

                {/* Right sig */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                  <span style={{ fontFamily: dSig, fontSize: '28px', color: dText, display: 'flex' }}>{`${emoji} ${persona}`}</span>
                  <div style={{ width: '140px', height: '1px', background: dBrown, display: 'flex' }} />
                  <span style={{ fontSize: '10px', color: dMuted, display: 'flex' }}>Chief Morale Destroyer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts }
    )
  }

  // ── pivot: official pivot command & feature badge ─────────────────────────
  if (style === 'pivot') {
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: '#0F1117',
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Red diagonal slash — main */}
          <div
            style={{
              position: 'absolute',
              width: '330px',
              height: '1100px',
              background: '#CC1A1A',
              transform: 'rotate(-22deg)',
              left: '-100px',
              top: '-240px',
              display: 'flex',
              opacity: 0.95,
            }}
          />
          {/* Red diagonal slash — secondary */}
          <div
            style={{
              position: 'absolute',
              width: '100px',
              height: '1100px',
              background: '#991010',
              transform: 'rotate(-22deg)',
              left: '195px',
              top: '-240px',
              display: 'flex',
            }}
          />
          {/* Faint accent stripe */}
          <div
            style={{
              position: 'absolute',
              width: '36px',
              height: '1100px',
              background: 'rgba(220,40,40,0.25)',
              transform: 'rotate(-22deg)',
              left: '285px',
              top: '-240px',
              display: 'flex',
            }}
          />

          {/* Left: badge area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '280px',
              flexShrink: 0,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: '155px',
                height: '155px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #EF3030 0%, #CC1A1A 50%, #8B0000 100%)',
                border: '5px solid #FF5555',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '48px', lineHeight: 1 }}>▶</span>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: 900, letterSpacing: '3px', display: 'flex' }}>PIVOT</span>
            </div>
          </div>

          {/* Right: content */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '48px 60px 40px 16px',
              gap: '11px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Title */}
            <div
              style={{
                color: '#FFFFFF',
                fontSize: '34px',
                fontWeight: 900,
                lineHeight: 1.05,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ display: 'flex' }}>OFFICIAL "PIVOT"</span>
              <span style={{ display: 'flex' }}>COMMAND & FEATURE BADGE</span>
            </div>

            {/* Certified that */}
            <div style={{ color: '#777777', fontSize: '12px', letterSpacing: '2px', display: 'flex' }}>
              Certified that
            </div>

            {/* Startup name */}
            <div style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 700, display: 'flex', flexWrap: 'wrap' }}>
              {titleSafe}
            </div>

            {/* Description */}
            <div style={{ color: '#BBBBBB', fontSize: '14px', lineHeight: 1.5, display: 'flex', flexWrap: 'wrap' }}>
              is not a product. This is barely a feature that a competitor will implement in an afternoon.
            </div>

            {/* Mandatory pivot order */}
            {excerptText && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ color: '#EF4444', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', display: 'flex' }}>
                  MANDATORY PIVOT ORDER:
                </div>
                <div style={{ color: '#888888', fontSize: '13px', fontStyle: 'italic', display: 'flex', flexWrap: 'wrap', lineHeight: 1.4 }}>
                  {`"${excerptText.slice(0, 160)}"`}
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <div style={{ color: '#444', fontSize: '12px', display: 'flex' }}>{`Authorized: ${emoji} ${persona}  ·  ${footerUrl}`}</div>
              {/* R logo */}
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: '#CC1A1A',
                  border: '2px solid #EF5555',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: 'white', fontWeight: 900, fontSize: '22px', display: 'flex' }}>R</span>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  // ── burn: master of burn rate (MBR) ──────────────────────────────────────
  if (style === 'burn') {
    const dancingData = await loadGoogleFont('Dancing Script', 700)
    const fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style?: 'normal' | 'italic' }[] = []
    if (dancingData) fonts.push({ name: 'Dancing', data: dancingData, weight: 700 })
    const pSig = fonts.length > 0 ? 'Dancing, cursive' : 'cursive'

    const bText = '#1A3A08'
    const bMid = '#2E6614'
    const bMuted = 'rgba(26,58,8,0.6)'
    const bBorder = '#4A7A30'
    const bGold = '#C8A800'
    const bGoldBright = '#E0C020'

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: 'radial-gradient(ellipse at center, #DEEEC8 0%, #C8E0A8 60%, #A8C880 100%)',
            display: 'flex',
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Borders */}
          <div style={{ position: 'absolute', inset: '10px', border: `8px solid ${bBorder}`, display: 'flex' }} />
          <div style={{ position: 'absolute', inset: '24px', border: `1.5px solid rgba(74,122,48,0.5)`, display: 'flex' }} />
          {/* Corner $ */}
          <span style={{ position: 'absolute', top: '5px', left: '5px', color: bBorder, fontSize: '24px', fontWeight: 900, lineHeight: 1 }}>$</span>
          <span style={{ position: 'absolute', top: '5px', right: '5px', color: bBorder, fontSize: '24px', fontWeight: 900, lineHeight: 1 }}>$</span>
          <span style={{ position: 'absolute', bottom: '5px', left: '5px', color: bBorder, fontSize: '24px', fontWeight: 900, lineHeight: 1 }}>$</span>
          <span style={{ position: 'absolute', bottom: '5px', right: '5px', color: bBorder, fontSize: '24px', fontWeight: 900, lineHeight: 1 }}>$</span>

          {/* Three-column layout */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              padding: '38px 48px',
              gap: '16px',
              zIndex: 1,
              alignItems: 'center',
            }}
          >
            {/* Left: flaming dollar */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '140px',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '70px', lineHeight: 1 }}>💸</span>
              <span style={{ fontSize: '44px', lineHeight: 1 }}>🔥</span>
            </div>

            {/* Center: content */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '5px',
              }}
            >
              <div style={{ color: bMid, fontSize: '13px', letterSpacing: '3px', fontWeight: 700, display: 'flex' }}>
                PROFESSIONAL CERTIFICATION:
              </div>

              <div
                style={{
                  color: bText,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '40px', display: 'flex' }}>MASTER OF BURN RATE</span>
                <span style={{ fontSize: '19px', letterSpacing: '5px', display: 'flex' }}>(MBR)</span>
              </div>

              <div style={{ width: '400px', height: '1px', background: bBorder, display: 'flex', margin: '3px 0' }} />

              <div style={{ color: bMid, fontSize: '13px', fontStyle: 'italic', display: 'flex' }}>
                This certifies that
              </div>

              <div style={{ color: bText, fontSize: '26px', fontWeight: 700, display: 'flex' }}>
                {founderSafe}
              </div>

              <div style={{ color: bText, fontSize: '12px', lineHeight: 1.5, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '540px' }}>
                {`has demonstrated unparalleled proficiency in incinerating capital for ${titleSafe}.`}
              </div>

              <div style={{ color: bMid, fontSize: '11px', fontWeight: 700, letterSpacing: '1px', display: 'flex' }}>
                Rank: Chief Incineration Officer (CIO)
              </div>

              <div style={{ width: '400px', height: '1px', background: bBorder, display: 'flex', margin: '3px 0' }} />

              {/* Signatures + gold seal row */}
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                {/* Left sig */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                  <span style={{ fontFamily: pSig, fontSize: '22px', color: bText, display: 'flex' }}>Venture Capitalist</span>
                  <div style={{ width: '160px', height: '1px', background: bBorder, display: 'flex' }} />
                  <span style={{ fontSize: '9px', color: bMuted, display: 'flex' }}>Venture Capitalist AI, Investment Destroyer</span>
                </div>

                {/* Gold coin seal */}
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 35%, #F5D060 0%, ${bGold} 58%, #806000 100%)`,
                    border: `4px solid ${bGoldBright}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '28px', lineHeight: 1 }}>💰</span>
                </div>

                {/* Right sig */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                  <span style={{ fontFamily: pSig, fontSize: '22px', color: bText, display: 'flex' }}>Finance Bot</span>
                  <div style={{ width: '160px', height: '1px', background: bBorder, display: 'flex' }} />
                  <span style={{ fontSize: '9px', color: bMuted, display: 'flex' }}>Finance Bot 4000, Unit Economics Calculator</span>
                </div>
              </div>
            </div>

            {/* Right: money bag */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '140px',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '70px', lineHeight: 1 }}>💰</span>
              <span style={{ fontSize: '44px', lineHeight: 1 }}>👛</span>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts }
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
