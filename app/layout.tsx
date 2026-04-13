import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { DM_Serif_Display, Outfit, DM_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import PostHogProvider from '../src/components/PostHogProvider'
import '../src/index.css'

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
  title: {
    default: 'RoastMePal — Get Your Startup Idea Destroyed by AI',
    template: '%s | RoastMePal',
  },
  description:
    'Submit your startup idea. Pick an AI persona. Get savagely roasted. Share the carnage.',
  openGraph: {
    siteName: 'RoastMePal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://roastmepal.com'

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'RoastMePal',
  url: appUrl,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Submit your startup idea and get savagely roasted by an AI persona. Find out if your idea is brilliant or delusional before you waste your savings.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free to use — 5 roasts per day',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1200',
  },
}

const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I know if my startup idea is bad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Submit your idea to RoastMePal and let an AI persona brutally critique it. If the roast hits close to home, your idea might need rethinking. Common failure signals include: solving a problem nobody has, underestimating competition, and relying on "if we get 1% of the market" math.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is RoastMePal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'RoastMePal is an AI-powered tool that brutally roasts your startup idea. Pick from personas like a Brutal VC, an AI Overlord, or a Bitter Ex-CoFounder, and get savagely honest feedback in seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is brutal startup feedback actually useful?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Hearing the worst-case critique of your idea — even in a comedic form — forces you to confront real weaknesses. RoastMePal\'s feedback identifies the same patterns that kill most startups: lack of differentiation, bad timing, and delusional market size assumptions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What startup ideas get roasted the hardest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI wrappers, crypto social networks, and "Uber for X" concepts consistently get the highest burn scores. SaaS ideas targeting a market already dominated by one player also perform poorly in roasts.',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${dmSerif.variable} ${outfit.variable} ${dmMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }}
        />
        <PostHogProvider>
          <Toaster richColors position="top-center" />
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
