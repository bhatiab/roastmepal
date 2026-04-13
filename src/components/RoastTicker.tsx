'use client'

import { useState, useEffect } from 'react'

interface TickerItem {
  id: string
  personaEmoji: string
  personaName: string
  ideaTitle: string
}

export default function RoastTicker() {
  const [items, setItems] = useState<TickerItem[]>([])

  useEffect(() => {
    fetch('/api/recent-roasts')
      .then((r) => r.json())
      .then((d) => { if (d.items?.length) setItems(d.items) })
      .catch(() => {})
  }, [])

  if (!items.length) return null

  // Duplicate for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className="w-full overflow-hidden mb-2 sm:mb-4">
      <div className="flex animate-ticker whitespace-nowrap gap-0">
        {doubled.map((item, i) => (
          <span key={`${item.id}-${i}`} className="inline-flex items-center gap-1 text-xs text-muted-foreground/70 mr-8 shrink-0">
            <span>{item.personaEmoji}</span>
            <span className="text-white/50">{item.personaName}</span>
            <span>destroyed</span>
            <span className="text-white/70 italic max-w-[140px] truncate inline-block align-bottom">
              &ldquo;{item.ideaTitle}&rdquo;
            </span>
            <span className="text-muted-foreground/30 mx-2">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
