'use client'

import Link from 'next/link'
import ShareButton from '../../../src/components/ShareButton'

interface RoastData {
  id: string
  content: string
  created_at: string
  idea_title: string
  persona: { id: string; name: string; emoji: string }
}

export default function RoastShareClient({ roast }: { roast: RoastData }) {
  const date = new Date(roast.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-background px-4 py-16 flex flex-col items-center">
      <Link href="/" className="text-brand-green text-sm mb-10 hover:underline">
        🔥 RoastMePal
      </Link>

      <div className="w-full max-w-2xl">
        <p className="eyebrow mb-2">Roast</p>
        <h1 className="font-display text-2xl font-light text-white mb-8">
          &ldquo;{roast.idea_title}&rdquo;
        </h1>

        <div className="card-surface">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{roast.persona.emoji}</span>
            <span className="text-sm font-semibold text-brand-green">{roast.persona.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">{date}</span>
          </div>

          <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap font-body">
            {roast.content}
          </div>

          <ShareButton
            roastId={roast.id}
            ideaTitle={roast.idea_title}
            personaName={roast.persona.name}
            personaEmoji={roast.persona.emoji}
            roastExcerpt={roast.content.slice(0, 160)}
          />
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="btn-primary inline-block">
            Roast your own idea →
          </Link>
        </div>
      </div>
    </div>
  )
}
