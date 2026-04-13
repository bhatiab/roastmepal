'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

type CertStyle = 'delusion' | 'burn' | 'death' | 'pivot' | 'failure' | 'rejection' | 'meme'

interface ShareButtonProps {
  roastId: string
  ideaTitle: string
  personaName: string
  personaEmoji: string
  headline: string
  content?: string
}

const STYLES: { id: CertStyle; label: string }[] = [
  { id: 'delusion',   label: '🏆 Delusion' },
  { id: 'burn',       label: '💰 Burn Rate' },
  { id: 'death',      label: '💀 Death Cert' },
  { id: 'pivot',      label: '🚨 Pivot' },
  { id: 'failure',    label: '🎓 Diploma' },
  { id: 'rejection',  label: '📨 VC Letter' },
  { id: 'meme',       label: '🎭 Meme' },
]

export default function ShareButton({
  roastId,
  ideaTitle,
  personaName,
  personaEmoji,
  headline,
  content,
}: ShareButtonProps) {
  const [selectedStyle, setSelectedStyle] = useState<CertStyle>('delusion')
  const [imgLoading, setImgLoading] = useState(true)
  const [imgError, setImgError] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [founderName, setFounderName] = useState('')
  const [debouncedFounder, setDebouncedFounder] = useState('')

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedFounder(founderName.trim())
      if (founderName.trim()) {
        setImgLoading(true)
        setImgError(false)
      }
    }, 600)
    return () => clearTimeout(t)
  }, [founderName])

  const excerpt = (content || headline).slice(0, 300)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://roastmepal.com'
  const domain = appUrl.replace(/^https?:\/\//, '')
  const shareUrl = `${appUrl}/roast/${roastId}`
  const shareText = `My idea just got destroyed by ${personaEmoji} ${personaName} on RoastMePal 💀 "${ideaTitle}"`

  const certParams = new URLSearchParams({
    title: ideaTitle,
    persona: personaName,
    emoji: personaEmoji,
    excerpt,
    id: roastId,
    domain,
    ...(debouncedFounder ? { founder: debouncedFounder } : {}),
  }).toString()

  const memeParams = new URLSearchParams({
    title: ideaTitle,
    persona: personaName,
    emoji: personaEmoji,
    excerpt: excerpt.slice(0, 120),
    domain,
    ...(debouncedFounder ? { founder: debouncedFounder } : {}),
  }).toString()

  const imageUrl = selectedStyle === 'meme'
    ? `/api/meme?${memeParams}`
    : `/api/certificate?style=${selectedStyle}&${certParams}`

  const isMeme = selectedStyle === 'meme'

  const handleStyleChange = (s: CertStyle) => {
    setSelectedStyle(s)
    setImgLoading(true)
    setImgError(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied!')
    } catch {
      toast.error('Could not copy link.')
    }
  }

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: shareText, url: shareUrl })
    } catch {
      // User cancelled — silent
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-border space-y-3">
      {/* Founder name input */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Your name (optional — personalises the certificate)</label>
        <input
          type="text"
          value={founderName}
          onChange={(e) => setFounderName(e.target.value)}
          placeholder="e.g. Alex Johnson"
          maxLength={50}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-green transition-all"
        />
      </div>

      {/* Style picker */}
      <div className="flex gap-1.5 flex-wrap">
        {STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => handleStyleChange(s.id)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
              selectedStyle === s.id
                ? 'border-brand-green text-brand-green bg-brand-green/10'
                : 'border-border text-muted-foreground hover:border-white/30 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Image preview — always visible */}
      <div className="relative">
        {imgLoading && !imgError && (
          <div className={`w-full rounded-lg bg-white/5 animate-pulse ${isMeme ? 'aspect-square' : 'aspect-[1200/630]'}`} />
        )}
        {imgError && (
          <div className={`w-full rounded-lg border border-red-900/40 bg-red-950/20 flex items-center justify-center ${isMeme ? 'aspect-square' : 'aspect-[1200/630]'}`}>
            <span className="text-xs text-red-400">Failed to load. Try again.</span>
          </div>
        )}
        <img
          key={imageUrl}
          src={imageUrl}
          alt="Your roast shareable"
          className={`w-full rounded-lg border border-white/20 ${imgLoading || imgError ? 'hidden' : ''}`}
          onLoad={() => setImgLoading(false)}
          onError={() => { setImgLoading(false); setImgError(true) }}
        />
      </div>

      {/* Primary actions */}
      <div className="flex gap-2 flex-wrap items-center">
        <a
          href={imageUrl}
          download={`roastmepal-${selectedStyle}-${roastId}.png`}
          className="btn-primary text-sm flex items-center gap-1.5 px-3 py-2"
        >
          ⬇ Download
        </a>
        <button
          onClick={() => window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            '_blank', 'noopener,noreferrer'
          )}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span>𝕏</span> Post
        </button>
        <button
          onClick={() => window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            '_blank', 'noopener,noreferrer'
          )}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span className="font-bold text-[11px]">in</span> LinkedIn
        </button>
        <button
          onClick={() => window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
            '_blank', 'noopener,noreferrer'
          )}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          💬 WhatsApp
        </button>
      </div>

      {/* Secondary actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleCopy}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          🔗 Copy link
        </button>
        <button
          onClick={() => window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank', 'noopener,noreferrer'
          )}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span style={{ fontWeight: 700 }}>f</span> Facebook
        </button>
        <button
          onClick={() => window.open(
            `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
            '_blank', 'noopener,noreferrer'
          )}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          🟠 Reddit
        </button>
        {canShare && (
          <button
            onClick={handleNativeShare}
            className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
          >
            ↗ Share
          </button>
        )}
      </div>
    </div>
  )
}
