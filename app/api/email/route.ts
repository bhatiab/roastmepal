import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '../../../src/lib/supabase'

function buildWelcomeEmail(): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;padding:0 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:32px;">🔥</span>
      <h1 style="color:#00FF88;font-size:22px;font-weight:400;margin:8px 0 0;">RoastMePal</h1>
    </div>
    <div style="background:#13131A;border:1px solid #1F1F2E;border-radius:12px;padding:28px;">
      <h2 style="color:#ffffff;font-size:18px;font-weight:600;margin:0 0 12px;">You're in. 🎉</h2>
      <p style="color:#9CA3AF;font-size:14px;line-height:1.6;margin:0 0 20px;">
        Unlimited roasts, forever. Every startup idea you submit will be savagely destroyed by our AI personas.
      </p>
      <p style="color:#9CA3AF;font-size:14px;line-height:1.6;margin:0;">
        We'll send your roasts here from now on. No spam — just carnage.
      </p>
    </div>
    <p style="color:#4B5563;font-size:12px;text-align:center;margin-top:24px;">
      RoastMePal · All roasts fictional · <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color:#4B5563;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`
}

function buildRoastEmail(ideaTitle: string, personaEmoji: string, personaName: string, content: string): string {
  const excerpt = content.split('\n\n---\n')[0].trim()
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;padding:0 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:32px;">🔥</span>
      <h1 style="color:#00FF88;font-size:22px;font-weight:400;margin:8px 0 0;">RoastMePal</h1>
    </div>
    <div style="background:#13131A;border:1px solid #1F1F2E;border-radius:12px;padding:28px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        <span style="font-size:28px;">${personaEmoji}</span>
        <div>
          <p style="color:#00FF88;font-size:13px;font-weight:600;margin:0;">${personaName}</p>
          <p style="color:#6B7280;font-size:12px;margin:2px 0 0;">roasting &ldquo;${ideaTitle}&rdquo;</p>
        </div>
      </div>
      <div style="border-top:1px solid #1F1F2E;padding-top:16px;">
        <p style="color:#E5E7EB;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${excerpt}</p>
      </div>
    </div>
    <p style="color:#4B5563;font-size:12px;text-align:center;margin-top:24px;">
      RoastMePal · All roasts fictional · <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color:#4B5563;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionToken, email } = body

    if (!sessionToken || typeof sessionToken !== 'string') {
      return NextResponse.json({ error: 'Missing session.' }, { status: 400 })
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }

    const db = supabaseAdmin()

    const { error } = await db
      .from('rmp_sessions')
      .update({ email: email.trim().toLowerCase() })
      .eq('session_token', sessionToken)

    if (error) {
      return NextResponse.json({ error: 'Failed to save email.' }, { status: 500 })
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'RoastMePal <noreply@roastmepal.com>',
        to: email.trim(),
        subject: '🔥 Unlimited roasts unlocked — welcome to RoastMePal',
        html: buildWelcomeEmail(),
      }).catch(() => {}) // don't block on email failure
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
