import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const PRICE_IDS = {
  'price_beginner_monthly': process.env.STRIPE_BEGINNER_PRICE_ID || 'price_1234567890',
  'price_unlimited_monthly': process.env.STRIPE_UNLIMITED_PRICE_ID || 'price_0987654321'
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId, trial = false } = await request.json()

    if (!priceId || !PRICE_IDS[priceId as keyof typeof PRICE_IDS]) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: [
        {
          price: PRICE_IDS[priceId as keyof typeof PRICE_IDS],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?checkout=cancelled`,
      metadata: {
        userId: session.user.id,
        priceId: priceId
      },
      subscription_data: trial ? {
        trial_period_days: 7,
      } : undefined,
      phone_number_collection: {
        enabled: true
      }
    })

    return NextResponse.json({ url: checkoutSession.url })

  } catch (error) {
    console.error('Checkout session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
