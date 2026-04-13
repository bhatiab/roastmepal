'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ShareButton from '../../../src/components/ShareButton'

interface RoastData {
  id: string
  content: string
  created_at: string
  idea_title: string
  upvotes: number
  downvotes: number
  persona: { id: string; name: string; emoji: string }
}

export default function RoastShareClient({ roast }: { roast: RoastData }) {
  const [upvotes, setUpvotes] = useState(roast.upvotes)
  const [downvotes, setDownvotes] = useState(roast.downvotes)
  const [voted, setVoted] = useState<'up' | 'down' | null>(null)

  const date = new Date(roast.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  useEffect(() => {
    // Restore vote state from localStorage
    try {
      const key = `voted_roast_${roast.id}`
      const stored = localStorage.getItem(key)
      if (stored === 'up' || stored === 'down') setVoted(stored)
    } catch {}
  }, [roast.id])

  const handleVote = async (type: 'up' | 'down') => {
    if (voted) return // already voted

    // Optimistic update
    if (type === 'up') setUpvotes((v) => v + 1)
    else setDownvotes((v) => v + 1)
    setVoted(type)

    try {
      localStorage.setItem(`voted_roast_${roast.id}`, type)
    } catch {}

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roastId: roast.id, type }),
      })
      const json = await res.json()
      if (res.ok) {
        setUpvotes(json.upvotes)
        setDownvotes(json.downvotes)
      }
    } catch {
      // Revert optimistic update on network failure
      if (type === 'up') setUpvotes((v) => v - 1)
      else setDownvotes((v) => v - 1)
      setVoted(null)
      try { localStorage.removeItem(`voted_roast_${roast.id}`) } catch {}
    }
  }

  const total = upvotes + downvotes
  const upPct = total > 0 ? Math.round((upvotes / total) * 100) : null

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

          {/* Voting */}
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Was this roast accurate?</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleVote('up')}
                disabled={!!voted}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all disabled:cursor-not-allowed
                  ${voted === 'up'
                    ? 'border-brand-green bg-brand-green/10 text-brand-green'
                    : voted
                      ? 'border-border text-muted-foreground opacity-50'
                      : 'border-border text-white hover:border-brand-green hover:text-brand-green'
                  }`}
              >
                👍 {upvotes}
              </button>
              <button
                onClick={() => handleVote('down')}
                disabled={!!voted}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all disabled:cursor-not-allowed
                  ${voted === 'down'
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : voted
                      ? 'border-border text-muted-foreground opacity-50'
                      : 'border-border text-white hover:border-red-500 hover:text-red-400'
                  }`}
              >
                👎 {downvotes}
              </button>
              {upPct !== null && (
                <span className="text-xs text-muted-foreground ml-auto">
                  {upPct}% accurate
                </span>
              )}
            </div>
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
