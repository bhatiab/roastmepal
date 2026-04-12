# Next.js SaaS Template

Bare-bones Next.js 15 + Tailwind + shadcn-ui starter with dark neon design tokens and common SaaS integrations pre-wired.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + shadcn-ui
- **Language:** TypeScript (loose mode)
- **Auth/DB:** Supabase
- **Payments:** Stripe
- **AI:** Anthropic Claude API
- **Email:** Resend
- **Analytics:** PostHog + Vercel Analytics
- **Testing:** Vitest + Testing Library
- **CI:** GitHub Actions

## Quick Start

```bash
# 1. Clone and install
npm install

# 2. Set up env
cp .env.example .env.local
# Fill in keys in .env.local

# 3. Init shadcn components
npx shadcn@latest init
npx shadcn@latest add button card badge input dialog sheet select tabs separator

# 4. Run dev server
npm run dev
```

## Design Tokens

| Token | Value | Use |
|---|---|---|
| Background | `#0A0A0F` | Page background |
| Card | `#13131A` | Card surfaces |
| Border | `#1F1F2E` | Borders |
| Green | `#00FF88` | Primary CTA, success |
| Amber | `#F59E0B` | Warnings |
| Red | `#EF4444` | Errors |

Fonts: **DM Serif Display** (headlines) · **DM Mono** (data) · **Outfit** (body)

## Project Rules

- Relative imports in `app/` — never `@/` aliases
- Lucide icons → always use `_client.tsx` co-located pattern
- No `<form>` tags — use `onClick`/`onChange` handlers
- No separate CSS/JS files — single component files
- All styling via Tailwind — no inline style objects (unless animation)
- Mobile-first

## Commands

```bash
npm run dev        # Dev server
npm run build      # Production build
npm run test       # Run tests
npm run lint       # ESLint
npm run typecheck  # TypeScript check
```
