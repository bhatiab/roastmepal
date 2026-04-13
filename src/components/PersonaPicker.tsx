'use client'

import { useMemo } from 'react'
import { PERSONAS, type PersonaId } from '../lib/personas'

interface PersonaPickerProps {
  selected: PersonaId | null
  onSelect: (id: PersonaId) => void
  isPro: boolean
  onProClick: (personaId: PersonaId) => void
}

const HIDDEN_PERSONAS = new Set(['flirty', 'gordon', 'chaos'])

export default function PersonaPicker({ selected, onSelect, isPro, onProClick }: PersonaPickerProps) {
  const { shuffled, lockedIds } = useMemo(() => {
    const arr = PERSONAS.filter((p) => !HIDDEN_PERSONAS.has(p.id))
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    // Randomly pick 4 to lock for this session
    const locked = new Set(arr.slice(0, 4).map((p) => p.id))
    return { shuffled: arr, lockedIds: locked }
  }, [])

  const selectedPersona = selected ? PERSONAS.find((p) => p.id === selected) : null

  return (
    <div className="w-full">
      <p className="text-sm text-muted-foreground mb-1.5 sm:mb-3">Who&apos;s destroying you today?</p>
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-1.5 sm:gap-3">
        {shuffled.map((persona) => {
          const isSelected = selected === persona.id
          const locked = !isPro && lockedIds.has(persona.id)

          return (
            <button
              key={persona.id}
              onClick={() => locked ? onProClick(persona.id) : onSelect(persona.id)}
              className={`relative flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl border transition-all duration-150 cursor-pointer touch-manipulation
                ${locked
                  ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/50'
                  : isSelected
                    ? 'border-brand-green bg-brand-green/10 shadow-[0_0_12px_rgba(0,255,136,0.15)]'
                    : 'border-border bg-card hover:border-white/20 hover:bg-white/5 active:bg-white/10'
                }`}
            >
              <span className="text-2xl sm:text-2xl leading-none">{persona.emoji}</span>
              <span className={`text-[9px] sm:text-xs font-medium text-center leading-tight ${isSelected && !locked ? 'text-brand-green' : locked ? 'text-amber-400/70' : 'text-white'}`}>
                {persona.name}
              </span>
              <span className="text-[7px] sm:text-[9px] text-muted-foreground/60 italic text-center leading-none">
                {persona.tagline}
              </span>
              {locked && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-[9px] leading-none">🔒</span>
              )}
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
