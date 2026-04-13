import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import RoastShareClient from './_client'
import { supabaseAdmin } from '../../../src/lib/supabase'
import { getPersona } from '../../../src/lib/personas'

interface Props {
  params: Promise<{ id: string }>
}

async function getRoast(id: string) {
  const { data: roast, error } = await supabaseAdmin()
    .from('rmp_roasts')
    .select('id, persona_id, content, created_at, idea_id')
    .eq('id', id)
    .single()

  if (error || !roast) return null

  const { data: idea } = await supabaseAdmin()
    .from('rmp_ideas')
    .select('title, category')
    .eq('id', roast.idea_id)
    .single()

  const persona = getPersona(roast.persona_id as Parameters<typeof getPersona>[0])

  return {
    id: roast.id,
    content: roast.content,
    created_at: roast.created_at,
    idea_title: idea?.title ?? 'Unknown idea',
    idea_category: idea?.category ?? 'Other',
    persona: persona
      ? { id: persona.id, name: persona.name, emoji: persona.emoji }
      : { id: roast.persona_id, name: roast.persona_id, emoji: '🔥' },
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const roast = await getRoast(id)
  if (!roast) return { title: 'Roast not found' }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
  const excerpt = roast.content.replace(/\n\n---\n.*$/s, '').slice(0, 160)
  const ogUrl = `${appUrl}/api/og?title=${encodeURIComponent(roast.idea_title)}&persona=${encodeURIComponent(roast.persona.name)}&emoji=${encodeURIComponent(roast.persona.emoji)}&excerpt=${encodeURIComponent(excerpt)}`

  return {
    title: `"${roast.idea_title}" got roasted by ${roast.persona.name}`,
    description: excerpt,
    openGraph: {
      title: `${roast.persona.emoji} ${roast.persona.name} destroyed "${roast.idea_title}"`,
      description: excerpt,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${roast.persona.emoji} ${roast.persona.name} destroyed "${roast.idea_title}"`,
      description: excerpt,
      images: [ogUrl],
    },
  }
}

export default async function RoastPage({ params }: Props) {
  const { id } = await params
  const roast = await getRoast(id)
  if (!roast) notFound()
  return <RoastShareClient roast={roast} />
}
