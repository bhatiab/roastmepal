'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { usePostHog } from '@posthog/react'
import Navbar from '../../src/components/Navbar'
import Footer from '../../src/components/Footer'
import PersonaPicker from '../../src/components/PersonaPicker'
import EmailGateModal from '../../src/components/EmailGateModal'
import { getOrCreateSessionToken } from '../../src/lib/session'
import type { PersonaId } from '../../src/lib/personas'

interface RoastoffResult {
  judgeA: string
  judgeB: string
  winner: 'A' | 'B'
  reason: string
  persona: { id: string; name: string; emoji: string }
}

export default function RoastoffClient() {
  const posthog = usePostHog()

  const [ideaA, setIdeaA] = useState('')
  const [ideaB, setIdeaB] = useState('')
  const [selectedPersona, setSelectedPersona] = useState<PersonaId | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RoastoffResult | null>(null)
  const [sessionToken, setSessionToken] = useState('')
  const [roastCount, setRoastCount] = useState(0)
  const [emailUnlocked, setEmailUnlocked] = useState(false)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [proLoading, setProLoading] = useState(false)

  useEffect(() => {
    const tok = getOrCreateSessionToken()
    setSessionToken(tok)
    fetch(`/api/session?token=${tok}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.is_pro) setIsPro(true)
        if (d.has_email) setEmailUnlocked(true)
        if (d.roast_count) setRoastCount(d.roast_count)
      })
      .catch(() => {})
  }, [])

  const doRoastoff = useCallback(async (tok: string) => {
    if (!ideaA.trim() || !ideaB.trim()) {
      toast.error('Enter both startup ideas.')
      return
    }
    if (!selectedPersona) {
      toast.error('Pick a persona to judge.')
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/roastoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaA: ideaA.trim(),
          ideaB: ideaB.trim(),
          personaId: selectedPersona,
          sessionToken: tok,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        if (json.error === 'auth_required') {
          setShowEmailGate(true)
          posthog?.capture('email_gate_shown', { source: 'roastoff', roast_count: roastCount })
          return
        }
        if (json.error === 'pro_required') {
          toast.error('This persona requires RoastMePal Pro.')
          return
        }
        toast.error(json.error || 'Something went wrong.')
        return
      }

      setRoastCount(json.data.roast_count)
      if (json.data.is_pro) setIsPro(true)
      setResult(json.data)

      posthog?.capture('roastoff_completed', {
        persona: selectedPersona,
        winner: json.data.winner,
      })
    } catch {
      toast.error('Network error. Try again.')
    } finally {
      setIsLoading(false)
    }
  }, [ideaA, ideaB, selectedPersona, roastCount, posthog])

  const handleStart = () => doRoastoff(sessionToken)

  const handleEmailGateSuccess = useCallback(() => {
    setEmailUnlocked(true)
    setShowEmailGate(false)
    posthog?.capture('email_captured', { source: 'roastoff_modal' })
    doRoastoff(sessionToken)
  }, [doRoastoff, sessionToken, posthog])

  const handleProClick = useCallback(async (personaId: PersonaId) => {
    posthog?.capture('pro_upgrade_clicked', { persona: personaId, source: 'roastoff' })
    setProLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken }),
      })
      const json = await res.json()
      if (json.url) {
        window.location.href = json.url
      } else {
        toast.error(json.error || 'Could not start checkout.')
      }
    } catch {
      toast.error('Network error. Try again.')
    } finally {
      setProLoading(false)
    }
  }, [sessionToken, posthog])

  const handleReset = () => {
    setIdeaA('')
    setIdeaB('')
    setSelectedPersona(null)
    setResult(null)
  }

  const winnerIdea = result ? (result.winner === 'A' ? ideaA : ideaB) : ''

  return (
    <div className="page-shell">
      <Navbar />

      <main className="flex flex-col items-center px-4 pt-20 pb-16">
        {/* Hero */}
        <div className="text-center mb-10 max-w-2xl">
          <p className="eyebrow mb-3">Roast-off</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
            Which idea is{' '}
            <span className="text-brand-green">least likely</span>
            {' '}to ruin your credit score?
          </h1>
          <p className="text-muted-foreground text-lg">
            Pit two startup ideas against each other. AI picks the winner.
          </p>
        </div>

        {!result && (
          <div className="w-full max-w-3xl space-y-6 animate-fade-up">
            {/* VS input row */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              {/* Idea A */}
              <div className="flex-1 card-surface space-y-2">
                <label className="eyebrow text-[10px]">Idea A</label>
                <input
                  type="text"
                  value={ideaA}
                  onChange={(e) => setIdeaA(e.target.value)}
                  placeholder="Uber for cats, but make it Web3..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-green transition-all"
                  maxLength={200}
                />
              </div>

              {/* VS divider */}
              <div className="flex items-center justify-center py-2 md:py-0">
                <span className="font-mono font-bold text-2xl text-muted-foreground select-none">VS</span>
              </div>

              {/* Idea B */}
              <div className="flex-1 card-surface space-y-2">
                <label className="eyebrow text-[10px]">Idea B</label>
                <input
                  type="text"
                  value={ideaB}
                  onChange={(e) => setIdeaB(e.target.value)}
                  placeholder="LinkedIn, but for your dog's resume..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-green transition-all"
                  maxLength={200}
                />
              </div>
            </div>

            {/* Persona picker */}
            <PersonaPicker
              selected={selectedPersona}
              onSelect={setSelectedPersona}
              isPro={isPro}
              onProClick={handleProClick}
            />

            {!isPro && (
              <p className="text-xs text-muted-foreground">
                🔒 4 premium personas — unlock with{' '}
                <button
                  onClick={() => handleProClick(selectedPersona ?? 'gordon')}
                  disabled={proLoading}
                  className="text-brand-green hover:underline disabled:opacity-50"
                >
                  RoastMePal Pro ($4.99)
                </button>
              </p>
            )}

            <button
              onClick={handleStart}
              disabled={isLoading || !ideaA.trim() || !ideaB.trim() || !selectedPersona}
              className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Judging...' : 'Start Roast-off ⚔️'}
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="w-full max-w-3xl mt-8">
            <div className="flex flex-col md:flex-row gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="flex-1 card-surface animate-pulse space-y-3">
                  <div className="h-3 w-16 rounded bg-white/10" />
                  <div className="h-4 w-32 rounded bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-white/10" />
                    <div className="h-3 w-5/6 rounded bg-white/10" />
                    <div className="h-3 w-4/6 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {result && !isLoading && (
          <div className="w-full max-w-3xl mt-2 space-y-4 animate-fade-up">
            {/* Verdict cards */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Idea A */}
              <div
                className={`flex-1 card-surface transition-all duration-300 ${
                  result.winner === 'B'
                    ? 'opacity-40'
                    : 'border-brand-green shadow-[0_0_20px_rgba(0,255,136,0.12)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{result.persona.emoji}</span>
                  <span className="text-xs font-semibold text-brand-green">{result.persona.name}</span>
                  {result.winner === 'A' && (
                    <span className="ml-auto text-xs font-mono font-bold text-brand-green">🏆 WINNER</span>
                  )}
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-3 truncate">&ldquo;{ideaA}&rdquo;</p>
                <p className="text-white/90 text-sm leading-relaxed">{result.judgeA}</p>
              </div>

              {/* VS badge */}
              <div className="flex items-center justify-center py-2 md:py-0">
                <span className="font-mono font-bold text-xl text-muted-foreground select-none">VS</span>
              </div>

              {/* Idea B */}
              <div
                className={`flex-1 card-surface transition-all duration-300 ${
                  result.winner === 'A'
                    ? 'opacity-40'
                    : 'border-brand-green shadow-[0_0_20px_rgba(0,255,136,0.12)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{result.persona.emoji}</span>
                  <span className="text-xs font-semibold text-brand-green">{result.persona.name}</span>
                  {result.winner === 'B' && (
                    <span className="ml-auto text-xs font-mono font-bold text-brand-green">🏆 WINNER</span>
                  )}
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-3 truncate">&ldquo;{ideaB}&rdquo;</p>
                <p className="text-white/90 text-sm leading-relaxed">{result.judgeB}</p>
              </div>
            </div>

            {/* Winner banner */}
            <div className="card-surface border-brand-green bg-brand-green/5 text-center py-6">
              <p className="eyebrow mb-2">Least Likely to Ruin Your Credit Score</p>
              <p className="font-display text-2xl font-light text-white mt-2">
                🏆 &ldquo;{winnerIdea}&rdquo;
              </p>
              {result.reason && (
                <p className="text-muted-foreground text-sm mt-3 max-w-lg mx-auto">{result.reason}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={handleReset} className="btn-primary flex-1">
                Try Another Roast-off
              </button>
              <Link href="/" className="btn-secondary flex-1 text-center">
                ← Single Roast
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <EmailGateModal
        open={showEmailGate}
        sessionToken={sessionToken}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  )
}
