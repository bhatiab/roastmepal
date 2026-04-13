'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'

interface ExitIntentModalProps {
  open: boolean
  onClose: () => void
  onRoastAgain: () => void
}

export default function ExitIntentModal({ open, onClose, onRoastAgain }: ExitIntentModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <div className="text-4xl mb-2">🧯</div>
          <DialogTitle className="font-display text-white text-xl font-light">
            Wait — don&apos;t waste your savings.
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Your idea might be a disaster, but your execution doesn&apos;t have to be.
            Roast another idea before you build anything.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          <button
            onClick={() => { onRoastAgain(); onClose() }}
            className="btn-primary w-full"
          >
            Roast another idea — it&apos;s free
          </button>
          <button
            onClick={onClose}
            className="w-full text-sm text-muted-foreground hover:text-white transition-colors py-2"
          >
            No thanks, I&apos;m confident in my failures
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
