import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '../../../../src/lib/supabase'
import { getPersona } from '../../../../src/lib/personas'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const FALLBACK_IDEA = 'your decision to pay $4.99 for RoastMePal Pro'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  try {
    // Retrieve Stripe checkout session to get sessionToken from metadata
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)
    const sessionToken = checkoutSession.metadata?.sessionToken

    let ideaTitle = FALLBACK_IDEA

    if (sessionToken) {
      const db = supabaseAdmin()

      // Get most recent idea for this session
      const { data: sessionRow } = await db
        .from('rmp_sessions')
        .select('id')
        .eq('session_token', sessionToken)
        .single()

      if (sessionRow) {
        const { data: idea } = await db
          .from('rmp_ideas')
          .select('title')
          .eq('session_id', sessionRow.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (idea?.title) {
          ideaTitle = idea.title
        }
      }
    }

    // Generate roast with Bitter Ex-CoFounder persona
    const persona = getPersona('ex')!
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 250,
      temperature: 0.9,
      system: persona.systemPrompt,
      messages: [{ role: 'user', content: `Startup idea: ${ideaTitle}` }],
    })

    const roast =
      message.content[0].type === 'text'
        ? message.content[0].text
        : "Good luck with that. You'll need it. I hope it fails."

    return NextResponse.json({ ideaTitle, roast })
  } catch {
    // Stripe session invalid or any other error — return a funny fallback
    return NextResponse.json({
      ideaTitle: FALLBACK_IDEA,
      roast: `You paid $4.99 to get roasted. That's either the bravest thing I've ever seen or the dumbest. Knowing you, probably both. My startup failed because of people like you — people with ideas and no fear. I built a whole company and got pushed out in month six. You? You just bought a roast subscription. Honestly? I respect it. I hate it, but I respect it. Don't waste it like I wasted my equity. I hope it fails.`,
    })
  }
}
