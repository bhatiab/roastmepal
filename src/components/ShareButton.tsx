'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface ShareButtonProps {
  roastId: string
  ideaTitle: string
  personaName: string
  personaEmoji: string
  roastExcerpt: string
}

const PARTNER_DOMAINS = ['scorevet.com', 'fairwaypal.com', 'grandprixpal.com', 'gpmotopal.com']

export default function ShareButton({
  roastId,
  ideaTitle,
  personaName,
  personaEmoji,
  roastExcerpt,
}: ShareButtonProps) {
  const [certStyle, setCertStyle] = useState<'failure' | 'rejection'>('failure')
  const [certTheme, setCertTheme] = useState<'dark' | 'light'>('dark')
  const [canShare, setCanShare] = useState(false)
  const [showMeme, setShowMeme] = useState(false)
  const [memeLoading, setMemeLoading] = useState(false)
  const [memeError, setMemeError] = useState(false)
  const [domain] = useState(
    () => PARTNER_DOMAINS[Math.floor(Math.random() * PARTNER_DOMAINS.length)]
  )

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://roastmepal.com'
  const shareUrl = `${appUrl}/roast/${roastId}`
  const shareText = `My idea just got destroyed by ${personaEmoji} ${personaName} on RoastMePal 💀 "${ideaTitle}"`

  const excerpt = roastExcerpt.slice(0, 300)
  const certUrl = `/api/certificate?style=${certStyle}&theme=${certTheme}&title=${encodeURIComponent(ideaTitle)}&persona=${encodeURIComponent(personaName)}&emoji=${encodeURIComponent(personaEmoji)}&excerpt=${encodeURIComponent(excerpt)}&id=${roastId}&domain=${encodeURIComponent(domain)}`
  const memeUrl = `/api/meme?title=${encodeURIComponent(ideaTitle)}&persona=${encodeURIComponent(personaName)}&emoji=${encodeURIComponent(personaEmoji)}&excerpt=${encodeURIComponent(excerpt)}&domain=${encodeURIComponent(domain)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied!')
    } catch {
      toast.error('Could not copy link.')
    }
  }

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleReddit = () => {
    const url = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: shareText, url: shareUrl })
    } catch {
      // User cancelled — silent
    }
  }

  const handleShareMeme = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(memeUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleShareMemeWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleShareMemeLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mt-4 pt-4 border-t border-border space-y-4">
      {/* Certificate download */}
      <div className="rounded-lg border border-brand-green/25 bg-brand-green/5 p-3 space-y-2.5">
        <div>
          <p className="eyebrow mb-0.5">Your Failure Certificate</p>
          <p className="text-xs text-muted-foreground">
            Official proof your idea was destroyed. Post it on LinkedIn, send it to your investors, or frame it.
          </p>
        </div>

        {/* Style row */}
        <div className="flex gap-2 flex-wrap">
          {(['failure', 'rejection'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setCertStyle(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                certStyle === s
                  ? 'border-brand-green text-brand-green bg-brand-green/10'
                  : 'border-border text-muted-foreground hover:border-white/30 hover:text-white'
              }`}
            >
              {s === 'failure' ? '🏅 Certificate of Failure' : '📄 VC Rejection Letter'}
            </button>
          ))}
        </div>

        {/* Theme row */}
        <div className="flex gap-2">
          {(['dark', 'light'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setCertTheme(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                certTheme === t
                  ? 'border-brand-green text-brand-green bg-brand-green/10'
                  : 'border-border text-muted-foreground hover:border-white/30 hover:text-white'
              }`}
            >
              {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          ))}
        </div>

        <a
          href={certUrl}
          download="roast-certificate.png"
          className="btn-primary text-sm w-full justify-center flex"
        >
          ⬇ Download Certificate
        </a>
      </div>

      {/* Meme section */}
      <div className="rounded-lg border border-border p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow mb-0.5">Roast Meme</p>
            <p className="text-xs text-muted-foreground">Shareable 1080×1080 image for social media.</p>
          </div>
          <button
            onClick={() => {
              setShowMeme((v) => {
                if (!v) { setMemeLoading(true); setMemeError(false) }
                return !v
              })
            }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all shrink-0 ${
              showMeme
                ? 'border-brand-green text-brand-green bg-brand-green/10'
                : 'border-border text-muted-foreground hover:border-white/30 hover:text-white'
            }`}
          >
            {showMeme ? 'Hide' : '🎭 Preview Meme'}
          </button>
        </div>

        {showMeme && (
          <div className="space-y-3">
            {/* Inline meme preview */}
            {memeLoading && !memeError && (
              <div className="w-full aspect-square rounded-lg border border-border bg-white/5 flex items-center justify-center">
                <span className="text-xs text-muted-foreground animate-pulse">Generating meme...</span>
              </div>
            )}
            {memeError && (
              <div className="w-full aspect-square rounded-lg border border-red-900/40 bg-red-950/20 flex items-center justify-center">
                <span className="text-xs text-red-400">Failed to generate meme. Try again.</span>
              </div>
            )}
            <img
              src={memeUrl}
              alt="Roast meme"
              className={`w-full rounded-lg border border-border ${memeLoading || memeError ? 'hidden' : ''}`}
              onLoad={() => setMemeLoading(false)}
              onError={() => { setMemeLoading(false); setMemeError(true) }}
            />

            {/* Share meme buttons */}
            <div className="flex gap-2 flex-wrap">
              <a
                href={memeUrl}
                download="roast-meme.png"
                className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                ⬇ Download
              </a>
              <button
                onClick={handleShareMeme}
                className="btn-ghost text-xs flex items-center gap-1.5 px-3 py-1.5"
              >
                <span>𝕏</span>
                Post
              </button>
              <button
                onClick={handleShareMemeWhatsApp}
                className="btn-ghost text-xs flex items-center gap-1.5 px-3 py-1.5"
              >
                <span>💬</span>
                WhatsApp
              </button>
              <button
                onClick={handleShareMemeLinkedIn}
                className="btn-ghost text-xs flex items-center gap-1.5 px-3 py-1.5"
              >
                <span className="font-bold text-[10px]">in</span>
                LinkedIn
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Platform share */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleCopy}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span>🔗</span>
          Copy
        </button>
        <button
          onClick={handleTwitter}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span>𝕏</span>
          Twitter
        </button>
        <button
          onClick={handleLinkedIn}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span className="font-bold text-[11px]">in</span>
          LinkedIn
        </button>
        <button
          onClick={handleWhatsApp}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span>💬</span>
          WhatsApp
        </button>
        <button
          onClick={handleFacebook}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span style={{ fontWeight: 700 }}>f</span>
          Facebook
        </button>
        <button
          onClick={handleReddit}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span>🟠</span>
          Reddit
        </button>
        {canShare && (
          <button
            onClick={handleNativeShare}
            className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
          >
            <span>↗</span>
            Share
          </button>
        )}
      </div>
    </div>
  )
}
