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

export interface CategoryMeta {
  label: Category
  slug: string
  emoji: string
  survivalRate: string
  tagline: string
  why: string[]
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    label: 'SaaS',
    slug: 'saas',
    emoji: '☁️',
    survivalRate: '2 in 10',
    tagline: 'Think your SaaS startup idea is brilliant? Let AI destroy it.',
    why: [
      'The market already has a $10M-funded competitor doing the exact same thing',
      '"We just need 1% of the market" is not a business model',
      'Your "simple" MVP will take 18 months and $400K to build correctly',
      'Enterprise sales cycles will kill your runway before you close a single deal',
    ],
  },
  {
    label: 'Food & Bev',
    slug: 'food-bev',
    emoji: '🍕',
    survivalRate: '1 in 10',
    tagline: 'Think your food or beverage startup is the next big thing? Brace yourself.',
    why: [
      'Unit economics in food are brutal — margins disappear before you hit scale',
      'Distribution into retail is a multi-year, expensive relationship game',
      'Consumer taste is fickle — what\'s trendy today is forgotten by next quarter',
      'Food safety regulations, shelf life, and cold chain logistics are startup killers',
    ],
  },
  {
    label: 'Marketplace',
    slug: 'marketplace',
    emoji: '🛒',
    survivalRate: '1 in 10',
    tagline: 'Think your two-sided marketplace will crack the chicken-and-egg problem? Think again.',
    why: [
      'The cold-start problem kills most marketplaces before they reach critical mass',
      'You need to subsidize both sides — costs spiral before network effects kick in',
      'Amazon, Etsy, or Airbnb already owns this niche and has 10 years of trust',
      'Your take rate will feel fair to you and extortionate to your suppliers',
    ],
  },
  {
    label: 'Hardware',
    slug: 'hardware',
    emoji: '🔧',
    survivalRate: '1 in 20',
    tagline: 'Think your hardware startup will actually ship? Hardware is hard.',
    why: [
      'Manufacturing lead times will push your launch 12 months beyond your estimate',
      'Every hardware revision costs $50K-$500K — and you\'ll need at least three',
      'Returns, warranties, and support costs will destroy your margins at scale',
      'Factories have minimum order quantities that will exhaust your funding',
    ],
  },
  {
    label: 'Consumer App',
    slug: 'consumer-app',
    emoji: '📱',
    survivalRate: '1 in 50',
    tagline: 'Think your consumer app will be the next TikTok? Your retention curve disagrees.',
    why: [
      'Day-1 retention below 25% means you\'re building a leaky bucket, not a product',
      'App Store discovery is essentially dead without a $50K/month UA budget',
      'You need a habit loop — most consumer apps never find one',
      'Your TAM is "everyone with a phone" and your realistic addressable market is 4,000 people',
    ],
  },
  {
    label: 'Fintech',
    slug: 'fintech',
    emoji: '💳',
    survivalRate: '2 in 10',
    tagline: 'Think your fintech startup can disrupt banking? Regulators have thoughts.',
    why: [
      'Banking licenses take 2-4 years and millions in legal fees to obtain',
      'Compliance costs will consume 40% of your headcount before you reach $1M ARR',
      'Stripe, Plaid, and Brex already solved the problem you think is a gap',
      'Fraud rates in fintech can wipe out an entire month\'s revenue overnight',
    ],
  },
  {
    label: 'Health',
    slug: 'health',
    emoji: '🏥',
    survivalRate: '2 in 10',
    tagline: 'Think your healthtech startup will change medicine? FDA filings are calling.',
    why: [
      'Healthcare sales cycles average 18 months — your runway won\'t survive the first pilot',
      'HIPAA compliance and data security requirements will triple your engineering costs',
      'Doctors don\'t switch tools; hospital procurement committees take years to decide',
      'Without clinical evidence, you\'re selling faith — with it, you\'re 5 years behind schedule',
    ],
  },
  {
    label: 'Education',
    slug: 'education',
    emoji: '🎓',
    survivalRate: '1 in 10',
    tagline: 'Think your edtech startup will transform learning? The completion rate says otherwise.',
    why: [
      'Online course completion rates average below 10% — engagement is not solved',
      'School procurement is a 12-month sales cycle with a 2% close rate',
      'Parents are the buyer, students are the user, and schools control distribution — a three-way hell',
      'Every edtech idea was tried during COVID and most of them failed',
    ],
  },
  {
    label: 'Real Estate',
    slug: 'real-estate',
    emoji: '🏠',
    survivalRate: '2 in 10',
    tagline: 'Think your proptech startup will disrupt real estate? Realtors have survived every disruption.',
    why: [
      'Real estate agents control deal flow and they will route around any tech threatening their commission',
      'Regulation varies by state, city, and municipality — scaling across markets is a legal nightmare',
      'The market is deeply cyclical — what works in a bull market collapses in a correction',
      'Zillow tried to disrupt its own market and lost $500M. You won\'t do better.',
    ],
  },
  {
    label: 'Other',
    slug: 'other',
    emoji: '🤔',
    survivalRate: '3 in 10',
    tagline: 'Not sure what category your startup idea falls into? That might be your first problem.',
    why: [
      'If you can\'t explain your market category, neither can your investors or customers',
      'Undefined markets are either genuinely new (rare) or undefined because nobody wants them (common)',
      'Without a category, you have no competitive benchmarks, no comp set, and no pricing anchor',
      'The vagueness that feels like "disruption" to you reads as "unfocused" to everyone else',
    ],
  },
]

export const CATEGORY_SLUGS = CATEGORY_META.map((c) => c.slug)

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORY_META.find((c) => c.slug === slug)
}

export function slugToCategory(slug: string): Category | undefined {
  return CATEGORY_META.find((c) => c.slug === slug)?.label
}
