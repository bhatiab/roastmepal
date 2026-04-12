import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-center px-4">
      <p className="font-mono text-brand-green text-sm uppercase tracking-widest mb-4">404</p>
      <h1 className="font-display text-4xl text-white mb-4">Page Not Found</h1>
      <p className="text-muted-foreground mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  )
}
