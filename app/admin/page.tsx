import { supabaseAdmin } from '../../src/lib/supabase'
import { getPersona } from '../../src/lib/personas'
import type { PersonaId } from '../../src/lib/personas'
import AdminClient from './_client'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const db = supabaseAdmin()

  const [
    { count: totalRoasts },
    { count: totalLeads },
    { count: totalPro },
    { count: totalIdeas },
    { data: leads },
    { data: rawRoasts },
  ] = await Promise.all([
    db.from('rmp_roasts').select('*', { count: 'exact', head: true }),
    db.from('rmp_sessions').select('*', { count: 'exact', head: true }).not('email', 'is', null),
    db.from('rmp_sessions').select('*', { count: 'exact', head: true }).eq('is_pro', true),
    db.from('rmp_ideas').select('*', { count: 'exact', head: true }),
    db.from('rmp_sessions')
      .select('email, roast_count, is_pro, created_at')
      .not('email', 'is', null)
      .order('created_at', { ascending: false }),
    db.from('rmp_roasts')
      .select('id, persona_id, created_at, idea_id')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  // Fetch idea titles for recent roasts
  const ideaIds = [...new Set((rawRoasts ?? []).map((r) => r.idea_id).filter(Boolean))]
  let ideasMap: Record<string, string> = {}
  if (ideaIds.length > 0) {
    const { data: ideas } = await db
      .from('rmp_ideas')
      .select('id, title')
      .in('id', ideaIds)
    for (const idea of ideas ?? []) {
      ideasMap[idea.id] = idea.title
    }
  }

  const recentRoasts = (rawRoasts ?? []).map((r) => {
    const persona = getPersona(r.persona_id as PersonaId)
    return {
      id: r.id,
      persona_id: r.persona_id,
      persona_emoji: persona?.emoji ?? '🔥',
      persona_name: persona?.name ?? r.persona_id,
      idea_title: ideasMap[r.idea_id] ?? '—',
      created_at: r.created_at,
    }
  })

  return (
    <AdminClient
      stats={{
        totalRoasts: totalRoasts ?? 0,
        totalLeads: totalLeads ?? 0,
        totalPro: totalPro ?? 0,
        totalIdeas: totalIdeas ?? 0,
      }}
      leads={leads ?? []}
      recentRoasts={recentRoasts}
    />
  )
}
