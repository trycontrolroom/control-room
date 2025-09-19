'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CreditCard, 
  Shield, 
  Check, 
  ArrowLeft,
  Lock,
  Star,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutItem {
  type: 'plan' | 'agent'
  id: string
  name: string
  description: string
  price: number
  features?: string[]
  author?: string
  rating?: number
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [item, setItem] = useState<CheckoutItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      const currentUrl = window.location.href
      router.push(`/signup?returnUrl=${encodeURIComponent(currentUrl)}`)
      return
    }

    if (status === 'authenticated') {
      const type = searchParams.get('type')
      const id = searchParams.get('id')
      const plan = searchParams.get('plan')

      if (type && (id || plan)) {
        fetchCheckoutItem(type as 'plan' | 'agent', id || plan!)
      } else {
        router.push('/pricing')
      }
    }
  }, [status, router, searchParams])

  const fetchCheckoutItem = async (type: 'plan' | 'agent', identifier: string) => {
    try {
      let response
      
      if (type === 'plan') {
        const planData = getPlanData(identifier)
        setItem(planData)
        setLoading(false)
        return
      } else {
        response = await fetch(`/api/marketplace/${identifier}`)
      }

      if (response && response.ok) {
        const data = await response.json()
        setItem({
          type,
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          author: data.author,
          rating: data.rating
        })
      }
    } catch (error) {
      console.error('Failed to fetch checkout item:', error)
      router.push('/pricing')
    } finally {
      setLoading(false)
    }
  }

  const getPlanData = (plan: string): CheckoutItem => {
    const plans = {
      price_beginner_monthly: {
        type: 'plan' as const,
        id: 'price_beginner_monthly',
        name: 'Beginner Plan',
        description: 'Perfect for small teams getting started',
        price: 39,
        features: [
          'Up to 3 agents',
          'Up to 2 active policies',
          'Up to 5 custom metrics',
          'Real-time metrics enabled',
          'Agent code editor (read/write)',
          'RBAC + multi-workspace',
          'Affiliate dashboard access',
          'Email support'
        ]
      },
      price_unlimited_monthly: {
        type: 'plan' as const,
        id: 'price_unlimited_monthly',
        name: 'Unlimited Plan',
        description: 'For growing teams with advanced needs',
        price: 149,
        features: [
          'Unlimited agents',
          'Unlimited policies',
          'Unlimited custom metrics',
          'Unlimited AI Helper usage',
          'Full code editor access',
          'Full real-time metrics',
          'Affiliate dashboard',
          'Priority processing',
          'Priority support'
        ]
      },
      enterprise: {
        type: 'plan' as const,
        id: 'enterprise',
        name: 'Enterprise Plan',
        description: 'For large organizations with complex requirements',
        price: 0,
        features: [
          'Everything in Unlimited',
          'Dedicated support & SLA',
          'Advanced audit exports',
          'SSO readiness',
          'Invoiced billing',
          'Custom integrations',
          'White-label options',
          'Concierge setup',
          'Advanced security'
        ]
      }
    }

    return plans[plan as keyof typeof plans] || plans.price_beginner_monthly
  }

  const handleCheckout = async () => {
    if (!item) return

    setProcessing(true)
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: item.type,
          itemId: item.id,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
        }),
      })

      const { sessionId } = await response.json()
      
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe checkout error:', error)
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setProcessing(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen command-center-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen command-center-bg flex items-center justify-center">
        <Card className="glass-panel border-red-500/20 max-w-md">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-bold text-white mb-4">Item Not Found</h2>
            <p className="text-gray-400 mb-6">The item you're trying to purchase could not be found.</p>
            <Link href="/pricing">
              <Button className="command-button">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pricing
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen command-center-bg">
      <div className="pt-20 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link href={item.type === 'plan' ? '/pricing' : '/marketplace'}>
              <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700/50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Checkout</h1>
              <p className="text-gray-400">Complete your purchase securely</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card className="glass-panel border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                  <CardDescription className="text-gray-400">
                    Review your purchase details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      {item.type === 'plan' ? (
                        <Shield className="w-8 h-8 text-white" />
                      ) : (
                        <Download className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <p className="text-gray-400 mb-2">{item.description}</p>
                      
                      {item.author && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-gray-500">by {item.author}</span>
                          {item.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-400">{item.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        {item.type === 'plan' ? 'Subscription' : 'One-time Purchase'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {item.price === 0 ? 'Custom' : `$${item.price}`}
                      </div>
                      {item.type === 'plan' && item.price > 0 && (
                        <div className="text-sm text-gray-400">/month</div>
                      )}
                    </div>
                  </div>

                  {item.features && (
                    <>
                      <Separator className="bg-gray-700" />
                      <div>
                        <h4 className="font-medium text-white mb-3">What's included:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {item.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Payment Details */}
            <div className="lg:col-span-1">
              <Card className="glass-panel border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Payment Details</CardTitle>
                  <CardDescription className="text-gray-400">
                    Secure payment powered by Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pricing Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">{item.price === 0 ? 'Custom' : `$${item.price}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tax</span>
                      <span className="text-white">$0.00</span>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-white">{item.price === 0 ? 'Custom' : `$${item.price}`}</span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lock className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">Secure Payment</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Your payment information is encrypted and processed securely by Stripe.
                    </p>
                  </div>

                  {/* Checkout Button */}
                  {item.price === 0 ? (
                    <Link href="/contact">
                      <Button
                        className="w-full command-button"
                        size="lg"
                      >
                        Contact Sales
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={handleCheckout}
                      disabled={processing}
                      className="w-full command-button"
                      size="lg"
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Complete Purchase
                        </>
                      )}
                    </Button>
                  )}

                  <p className="text-xs text-gray-500 text-center">
                    By completing this purchase, you agree to our{' '}
                    <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                      Privacy Policy
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
