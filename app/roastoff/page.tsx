import type { Metadata } from 'next'
import RoastoffClient from './_client'

export const metadata: Metadata = {
  title: 'Roast-off — RoastMePal',
  description: 'Pit two startup ideas against each other. AI picks which one is least likely to ruin your credit score.',
}

export default function RoastoffPage() {
  return <RoastoffClient />
}
