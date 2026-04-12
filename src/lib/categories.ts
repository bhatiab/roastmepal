export const CATEGORIES = [
  'SaaS',
  'Food & Bev',
  'Marketplace',
  'Hardware',
  'Consumer App',
  'Fintech',
  'Health',
  'Education',
  'Real Estate',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]
