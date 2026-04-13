import Link from 'next/link'
import type { CategoryMeta } from '../../../src/lib/categories'

export default function CategoryPage({ category }: { category: CategoryMeta }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

  const schemaCategory = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Roast My ${category.label} Startup Idea`,
    description: category.tagline,
    url: `${appUrl}/roast/${category.slug}`,
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `Why do most ${category.label} startups fail?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: category.why.join(' '),
          },
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaCategory) }}
      />
      <div className="min-h-screen bg-[#0A0A0F] text-white">
        {/* Navbar */}
        <nav className="border-b border-[#1F1F2E] px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-display text-xl text-[#00FF88]">
              RoastMePal
            </Link>
            <Link
              href="/"
              className="text-sm text-[#6B7280] hover:text-white transition-colors"
            >
              ← Back to roaster
            </Link>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{category.emoji}</div>
            <h1 className="font-display text-3xl md:text-5xl mb-4 leading-tight">
              {category.tagline}
            </h1>
            <p className="text-[#6B7280] text-lg mb-2">
              Startup survival rate in <strong className="text-white">{category.label}</strong>:
            </p>
            <p className="font-mono text-3xl text-[#EF4444] font-bold mb-8">
              {category.survivalRate} ideas survive the roast
            </p>
            <Link
              href={`/?category=${encodeURIComponent(category.label)}`}
              className="inline-block bg-[#00FF88] text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#00DD77] transition-colors"
            >
              Roast my {category.label} idea →
            </Link>
          </div>

          {/* TL;DR Block — GEO-optimised structured content */}
          <section className="bg-[#13131A] border border-[#1F1F2E] rounded-xl p-6 md:p-8 mb-10">
            <h2 className="font-display text-2xl mb-2 text-[#F59E0B]">
              TL;DR — Why {category.label} ideas fail
            </h2>
            <p className="text-[#6B7280] text-sm mb-6">
              The brutal patterns our AI spots in every doomed {category.label} pitch
            </p>
            <ul className="space-y-4">
              {category.why.map((reason, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[#EF4444] font-mono font-bold mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[#D1D5DB] leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* How it works */}
          <section className="mb-10">
            <h2 className="font-display text-2xl mb-6 text-center">
              How the roast works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { step: '01', title: 'Submit your idea', body: `Describe your ${category.label} startup in one sentence. No deck required.` },
                { step: '02', title: 'Pick a persona', body: 'Choose your executioner — Brutal VC, AI Overlord, Bitter Ex-CoFounder, and more.' },
                { step: '03', title: 'Get destroyed', body: 'Receive a savagely honest roast with a burn score and a pivot suggestion.' },
              ].map(({ step, title, body }) => (
                <div
                  key={step}
                  className="bg-[#13131A] border border-[#1F1F2E] rounded-xl p-5"
                >
                  <div className="font-mono text-[#00FF88] text-sm mb-2">{step}</div>
                  <div className="font-display text-lg mb-1">{title}</div>
                  <div className="text-[#6B7280] text-sm">{body}</div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center bg-[#13131A] border border-[#1F1F2E] rounded-xl p-8">
            <p className="text-[#6B7280] mb-4 text-sm">
              Free to use — 5 roasts per day, no account required
            </p>
            <Link
              href={`/?category=${encodeURIComponent(category.label)}`}
              className="inline-block bg-[#00FF88] text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#00DD77] transition-colors"
            >
              Find out if your {category.label} idea is delusional →
            </Link>
          </div>

          {/* Browse other categories */}
          <div className="mt-12">
            <h3 className="text-[#6B7280] text-sm mb-4 text-center">Browse other categories</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { slug: 'saas', label: 'SaaS', emoji: '☁️' },
                { slug: 'fintech', label: 'Fintech', emoji: '💳' },
                { slug: 'health', label: 'Health', emoji: '🏥' },
                { slug: 'consumer-app', label: 'Consumer App', emoji: '📱' },
                { slug: 'marketplace', label: 'Marketplace', emoji: '🛒' },
                { slug: 'food-bev', label: 'Food & Bev', emoji: '🍕' },
                { slug: 'hardware', label: 'Hardware', emoji: '🔧' },
                { slug: 'education', label: 'Education', emoji: '🎓' },
                { slug: 'real-estate', label: 'Real Estate', emoji: '🏠' },
              ]
                .filter((c) => c.slug !== category.slug)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/roast/${c.slug}`}
                    className="text-sm px-3 py-1.5 border border-[#1F1F2E] rounded-full text-[#6B7280] hover:text-white hover:border-[#6B7280] transition-colors"
                  >
                    {c.emoji} {c.label}
                  </Link>
                ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
