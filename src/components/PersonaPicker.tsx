'use client'

import { useMemo } from 'react'
import { PERSONAS, type PersonaId } from '../lib/personas'

interface PersonaPickerProps {
  selected: PersonaId | null
  onSelect: (id: PersonaId) => void
}

export default function PersonaPicker({ selected, onSelect }: PersonaPickerProps) {
  const shuffled = useMemo(() => {
    const arr = [...PERSONAS]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [])

  const selectedPersona = selected ? PERSONAS.find((p) => p.id === selected) : null

  return (
    <div className="w-full">
      <p className="text-sm text-muted-foreground mb-1.5 sm:mb-3">Who&apos;s destroying you today?</p>
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-1.5 sm:gap-3">
        {shuffled.map((persona) => {
          const isSelected = selected === persona.id

          return (
            <button
              key={persona.id}
              onClick={() => onSelect(persona.id)}
              className={`relative flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl border transition-all duration-150 cursor-pointer touch-manipulation
                ${isSelected
                  ? 'border-brand-green bg-brand-green/10 shadow-[0_0_12px_rgba(0,255,136,0.15)]'
                  : 'border-border bg-card hover:border-white/20 hover:bg-white/5 active:bg-white/10'
                }`}
            >
              <span className="text-2xl sm:text-2xl leading-none">{persona.emoji}</span>
              <span className={`text-[9px] sm:text-xs font-medium text-center leading-tight ${isSelected ? 'text-brand-green' : 'text-white'}`}>
                {persona.name}
              </span>
              <span className="text-[7px] sm:text-[9px] text-muted-foreground/60 italic text-center leading-none">
                {persona.tagline}
              </span>
            </button>
          )
        })}
      </div>

      {/* Selected persona tagline */}
      {selectedPersona && (
        <p className="mt-2 text-sm text-center text-brand-green/80 italic transition-all">
          {selectedPersona.emoji} {selectedPersona.name} — &ldquo;{selectedPersona.tagline}&rdquo;
        </p>
      )}
    </div>
  )
}
