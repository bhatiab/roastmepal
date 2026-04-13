'use client'

import { useMemo } from 'react'
import { PERSONAS, type PersonaId } from '../lib/personas'

interface PersonaPickerProps {
  selected: PersonaId | null
  onSelect: (id: PersonaId) => void
  isPro: boolean
  onProClick: (personaId: PersonaId) => void
}

export default function PersonaPicker({ selected, onSelect, isPro, onProClick }: PersonaPickerProps) {
  const shuffled = useMemo(() => {
    const arr = [...PERSONAS]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [])

  return (
    <div className="w-full">
      <p className="text-sm text-muted-foreground mb-2 sm:mb-3">Pick your roaster</p>
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-3">
        {shuffled.map((persona) => {
          const isSelected = selected === persona.id
          const locked = persona.isPro && !isPro

          return (
            <button
              key={persona.id}
              onClick={() => locked ? onProClick(persona.id) : onSelect(persona.id)}
              className={`relative flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl border transition-all duration-150 cursor-pointer touch-manipulation
                ${locked
                  ? 'border-border bg-card opacity-60 hover:opacity-80'
                  : isSelected
                    ? 'border-brand-green bg-brand-green/10 shadow-[0_0_12px_rgba(0,255,136,0.15)]'
                    : 'border-border bg-card hover:border-white/20 hover:bg-white/5 active:bg-white/10'
                }`}
            >
              <span className="text-lg sm:text-2xl">{persona.emoji}</span>
              <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${isSelected && !locked ? 'text-brand-green' : 'text-white'}`}>
                {persona.name}
              </span>
              {locked && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 text-[10px] leading-none">🔒</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
