'use client'

import { useState } from 'react'
import { toast } from 'sonner'

const DEMO_IDEA = 'I want to build a travel app with no budget and quit my bank job in New York'
const DEMO_ROAST = `Travel apps need differentiation, and you're building one with no budget. Brilliant. Quitting a cushy bank job in New York — where your salary alone probably covers 12 months of burn rate — to pursue this? The market is dominated by Google, Booking.com, and Airbnb, all of whom have lost billions solving exactly what you think you'll crack on a shoestring. Your CAC will be astronomical, your retention non-existent, and your "no budget" strategy will run out before you can say "series A." The only thing thinner than your runway is your business plan. Hard pass.`

const SHARE_URL = 'https://roastmepal.com'
const SHARE_TEXT = `My travel app idea just got destroyed by 💰 Brutal VC on RoastMePal 💀 "${DEMO_IDEA}"`

export default function DemoRoast() {
  const [expanded, setExpanded] = useState(true)
  const [roastExpanded, setRoastExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link.')
    }
  }

  const handleX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleInstagram = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_TEXT + ' ' + SHARE_URL)
      toast.success('Copied! Paste in your Instagram caption 📸')
    } catch {
      toast.error('Could not copy.')
    }
    setTimeout(() => {
      window.location.href = 'instagram://'
    }, 800)
  }

  if (!expanded) {
    return (
      <div className="w-full max-w-2xl mb-2 sm:mb-6">
        <button
          onClick={() => setExpanded(true)}
          className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5"
        >
          🔥 See an example roast
          <span className="text-brand-green">→</span>
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mb-6 sm:mb-10">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">Example roast</p>
        <button
          onClick={() => setExpanded(false)}
          className="text-xs text-muted-foreground hover:text-white transition-colors"
        >
          Hide
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed italic">
          &ldquo;{DEMO_IDEA}&rdquo;
        </p>

        <div className="flex items-center gap-1.5">
          <span className="text-sm">💰</span>
          <span className="text-xs font-medium text-muted-foreground">Brutal VC</span>
        </div>

        <div>
          <p className={`text-muted-foreground text-xs leading-relaxed ${!roastExpanded ? 'line-clamp-2' : ''}`}>
            {DEMO_ROAST}
          </p>
          {!roastExpanded && (
            <button
              onClick={() => setRoastExpanded(true)}
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground mt-1 transition-colors"
            >
              Read more →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
