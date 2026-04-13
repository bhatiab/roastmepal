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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${dmSerif.variable} ${outfit.variable} ${dmMono.variable}`}
    >
      <body>
        <PostHogProvider>
          <Toaster richColors position="top-center" />
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
