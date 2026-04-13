export const metadata = {
  title: 'Privacy Policy — RoastMePal',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <p className="eyebrow mb-3">Legal</p>
        <h1 className="font-display text-4xl font-light text-white mb-8">Privacy Policy</h1>

        <div className="card-surface space-y-6 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h2 className="text-white font-medium mb-2">What we collect</h2>
            <p>
              When you use RoastMePal, we store the startup ideas you submit, the AI-generated roasts,
              and a session token in your browser to track your usage. If you choose to unlock unlimited
              roasts, we store your email address. We do not collect passwords or payment information.
            </p>
          </div>

          <div>
            <h2 className="text-white font-medium mb-2">How we use it</h2>
            <p>
              Your ideas and roasts are stored to power the app and may be used in aggregate, anonymized
              form to improve the product. Your email, if provided, is used solely to identify your session
              and may be used to send you product updates. You can request deletion at any time.
            </p>
          </div>

          <div>
            <h2 className="text-white font-medium mb-2">Third parties</h2>
            <p>
              We use Supabase for database storage, Anthropic for AI generation, and Vercel for hosting.
              None of your personal data is sold to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-white font-medium mb-2">Contact</h2>
            <p>
              Questions? Reach us at{' '}
              <span className="text-brand-green">hello@roastmepal.com</span>
            </p>
          </div>

          <p className="text-xs text-muted-foreground/50">Last updated: April 2026</p>
        </div>
      </div>
    </main>
  )
}
