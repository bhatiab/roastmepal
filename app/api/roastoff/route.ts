import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '../../../src/lib/supabase'
import { getPersona, type PersonaId } from '../../../src/lib/personas'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ideaA, ideaB, personaId, sessionToken } = body

    if (!ideaA || typeof ideaA !== 'string' || !ideaA.trim()) {
      return NextResponse.json({ error: 'Idea A is required.' }, { status: 400 })
    }
    if (!ideaB || typeof ideaB !== 'string' || !ideaB.trim()) {
      return NextResponse.json({ error: 'Idea B is required.' }, { status: 400 })
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

    // Gate check
    if (session.roast_count >= 2 && !session.user_id && !session.email && !session.is_pro) {
      return NextResponse.json({ error: 'auth_required' }, { status: 403 })
    }

    // Pro persona check
    if (persona.isPro && !session.is_pro) {
      return NextResponse.json({ error: 'pro_required' }, { status: 403 })
    }

    const systemPrompt =
      persona.systemPrompt +
      `\n\nYou are now judging a ROAST-OFF between two startup ideas. ` +
      `Give each idea a punchy 2-sentence verdict in your persona's voice, ` +
      `then declare which one is "least likely to ruin your credit score" as the winner. ` +
      `Respond ONLY with valid JSON, no markdown, no code fences: ` +
      `{"judgeA":"...","judgeB":"...","winner":"A","reason":"one punchy sentence declaring the winner"}`

    const userMessage = `Idea A: ${ideaA.trim()}\n\nIdea B: ${ideaB.trim()}`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    // Strip markdown fences if present
    const jsonText = rawText.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '').trim()

    let result: { judgeA: string; judgeB: string; winner: string; reason: string }
    try {
      result = JSON.parse(jsonText)
    } catch {
      return NextResponse.json({ error: 'Could not generate verdict. Try again.' }, { status: 500 })
    }

    if (!result.judgeA || !result.judgeB || !['A', 'B'].includes(result.winner)) {
      return NextResponse.json({ error: 'Could not generate verdict. Try again.' }, { status: 500 })
    }

    // Increment roast count
    await db
      .from('rmp_sessions')
      .update({ roast_count: session.roast_count + 1 })
      .eq('id', session.id)

    return NextResponse.json({
      data: {
        judgeA: result.judgeA,
        judgeB: result.judgeB,
        winner: result.winner as 'A' | 'B',
        reason: result.reason || '',
        roast_count: session.roast_count + 1,
        persona: { id: persona.id, name: persona.name, emoji: persona.emoji },
      },
    })
  } catch (err) {
    console.error('Roastoff API error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. The judges fled the building.' },
      { status: 500 }
    )
  }
}
