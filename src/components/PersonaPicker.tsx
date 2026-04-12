'use client'

import { PERSONAS, type PersonaId } from '../lib/personas'

interface PersonaPickerProps {
  selected: PersonaId | null
  onSelect: (id: PersonaId) => void
}

export default function PersonaPicker({ selected, onSelect }: PersonaPickerProps) {
  return (
    <div className="w-full">
      <p className="text-sm text-muted-foreground mb-3">Pick your roaster</p>
      <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
        {PERSONAS.map((persona) => {
          const isSelected = selected === persona.id
          return (
            <button
              key={persona.id}
              onClick={() => onSelect(persona.id)}
              className={`flex-shrink-0 snap-center flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-150 cursor-pointer w-[100px]
                ${
                  isSelected
                    ? 'border-brand-green bg-brand-green/10 shadow-[0_0_12px_rgba(0,255,136,0.15)]'
                    : 'border-border bg-card hover:border-white/20 hover:bg-white/5'
                }`}
            >
              <span className="text-2xl">{persona.emoji}</span>
              <span className={`text-xs font-medium text-center leading-tight ${isSelected ? 'text-brand-green' : 'text-white'}`}>
                {persona.name}
              </span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">
                {persona.tagline}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
