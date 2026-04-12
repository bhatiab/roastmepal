'use client'

import Link from 'next/link'
import { Flame } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2 text-white font-display text-lg">
          <Flame className="w-5 h-5 text-brand-green" />
          <span>RoastMePal</span>
        </Link>

        <a href="#roast" className="btn-ghost text-sm">
          Roast an Idea
        </a>
      </div>
    </nav>
  )
}
