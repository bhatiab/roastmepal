const PROMO_LINES = [
  'At least your F1 weekend can\'t fail — GrandPrixPal.com',
  'Score your next location before betting your savings — ScoreVet.com',
  'Close the laptop. Plan a golf trip — FairwayPal.com',
  'GrandPrixPal.com: F1 race travel guides. Won\'t get roasted.',
]

export function getPromoLine(): string {
  return PROMO_LINES[Math.floor(Math.random() * PROMO_LINES.length)]
}
