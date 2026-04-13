import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../src/lib/supabase'
import { getPersona } from '../../../../src/lib/personas'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Missing id.' }, { status: 400 })
  }

  try {
    const { data: roast, error } = await supabaseAdmin()
      .from('rmp_roasts')
      .select('id, persona_id, content, created_at, idea_id')
      .eq('id', id)
      .single()

    if (error || !roast) {
      return NextResponse.json({ error: 'Roast not found.' }, { status: 404 })
    }

    const { data: idea } = await supabaseAdmin()
      .from('rmp_ideas')
      .select('title, category')
      .eq('id', roast.idea_id)
      .single()

    const persona = getPersona(roast.persona_id as Parameters<typeof getPersona>[0])

    return NextResponse.json({
      id: roast.id,
      content: roast.content,
      created_at: roast.created_at,
      idea_title: idea?.title ?? 'Unknown idea',
      idea_category: idea?.category ?? 'Other',
      persona: persona
        ? { id: persona.id, name: persona.name, emoji: persona.emoji }
        : { id: roast.persona_id, name: roast.persona_id, emoji: '🔥' },
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
