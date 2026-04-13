'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'

interface EmailGateModalProps {
  open: boolean
  sessionToken: string
  onSuccess: () => void
}

export default function EmailGateModal({ open, sessionToken, onSuccess }: EmailGateModalProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    const trimmed = email.trim()
    if (!trimmed) {
      setError('Enter your email to continue.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      setError('Enter a valid email address.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken, email: trimmed }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Something went wrong.')
        return
      }
      onSuccess()
    } catch {
      setError('Network error. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="bg-card border-border max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
        hideCloseButton
      >
        <DialogHeader>
          <div className="text-3xl mb-2">🔥</div>
          <DialogTitle className="font-display text-white text-xl font-light">
            You&apos;re out of free roasts
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Drop your email to keep roasting forever. No spam, no account.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="you@example.com"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-green transition-all"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Unlocking...' : 'Unlock Unlimited Roasts'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
