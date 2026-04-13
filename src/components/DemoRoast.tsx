'use client'

import { useState } from 'react'
import { toast } from 'sonner'

const DEMO_IDEA = 'I want to build a travel app with no budget and quit my bank job in New York'
const DEMO_ROAST = `Travel apps need differentiation, and you're building one with no budget. Brilliant. Quitting a cushy bank job in New York — where your salary alone probably covers 12 months of burn rate — to pursue this? The market is dominated by Google, Booking.com, and Airbnb, all of whom have lost billions solving exactly what you think you'll crack on a shoestring. Your CAC will be astronomical, your retention non-existent, and your "no budget" strategy will run out before you can say "series A." The only thing thinner than your runway is your business plan. Hard pass.`

const SHARE_URL = 'https://roastmepal.com'
const SHARE_TEXT = `My travel app idea just got destroyed by 💰 Brutal VC on RoastMePal 💀 "${DEMO_IDEA}"`

export default function DemoRoast() {
  const [expanded, setExpanded] = useState(true)
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
      <div className="flex items-center justify-between mb-3">
        <p className="eyebrow">🔥 Example Roast</p>
        <button
          onClick={() => setExpanded(false)}
          className="text-xs text-muted-foreground hover:text-white transition-colors"
        >
          Hide
        </button>
      </div>

      <div className="card-surface space-y-4">
        {/* Input shown */}
        <div className="flex items-start gap-2.5">
          <span className="text-xs text-muted-foreground shrink-0 mt-0.5">Submitted:</span>
          <span className="text-xs text-white/80 font-mono leading-relaxed">
            &ldquo;{DEMO_IDEA}&rdquo;
          </span>
        </div>

        {/* Persona badge */}
        <div className="flex items-center gap-2">
          <span className="text-base">💰</span>
          <span className="text-xs font-semibold text-brand-green">Brutal VC</span>
          <span className="text-xs text-muted-foreground">roasting this plan</span>
        </div>

        {/* Roast text */}
        <p className="text-white/85 text-sm leading-relaxed">
          {DEMO_ROAST}
        </p>

        {/* Divider */}
        <div className="border-t border-border pt-4 space-y-3">
          {/* Share buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Share this roast:</span>
            <button
              onClick={handleX}
              className="btn-ghost text-xs flex items-center gap-1.5 px-3 py-1.5"
            >
              <span>𝕏</span>
              Post
            </button>
            <button
              onClick={handleLinkedIn}
              className="btn-ghost text-xs flex items-center gap-1.5 px-3 py-1.5"
            >
              <span className="font-bold text-[11px]">in</span>
              LinkedIn
            </button>
            <button
              onClick={handleCopy}
              className="btn-ghost text-xs flex items-center gap-1.5 px-3 py-1.5"
            >
              <span>{copied ? '✓' : '🔗'}</span>
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <button
              onClick={handleInstagram}
              className="btn-ghost text-xs flex items-center gap-1.5 px-3 py-1.5"
            >
              📸 Instagram
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
