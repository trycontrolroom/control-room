import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const priceId = session.metadata?.priceId

        if (userId && priceId) {
          let plan: 'BEGINNER' | 'UNLIMITED' = 'BEGINNER'
          if (priceId.includes('unlimited')) {
            plan = 'UNLIMITED'
          }

          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionPlan: plan,
              subscriptionId: session.subscription as string,
              phoneNumber: session.customer_details?.phone || undefined,
              phoneVerified: !!session.customer_details?.phone,
              trialEndsAt: null // Clear trial end date
            }
          })

          console.log(`Subscription activated for user ${userId}: ${plan}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        const user = await prisma.user.findFirst({
          where: { subscriptionId: subscription.id }
        })

        if (user) {
          if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                subscriptionPlan: 'TRIAL',
                trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
              }
            })
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        const user = await prisma.user.findFirst({
          where: { subscriptionId: subscription.id }
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionPlan: 'TRIAL',
              subscriptionId: null,
              trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
            }
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
