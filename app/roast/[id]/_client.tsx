'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ShareButton from '../../../src/components/ShareButton'

interface RoastData {
  id: string
  content: string
  headline: string | null
  created_at: string
  idea_title: string
  upvotes: number
  downvotes: number
  burn_score: number | null
  pivot_suggestion: string | null
  cta_text: string | null
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

          {roast.headline && (
            <p className="text-white font-semibold text-base sm:text-lg leading-snug mb-3">
              {roast.headline}
            </p>
          )}

          <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap font-body">
            {roast.content}
          </div>

          {/* Burn Meter */}
          {roast.burn_score != null && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Burn Level</span>
                <span className="font-mono text-xs text-white">{roast.burn_score}/10</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${roast.burn_score * 10}%`,
                    background: roast.burn_score <= 3 ? '#00FF88' : roast.burn_score <= 7 ? '#F59E0B' : '#EF4444',
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {roast.burn_score <= 3 ? 'Slightly Delusional' : roast.burn_score <= 7 ? 'Venture Capitalist Bait' : 'Total Financial Arson'}
              </p>
            </div>
          )}

          {/* Pivot suggestion */}
          {roast.pivot_suggestion && (
            <div className="mt-3 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
              <p className="text-xs font-semibold text-amber-400 mb-1">🚨 Stupidly Smart Pivot</p>
              <p className="text-sm text-white/80">{roast.pivot_suggestion}</p>
            </div>
          )}

          {/* CTA — placeholder for future affiliate links */}
          {roast.cta_text && (
            <div className="mt-3 p-3 rounded-lg border border-brand-green/20 bg-brand-green/5">
              <p className="text-xs font-semibold text-brand-green mb-1">💡 While you&apos;re at it...</p>
              <p className="text-sm text-white/70">{roast.cta_text}</p>
            </div>
          )}

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
            headline={roast.headline ?? roast.content.split('.')[0] + '.'}
            content={roast.content}
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
