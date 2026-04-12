'use client'

export default function Footer() {
  return (
    <footer className="border-t border-border py-6 px-4">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} RoastMePal. All roasts fictional.</p>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="/terms" className="hover:text-white transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
