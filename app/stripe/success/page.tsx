'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function StripeSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const hasFetched = useRef(false)

  const [ideaTitle, setIdeaTitle] = useState('')
  const [roast, setRoast] = useState('')
  const [loading, setLoading] = useState(true)
  const [displayedRoast, setDisplayedRoast] = useState('')
  const [roastComplete, setRoastComplete] = useState(false)

  useEffect(() => {
    toast.success('🔥 You\'re Pro! All 4 personas unlocked.', { duration: 5000 })
  }, [])

  useEffect(() => {
    if (!sessionId || hasFetched.current) return
    hasFetched.current = true

    fetch(`/api/stripe/success-roast?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((d) => {
        setIdeaTitle(d.ideaTitle || '')
        setRoast(d.roast || '')
        setLoading(false)
      })
      .catch(() => {
        setIdeaTitle('your decision to pay $4.99 for RoastMePal Pro')
        setRoast("You paid $4.99 to get roasted. That's either the bravest thing I've ever seen or the dumbest. I built a whole company and got pushed out in month six. You? You just bought a roast subscription. I hate it, but I respect it. Don't waste it like I wasted my equity. I hope it fails.")
        setLoading(false)
      })
  }, [sessionId])

  // Typewriter effect for the roast
  useEffect(() => {
    if (!roast || loading) return
    setDisplayedRoast('')
    setRoastComplete(false)
    let index = 0
    const interval = setInterval(() => {
      if (index < roast.length) {
        setDisplayedRoast(roast.slice(0, index + 1))
        index++
      } else {
        setRoastComplete(true)
        clearInterval(interval)
      }
    }, 18)
    return () => clearInterval(interval)
  }, [roast, loading])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl space-y-8 animate-fade-up">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-5xl sm:text-6xl block">🎯</span>
          <h1 className="font-display text-3xl sm:text-4xl font-light text-brand-green">
            YOU ARE NOW DANGEROUS
          </h1>
          <p className="text-muted-foreground text-base">
            Welcome to RoastMePal Pro. You&apos;ve unlocked the dark side.
          </p>
          <div className="flex justify-center gap-3 text-xs text-muted-foreground/70 pt-1">
            <span>✓ All 4 Pro personas unlocked</span>
            <span>✓ Unlimited roasts</span>
          </div>
        </div>

        {/* One last roast */}
        <div className="card-surface space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">💔</span>
            <span className="text-xs font-semibold text-brand-green">Bitter Ex-CoFounder</span>
            <span className="text-xs text-muted-foreground">roasts your idea one last time</span>
          </div>

          {ideaTitle && (
            <div className="text-xs text-muted-foreground/70 font-mono bg-white/5 rounded px-3 py-1.5 leading-relaxed">
              &ldquo;{ideaTitle}&rdquo;
            </div>
          )}

          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-5/6 rounded bg-white/10" />
              <div className="h-3 w-4/6 rounded bg-white/10" />
              <div className="h-3 w-3/4 rounded bg-white/10" />
            </div>
          ) : (
            <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap font-body">
              {displayedRoast}
              {!roastComplete && (
                <span className="inline-block w-0.5 h-4 bg-brand-green ml-0.5 animate-pulse" />
              )}
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/')}
          className="btn-primary w-full text-base py-4"
        >
          Start Roasting Pro →
        </button>
      </div>
    </div>
  )
}
