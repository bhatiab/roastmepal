'use client'

import { useState, useEffect } from 'react'

interface RoastDisplayProps {
  roast: {
    content: string
    persona: {
      id: string
      name: string
      emoji: string
    }
  }
  ideaTitle: string
}

export default function RoastDisplay({ roast, ideaTitle }: RoastDisplayProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)
    let index = 0
    const interval = setInterval(() => {
      if (index < roast.content.length) {
        setDisplayedText(roast.content.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, 15)
    return () => clearInterval(interval)
  }, [roast.content])

  return (
    <div className="card-surface w-full max-w-2xl mx-auto animate-fade-up">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{roast.persona.emoji}</span>
        <span className="text-sm font-semibold text-brand-green">
          {roast.persona.name}
        </span>
        <span className="text-xs text-muted-foreground">roasting</span>
        <span className="text-xs font-mono text-white/70 truncate">
          &ldquo;{ideaTitle}&rdquo;
        </span>
      </div>

      <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap font-body">
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-0.5 h-4 bg-brand-green ml-0.5 animate-pulse" />
        )}
      </div>
    </div>
  )
}
