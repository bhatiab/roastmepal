'use client'

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-4 text-sm text-muted-foreground">
        <p className="text-center text-white/40 text-xs">
          No startups were harmed in the making of these roasts.<br />
          <span className="text-white/25">(Several egos were.)</span>
        </p>
        <div className="flex items-center gap-5">
          <a href="https://x.com/roastmepal" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-xs">
            𝕏 Twitter
          </a>
          <a href="/privacy" className="hover:text-white transition-colors text-xs">Privacy</a>
          <a href="/terms" className="hover:text-white transition-colors text-xs">Terms</a>
        </div>
        <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} RoastMePal</p>
      </div>
    </footer>
  )
}
