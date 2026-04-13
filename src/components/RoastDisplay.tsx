'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import ShareButton from './ShareButton'

interface RoastDisplayProps {
  roast: {
    id?: string
    content: string
    headline?: string | null
    burn_score?: number | null
    pivot_suggestion?: string | null
    cta_text?: string | null
    persona: {
      id: string
      name: string
      emoji: string
    }
  }
  ideaTitle: string
  showEmailPrompt?: boolean
  sessionToken?: string
  onEmailSubmitted?: () => void
}

export default function RoastDisplay({
  roast,
  ideaTitle,
  showEmailPrompt,
  sessionToken,
  onEmailSubmitted,
}: RoastDisplayProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [email, setEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailDone, setEmailDone] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)
    let index = 0
    const interval = setInterval(() => {
      if (index < roast.content.length) {
        setDisplayedText(roast.content.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, 15)
    return () => clearInterval(interval)
  }, [roast.content])

  const handleEmailSubmit = async () => {
    setEmailError('')
    const trimmed = email.trim()
    if (!trimmed) {
      setEmailError('Enter your email.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      setEmailError('Enter a valid email address.')
      return
    }

    setEmailLoading(true)
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken, email: trimmed }),
      })
      const json = await res.json()
      if (!res.ok) {
        setEmailError(json.error || 'Something went wrong.')
        return
      }
      setEmailDone(true)
      onEmailSubmitted?.()
    } catch {
      setEmailError('Network error. Try again.')
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="card-surface w-full max-w-xl mx-auto animate-fade-up">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-lg">{roast.persona.emoji}</span>
        <span className="text-xs font-semibold text-brand-green">
          {roast.persona.name}
        </span>
        <span className="text-xs text-muted-foreground">roasting</span>
        <span className="text-xs font-mono text-white/60 truncate max-w-[140px] sm:max-w-none">
          &ldquo;{ideaTitle}&rdquo;
        </span>
      </div>

      {/* Headline */}
      {roast.headline && (
        <div className="flex items-start gap-2 mb-3">
          <p className="flex-1 font-display text-brand-green text-xl sm:text-2xl leading-tight">
            {roast.headline}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(roast.headline!)
              toast.success('Headline copied!')
            }}
            className="shrink-0 text-xs text-muted-foreground hover:text-white transition-colors mt-1 px-2 py-1 border border-border rounded hover:border-white/20"
          >
            Copy
          </button>
        </div>
      )}

      <div className="text-white/85 text-sm leading-snug whitespace-pre-wrap font-body">
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-0.5 h-4 bg-brand-green ml-0.5 animate-pulse" />
        )}
      </div>

      {/* Burn Meter */}
      {isComplete && roast.burn_score != null && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Burn Level</span>
            <span className="font-mono text-xs text-white">{roast.burn_score}/10</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
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
      {isComplete && roast.pivot_suggestion && (
        <div className="mt-3 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
          <p className="text-xs font-semibold text-amber-400 mb-1">🚨 Stupidly Smart Pivot</p>
          <p className="text-sm text-white/80">{roast.pivot_suggestion}</p>
        </div>
      )}

      {/* CTA — placeholder for future affiliate links */}
      {isComplete && roast.cta_text && (
        <div className="mt-3 p-3 rounded-lg border border-brand-green/20 bg-brand-green/5">
          <p className="text-xs font-semibold text-brand-green mb-1">💡 While you&apos;re at it...</p>
          <p className="text-sm text-white/70">{roast.cta_text}</p>
        </div>
      )}

      {showEmailPrompt && isComplete && !emailDone && (
        <div className="border-t border-border mt-6 pt-5">
          <p className="eyebrow mb-1">Unlock unlimited roasts</p>
          <p className="text-sm text-muted-foreground mb-3">
            Drop your email to keep roasting forever. No spam, no account.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError('')
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
              placeholder="you@example.com"
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-green transition-all"
            />
            <button
              onClick={handleEmailSubmit}
              disabled={emailLoading}
              className="btn-primary text-sm px-5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {emailLoading ? '...' : 'Unlock'}
            </button>
          </div>
          {emailError && <p className="text-red-400 text-xs mt-1.5">{emailError}</p>}
        </div>
      )}

      {showEmailPrompt && emailDone && (
        <div className="border-t border-border mt-6 pt-4">
          <p className="text-brand-green text-sm font-medium">
            ✓ Unlocked! Keep roasting all you want.
          </p>
        </div>
      )}

      {/* Quick share bar — appears the moment roast completes */}
      {isComplete && (
        <div className="mt-4 p-3 rounded-xl bg-brand-green/10 border border-brand-green/25 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-white/60 shrink-0">Share before you cry about it</p>
          <div className="flex gap-2">
            <button
              onClick={() => window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  (roast.headline ?? roast.content.split('.')[0] + '.') +
                  ` — roasted by ${roast.persona.emoji} ${roast.persona.name} on RoastMePal`
                )}&url=${encodeURIComponent(
                  (process.env.NEXT_PUBLIC_APP_URL || 'https://roastmepal.com') + (roast.id ? `/roast/${roast.id}` : '')
                )}`,
                '_blank', 'noopener,noreferrer'
              )}
              className="btn-primary text-xs px-3 py-1.5"
            >
              𝕏 Post
            </button>
            <button
              onClick={() => {
                toast.success('Open Instagram Stories to share 📸')
                setTimeout(() => { window.location.href = 'instagram://' }, 800)
              }}
              className="btn-ghost text-xs px-3 py-1.5"
            >
              📸 Stories
            </button>
          </div>
        </div>
      )}

      {isComplete && roast.id && (
        <ShareButton
          roastId={roast.id}
          ideaTitle={ideaTitle}
          personaName={roast.persona.name}
          personaEmoji={roast.persona.emoji}
          headline={roast.headline ?? roast.content.split('.')[0] + '.'}
        />
      )}
    </div>
  )
}
