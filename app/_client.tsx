'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { usePostHog } from '@posthog/react'
import Navbar from '../src/components/Navbar'
import Footer from '../src/components/Footer'
import PersonaPicker from '../src/components/PersonaPicker'
import RoastDisplay from '../src/components/RoastDisplay'
import EmailGateModal from '../src/components/EmailGateModal'
import { CATEGORIES } from '../src/lib/categories'
import { getOrCreateSessionToken } from '../src/lib/session'
import type { PersonaId } from '../src/lib/personas'

interface RoastResult {
  id: string
  content: string
  persona: { id: string; name: string; emoji: string }
}

interface IdeaResult {
  id: string
  title: string
  category: string
}

export function HomeClient() {
  const posthog = usePostHog()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Other')
  const [selectedPersona, setSelectedPersona] = useState<PersonaId | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null)
  const [ideaResult, setIdeaResult] = useState<IdeaResult | null>(null)
  const [sessionToken, setSessionToken] = useState('')
  const [roastCount, setRoastCount] = useState(0)
  const [emailUnlocked, setEmailUnlocked] = useState(false)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [proLoading, setProLoading] = useState(false)

  useEffect(() => {
    const tok = getOrCreateSessionToken()
    setSessionToken(tok)

    // Restore session state (pro status, email unlock)
    fetch(`/api/session?token=${tok}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.is_pro) setIsPro(true)
        if (d.has_email) setEmailUnlocked(true)
        if (d.roast_count) setRoastCount(d.roast_count)
      })
      .catch(() => {})
  }, [])

  const doRoast = useCallback(async (tok: string) => {
    if (!title.trim()) {
      toast.error('Give us something to roast! Enter your idea.')
      return
    }
    if (!selectedPersona) {
      toast.error('Pick a persona to roast your idea.')
      return
    }

    setIsLoading(true)
    setRoastResult(null)
    setIdeaResult(null)

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          personaId: selectedPersona,
          sessionToken: tok,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        if (json.error === 'auth_required') {
          setShowEmailGate(true)
          posthog?.capture('email_gate_shown', { roast_count: roastCount })
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
      setRoastResult(json.data.roast)
      setIdeaResult(json.data.idea)

      posthog?.capture('roast_generated', {
        persona: selectedPersona,
        category,
        roast_count: json.data.roast_count,
      })
    } catch {
      toast.error('Network error. Try again.')
    } finally {
      setIsLoading(false)
    }
  }, [title, description, category, selectedPersona, roastCount, posthog])

  const handleRoast = () => doRoast(sessionToken)

  const handleEmailGateSuccess = useCallback(() => {
    setEmailUnlocked(true)
    setShowEmailGate(false)
    posthog?.capture('email_captured', { source: 'modal' })
    doRoast(sessionToken)
  }, [doRoast, sessionToken, posthog])

  const handleInlineEmailSubmitted = useCallback(() => {
    setEmailUnlocked(true)
    posthog?.capture('email_captured', { source: 'inline' })
  }, [posthog])

  const handleProClick = useCallback(async (personaId: PersonaId) => {
    posthog?.capture('pro_upgrade_clicked', { persona: personaId })
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
    setTitle('')
    setDescription('')
    setCategory('Other')
    setSelectedPersona(null)
    setRoastResult(null)
    setIdeaResult(null)
  }

  const showInlineEmailPrompt = roastCount >= 2 && !emailUnlocked

  return (
    <div className="page-shell">
      <Navbar />

      <main className="flex flex-col items-center px-4 pt-20 pb-16">
        {/* Hero */}
        <div className="text-center mb-10 max-w-2xl">
          <p className="eyebrow mb-3">Free startup therapy</p>
          <h1 className="font-display text-4xl md:text-6xl font-light text-white mb-4">
            Get Your Startup Idea{' '}
            <span className="text-brand-green">Roasted</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Submit your idea. Pick an AI persona. Get savagely destroyed.
          </p>
        </div>

        {/* Input Section */}
        {!roastResult && (
          <div className="w-full max-w-2xl space-y-6 animate-fade-up">
            <div className="card-surface space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Your startup idea
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Uber for dogs, but on the blockchain..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-green transition-all"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Description{' '}
                  <span className="text-muted-foreground/50">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us more so we can roast you harder..."
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-green transition-all resize-none"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-green transition-all cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <PersonaPicker
              selected={selectedPersona}
              onSelect={setSelectedPersona}
              isPro={isPro}
              onProClick={handleProClick}
            />

            {!isPro && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  🔒 4 premium personas — unlock with{' '}
                  <button
                    onClick={() => selectedPersona ? handleProClick(selectedPersona) : handleProClick('gordon')}
                    disabled={proLoading}
                    className="text-brand-green hover:underline disabled:opacity-50"
                  >
                    RoastMePal Pro ($4.99)
                  </button>
                </p>
              </div>
            )}

            <button
              onClick={handleRoast}
              disabled={isLoading || !title.trim() || !selectedPersona}
              className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Roasting...' : 'Roast Me'}
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="w-full max-w-2xl mt-8">
            <div className="card-surface animate-pulse">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="h-4 w-24 rounded bg-white/10" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-3 w-5/6 rounded bg-white/10" />
                <div className="h-3 w-4/6 rounded bg-white/10" />
              </div>
            </div>
          </div>
        )}

        {/* Roast Result */}
        {roastResult && ideaResult && (
          <div className="w-full max-w-2xl mt-2 space-y-4">
            <RoastDisplay
              roast={roastResult}
              ideaTitle={ideaResult.title}
              showEmailPrompt={showInlineEmailPrompt}
              sessionToken={sessionToken}
              onEmailSubmitted={handleInlineEmailSubmitted}
            />

            <button onClick={handleReset} className="btn-secondary w-full">
              Roast Another Idea
            </button>
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
