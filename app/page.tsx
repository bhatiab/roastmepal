import type { Metadata } from 'next'
import { HomeClient } from './_client'

export const metadata: Metadata = {
  title: 'RoastMePal — Get Your Startup Idea Destroyed by AI',
  description:
    'Submit your startup idea. Pick an AI persona. Get savagely roasted. Share the carnage with friends.',
}

export default function Home() {
  return <HomeClient />
}
