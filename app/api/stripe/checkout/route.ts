import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured.' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { sessionToken } = body

    if (!sessionToken || typeof sessionToken !== 'string') {
      return NextResponse.json({ error: 'Missing session.' }, { status: 400 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'RoastMePal Pro',
              description: 'Unlock all 4 premium personas forever. Gordon Ramsay, The Shark, AI Overlord, and The Flirt are waiting.',
            },
            unit_amount: 499,
          },
          quantity: 1,
        },
      ],
      metadata: { sessionToken },
      success_url: `${appUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout.' }, { status: 500 })
  }
}
