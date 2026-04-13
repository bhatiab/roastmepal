'use client'

import { useState, useEffect } from 'react'
import ShareButton from './ShareButton'

interface RoastDisplayProps {
  roast: {
    id?: string
    content: string
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
    <div className="card-surface w-full max-w-2xl mx-auto animate-fade-up">
      <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
        <span className="text-xl sm:text-2xl">{roast.persona.emoji}</span>
        <span className="text-sm font-semibold text-brand-green">
          {roast.persona.name}
        </span>
        <span className="text-xs text-muted-foreground">roasting</span>
        <span className="text-xs font-mono text-white/70 truncate max-w-[160px] sm:max-w-none">
          &ldquo;{ideaTitle}&rdquo;
        </span>
      </div>

      <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap font-body">
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-0.5 h-4 bg-brand-green ml-0.5 animate-pulse" />
        )}
      </div>

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

      {isComplete && roast.id && (
        <ShareButton
          roastId={roast.id}
          ideaTitle={ideaTitle}
          personaName={roast.persona.name}
          personaEmoji={roast.persona.emoji}
          roastExcerpt={roast.content.slice(0, 160)}
        />
      )}
    </div>
  )
}
