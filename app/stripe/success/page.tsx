'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function StripeSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    toast.success("You're Pro! All personas unlocked. 🔥", { duration: 5000 })
    const t = setTimeout(() => router.push('/'), 1800)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <span className="text-6xl">🎉</span>
      <h1 className="font-display text-3xl font-light text-white">Welcome to Pro!</h1>
      <p className="text-muted-foreground text-sm">Redirecting you back…</p>
    </div>
  )
}
