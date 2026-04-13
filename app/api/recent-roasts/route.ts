import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../src/lib/supabase'
import { PERSONAS } from '../../../src/lib/personas'

export async function GET() {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db
      .from('rmp_roasts')
      .select('id, persona_id, rmp_ideas!inner(title)')
      .order('created_at', { ascending: false })
      .limit(14)

    if (error || !data) {
      return NextResponse.json({ items: [] })
    }

    const items = data.map((row: { id: string; persona_id: string; rmp_ideas: { title: string } | { title: string }[] }) => {
      const persona = PERSONAS.find((p) => p.id === row.persona_id)
      const ideaTitle = Array.isArray(row.rmp_ideas) ? row.rmp_ideas[0]?.title : row.rmp_ideas?.title
      return {
        id: row.id,
        personaEmoji: persona?.emoji ?? '🔥',
        personaName: persona?.name ?? row.persona_id,
        ideaTitle: ideaTitle ?? 'an idea',
      }
    })

    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ items: [] })
  }
}
