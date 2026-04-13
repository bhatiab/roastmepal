'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface ShareButtonProps {
  roastId: string
  ideaTitle: string
  personaName: string
  personaEmoji: string
  headline: string
}

const PARTNER_DOMAINS = ['scorevet.com', 'fairwaypal.com', 'grandprixpal.com', 'gpmotopal.com']

export default function ShareButton({
  roastId,
  ideaTitle,
  personaName,
  personaEmoji,
  headline,
}: ShareButtonProps) {
  const [certStyle, setCertStyle] = useState<'failure' | 'rejection'>('failure')
  const [certTheme, setCertTheme] = useState<'dark' | 'light'>('dark')
  const [canShare, setCanShare] = useState(false)

  // Cert preview state
  const [showCert, setShowCert] = useState(false)
  const [certLoading, setCertLoading] = useState(false)
  const [certError, setCertError] = useState(false)

  // Meme preview state
  const [showMeme, setShowMeme] = useState(false)
  const [memeLoading, setMemeLoading] = useState(false)
  const [memeError, setMemeError] = useState(false)

  const [domain] = useState(
    () => PARTNER_DOMAINS[Math.floor(Math.random() * PARTNER_DOMAINS.length)]
  )

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  // Trigger cert loading when preview opens — decoupled to avoid batching race
  useEffect(() => {
    if (showCert) {
      setCertLoading(true)
      setCertError(false)
    }
  }, [showCert])

  // Trigger meme loading when preview opens — decoupled to avoid batching race
  useEffect(() => {
    if (showMeme) {
      setMemeLoading(true)
      setMemeError(false)
    }
  }, [showMeme])

  // Reset cert preview when style/theme changes so it reloads
  useEffect(() => {
    if (showCert) {
      setCertLoading(true)
      setCertError(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certStyle, certTheme])

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://roastmepal.com'
  const shareUrl = `${appUrl}/roast/${roastId}`
  const shareText = `My idea just got destroyed by ${personaEmoji} ${personaName} on RoastMePal 💀 "${ideaTitle}"`

  const excerpt = headline.slice(0, 160)
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
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank', 'noopener,noreferrer'
    )
  }

  const handleLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank', 'noopener,noreferrer'
    )
  }

  const handleWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      '_blank', 'noopener,noreferrer'
    )
  }

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank', 'noopener,noreferrer'
    )
  }

  const handleReddit = () => {
    window.open(
      `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
      '_blank', 'noopener,noreferrer'
    )
  }

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: shareText, url: shareUrl })
    } catch {
      // User cancelled — silent
    }
  }

  const domainLink = (
    <p className="text-xs text-muted-foreground/70 mt-2">
      Powered by{' '}
      <a
        href={`https://${domain}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-green/70 hover:text-brand-green hover:underline transition-colors"
      >
        {domain}
      </a>
    </p>
  )

  return (
    <div className="mt-4 pt-4 border-t border-border space-y-4">
      {/* Certificate + Meme — side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Certificate card */}
        <div className="rounded-lg border border-border bg-card p-3 space-y-2.5">
          <div>
            <p className="eyebrow mb-0.5">🏅 Certificate</p>
            <p className="text-xs text-muted-foreground">
              Official proof your idea was destroyed.
            </p>
          </div>

          {/* Style toggles */}
          <div className="flex gap-1.5 flex-wrap">
            {(['failure', 'rejection'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setCertStyle(s)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  certStyle === s
                    ? 'border-brand-green text-brand-green bg-brand-green/10'
                    : 'border-border text-muted-foreground hover:border-white/30 hover:text-white'
                }`}
              >
                {s === 'failure' ? 'Failure' : 'VC Rejection'}
              </button>
            ))}
          </div>

          {/* Theme toggles */}
          <div className="flex gap-1.5">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setCertTheme(t)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  certTheme === t
                    ? 'border-brand-green text-brand-green bg-brand-green/10'
                    : 'border-border text-muted-foreground hover:border-white/30 hover:text-white'
                }`}
              >
                {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            ))}
          </div>

          {/* Preview toggle */}
          <button
            onClick={() => setShowCert((v) => !v)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all w-full ${
              showCert
                ? 'border-brand-green text-brand-green bg-brand-green/10'
                : 'border-border text-muted-foreground hover:border-white/30 hover:text-white'
            }`}
          >
            {showCert ? 'Hide Preview' : 'Preview'}
          </button>

          {/* Cert preview image */}
          {showCert && (
            <div className="space-y-1.5">
              {certLoading && !certError && (
                <div className="w-full aspect-square rounded-lg border border-border bg-white/5 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground animate-pulse">Loading...</span>
                </div>
              )}
              {certError && (
                <div className="w-full aspect-square rounded-lg border border-red-900/40 bg-red-950/20 flex items-center justify-center">
                  <span className="text-xs text-red-400">Failed to load. Try again.</span>
                </div>
              )}
              <img
                key={certUrl}
                src={certUrl}
                alt="Roast certificate"
                className={`w-full rounded-lg border border-white/20 ${certLoading || certError ? 'hidden' : ''}`}
                onLoad={() => setCertLoading(false)}
                onError={() => { setCertLoading(false); setCertError(true) }}
              />
            </div>
          )}

          <a
            href={certUrl}
            download="roast-certificate.png"
            className="btn-primary text-xs w-full justify-center flex py-2"
          >
            ⬇ Download
          </a>

          {/* Share cert */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer')}
              className="btn-ghost text-xs flex items-center gap-1 px-2.5 py-1"
            >
              <span>𝕏</span> Post
            </button>
            <button
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer')}
              className="btn-ghost text-xs flex items-center gap-1 px-2.5 py-1"
            >
              <span className="font-bold text-[10px]">in</span> LinkedIn
            </button>
            <button
              onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank', 'noopener,noreferrer')}
              className="btn-ghost text-xs flex items-center gap-1 px-2.5 py-1"
            >
              <span>💬</span> WhatsApp
            </button>
          </div>

          {domainLink}
        </div>

        {/* Meme card */}
        <div className="rounded-lg border border-border bg-card p-3 space-y-2.5">
          <div>
            <p className="eyebrow mb-0.5">🎭 Roast Meme</p>
            <p className="text-xs text-muted-foreground">
              Shareable 1080×1080 for social media.
            </p>
          </div>

          {/* Spacer to align preview button with cert card */}
          <div className="h-[52px]" />

          {/* Preview toggle */}
          <button
            onClick={() => setShowMeme((v) => !v)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all w-full ${
              showMeme
                ? 'border-brand-green text-brand-green bg-brand-green/10'
                : 'border-border text-muted-foreground hover:border-white/30 hover:text-white'
            }`}
          >
            {showMeme ? 'Hide Preview' : 'Preview'}
          </button>

          {/* Meme preview image */}
          {showMeme && (
            <div className="space-y-1.5">
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
                key={memeUrl}
                src={memeUrl}
                alt="Roast meme"
                className={`w-full rounded-lg border border-border ${memeLoading || memeError ? 'hidden' : ''}`}
                onLoad={() => setMemeLoading(false)}
                onError={() => { setMemeLoading(false); setMemeError(true) }}
              />
            </div>
          )}

          <a
            href={memeUrl}
            download="roast-meme.png"
            className="btn-primary text-xs w-full justify-center flex py-2"
          >
            ⬇ Download
          </a>

          {/* Share meme */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(memeUrl)}`, '_blank', 'noopener,noreferrer')}
              className="btn-ghost text-xs flex items-center gap-1 px-2.5 py-1"
            >
              <span>𝕏</span> Post
            </button>
            <button
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer')}
              className="btn-ghost text-xs flex items-center gap-1 px-2.5 py-1"
            >
              <span className="font-bold text-[10px]">in</span> LinkedIn
            </button>
            <button
              onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank', 'noopener,noreferrer')}
              className="btn-ghost text-xs flex items-center gap-1 px-2.5 py-1"
            >
              <span>💬</span> WhatsApp
            </button>
          </div>

          {domainLink}
        </div>
      </div>

      {/* Platform share */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleCopy}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span>🔗</span> Copy
        </button>
        <button
          onClick={handleTwitter}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span>𝕏</span> Twitter
        </button>
        <button
          onClick={handleLinkedIn}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span className="font-bold text-[11px]">in</span> LinkedIn
        </button>
        <button
          onClick={handleWhatsApp}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span>💬</span> WhatsApp
        </button>
        <button
          onClick={handleFacebook}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span style={{ fontWeight: 700 }}>f</span> Facebook
        </button>
        <button
          onClick={handleReddit}
          className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
        >
          <span>🟠</span> Reddit
        </button>
        {canShare && (
          <button
            onClick={handleNativeShare}
            className="btn-ghost text-sm flex items-center gap-1.5 px-3 py-2"
          >
            <span>↗</span> Share
          </button>
        )}
      </div>
    </div>
  )
}
