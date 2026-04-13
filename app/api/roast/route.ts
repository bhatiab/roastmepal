import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'
import { supabaseAdmin } from '../../../src/lib/supabase'
import { getPersona, type PersonaId } from '../../../src/lib/personas'
import { getPromoLine } from '../../../src/lib/promos'
import { CATEGORIES } from '../../../src/lib/categories'
import { buildRoastEmail } from '../../../src/lib/email-templates'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, personaId, sessionToken } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
    }

    if (!personaId || typeof personaId !== 'string') {
      return NextResponse.json({ error: 'Pick a persona.' }, { status: 400 })
    }

    if (!sessionToken || typeof sessionToken !== 'string') {
      return NextResponse.json({ error: 'Missing session.' }, { status: 400 })
    }

    const persona = getPersona(personaId as PersonaId)
    if (!persona) {
      return NextResponse.json({ error: 'Invalid persona.' }, { status: 400 })
    }

    const validCategory = CATEGORIES.includes(category) ? category : 'Other'

    const db = supabaseAdmin()

    // Upsert session
    const { data: existingSession } = await db
      .from('rmp_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single()

    let session = existingSession

    if (!session) {
      const { data: newSession, error: sessionErr } = await db
        .from('rmp_sessions')
        .insert({ session_token: sessionToken })
        .select()
        .single()

      if (sessionErr) {
        return NextResponse.json({ error: 'Failed to create session.' }, { status: 500 })
      }
      session = newSession
    }

    // Gate check: 2 free roasts, then email required (pro bypasses gate)
    if (session.roast_count >= 2 && !session.user_id && !session.email && !session.is_pro) {
      return NextResponse.json({ error: 'auth_required' }, { status: 403 })
    }

    // Pro check: persona requires pro
    if (persona.isPro && !session.is_pro) {
      return NextResponse.json({ error: 'pro_required' }, { status: 403 })
    }

    // Insert idea
    const { data: idea, error: ideaErr } = await db
      .from('rmp_ideas')
      .insert({
        title: title.trim(),
        description: (description || '').trim(),
        category: validCategory,
        session_id: session.id,
        user_id: session.user_id || null,
      })
      .select()
      .single()

    if (ideaErr) {
      return NextResponse.json({ error: 'Failed to save idea.' }, { status: 500 })
    }

    // Call Claude API
    const userMessage = description
      ? `Startup idea: ${title.trim()}\n\nDescription: ${description.trim()}`
      : `Startup idea: ${title.trim()}`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      temperature: 0.9,
      system: persona.systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const roastContent =
      message.content[0].type === 'text' ? message.content[0].text : ''

    const promoLine = getPromoLine()
    const fullContent = `${roastContent}\n\n---\n${promoLine}`

    // Insert roast
    const { data: roast, error: roastErr } = await db
      .from('rmp_roasts')
      .insert({
        idea_id: idea.id,
        persona_id: persona.id,
        content: fullContent,
        is_ai: true,
        user_id: session.user_id || null,
      })
      .select()
      .single()

    if (roastErr) {
      return NextResponse.json({ error: 'Failed to save roast.' }, { status: 500 })
    }

    // Increment roast count
    await db
      .from('rmp_sessions')
      .update({ roast_count: session.roast_count + 1 })
      .eq('id', session.id)

    // Fire-and-forget email for returning users who gave email
    if (session.email && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'RoastMePal <noreply@roastmepal.com>',
        to: session.email,
        subject: `${persona.emoji} Your roast from ${persona.name} is here`,
        html: buildRoastEmail(title.trim(), persona.emoji, persona.name, fullContent),
      }).catch(() => {})
    }

    return NextResponse.json({
      data: {
        roast_count: session.roast_count + 1,
        is_pro: session.is_pro ?? false,
        idea: { id: idea.id, title: idea.title, category: idea.category },
        roast: {
          id: roast.id,
          content: fullContent,
          persona: { id: persona.id, name: persona.name, emoji: persona.emoji },
        },
      },
    })
  } catch (err) {
    console.error('Roast API error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Even AI needs a break sometimes.' },
      { status: 500 }
    )
  }
}
