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

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://roastmepal.com'
  const shareUrl = `${appUrl}/roast/${roastId}`
  const shareText = `My startup idea just got destroyed by ${personaEmoji} ${personaName} on RoastMePal 💀 "${ideaTitle}"`

  const excerpt = roastExcerpt.slice(0, 160)
  const certUrl = `/api/certificate?style=${certStyle}&theme=${certTheme}&title=${encodeURIComponent(ideaTitle)}&persona=${encodeURIComponent(personaName)}&emoji=${encodeURIComponent(personaEmoji)}&excerpt=${encodeURIComponent(excerpt)}&id=${roastId}`

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

  return (
    <div className="mt-4 pt-4 border-t border-border space-y-4">
      {/* Certificate download */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Download certificate</p>

        {/* Style row */}
        <div className="flex gap-2 flex-wrap">
          {(['failure', 'rejection'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setCertStyle(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                certStyle === s
                  ? 'border-brand-green text-brand-green'
                  : 'border-border text-muted-foreground hover:border-white/30 hover:text-white'
              }`}
            >
              {s === 'failure' ? 'Certificate of Failure' : 'VC Rejection Letter'}
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
                  ? 'border-brand-green text-brand-green'
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
          className="btn-ghost text-sm w-full justify-center"
        >
          ⬇ Download Certificate
        </a>
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
