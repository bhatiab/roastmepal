'use client'

import { useState, useTransition } from 'react'
import { loginAction } from '../actions'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  const handleLogin = () => {
    setError('')
    startTransition(async () => {
      const result = await loginAction(password)
      if (result && 'error' in result) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">🔥</span>
          <h1 className="font-display text-2xl font-light text-white mt-3">Admin</h1>
          <p className="text-muted-foreground text-sm mt-1">RoastMePal dashboard</p>
        </div>

        <div className="card-surface space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              autoFocus
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-green transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={pending || !password}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
