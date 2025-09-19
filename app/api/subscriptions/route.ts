import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: session.user.id
      }
    })

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan, paymentMethodId } = body

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let customerId = user.subscription?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id
        }
      })
      customerId = customer.id
    }

    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      })

      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      })
    }

    const priceId = plan === 'PRO' ? 'price_pro_monthly' : 'price_enterprise_monthly'
    
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata: {
        userId: user.id,
        plan
      }
    })

    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        plan,
        status: stripeSubscription.status,
        stripeCustomerId: customerId,
        stripeSubscriptionId: stripeSubscription.id,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
      },
      create: {
        userId: user.id,
        plan,
        status: stripeSubscription.status,
        stripeCustomerId: customerId,
        stripeSubscriptionId: stripeSubscription.id,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
      }
    })

    return NextResponse.json({ 
      subscriptionId: stripeSubscription.id,
      clientSecret: stripeSubscription.latest_invoice 
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
