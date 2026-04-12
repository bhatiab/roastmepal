# Project — CLAUDE.md

## Project Rules (Always Follow)

- Use relative imports in `app/` directory — never `@/` aliases
- Lucide icons cannot cross server/client boundaries — always use `_client.tsx` co-located pattern
- Never use `<form>` tags — use `onClick` / `onChange` handlers only
- Never create separate CSS or JS files — keep everything in single component files
- Always use Tailwind for styling — no inline style objects unless animation requires it
- Mobile first — every component must work on phone

---

## Tech Stack

- Next.js 15 App Router
- Tailwind CSS + shadcn-ui
- TypeScript (loose mode)
- Supabase (auth + database)
- Stripe (payments)
- Anthropic Claude API (AI features)
- Resend (email)
- PostHog (analytics)
- Vercel (deploy target)

---

## Design Tokens

```ts
background:   #0A0A0F
card:         #13131A
border:       #1F1F2E
green:        #00FF88   // primary accent
amber:        #F59E0B   // warnings
red:          #EF4444   // errors
text:         #FFFFFF
muted:        #6B7280
```

## Fonts
- Headlines: `DM Serif Display`
- Data/scores: `DM Mono`
- Body: `Outfit`

---

## File Structure

```
app/
  layout.tsx         # Root passthrough layout
  page.tsx           # Landing page (server component)
  _client.tsx        # Client-side landing component

src/
  index.css          # Global styles + design tokens
  lib/utils.ts       # cn() helper
  components/
    Navbar.tsx
    Footer.tsx
    ui/              # shadcn-ui components
```

---

## Environment Variables
```
NEXT_PUBLIC_APP_URL=
GOOGLE_PLACES_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

---

## Never Do
- Never hardcode API keys
- Never use `<form>` tags
- Never use `@/` imports in `app/` directory
- Never pass Lucide components across server/client boundary
- Never show raw API errors to user — always show friendly fallback
