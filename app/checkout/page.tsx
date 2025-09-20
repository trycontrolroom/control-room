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
      <div className="page">
        <div className="bg-gradient" />
        <div className="bg-vignette" />
        <div className="bg-aurora" />
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
        <style jsx>{`
          .page {
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
          }
          .bg-gradient {
            position: fixed;
            inset: 0;
            background: 
              radial-gradient(1200px 600px at 50% -10%, rgba(110,104,220,.12), transparent 60%),
              radial-gradient(900px 520px at 72% 120%, rgba(60,80,220,.08), transparent 60%);
            pointer-events: none;
            z-index: -3;
          }
          .bg-vignette {
            position: fixed;
            inset: -1px;
            background: radial-gradient(160% 110% at 50% 0%, transparent 50%, rgba(0,0,0,.35) 90%);
            pointer-events: none;
            z-index: -2;
          }
          .bg-aurora {
            position: fixed;
            inset: 0;
            background: 
              radial-gradient(50% 40% at 20% 20%, rgba(130,120,255,.07), transparent 60%),
              radial-gradient(40% 35% at 80% 85%, rgba(80,120,255,.06), transparent 60%);
            filter: blur(40px);
            pointer-events: none;
            z-index: -1;
            animation: drift 20s ease-in-out infinite alternate;
          }
          @keyframes drift {
            from { transform: rotate(-10deg) scale(1.1); }
            to { transform: rotate(10deg) scale(1.2); }
          }
          .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          .loading-spinner {
            width: 2rem;
            height: 2rem;
            border: 2px solid transparent;
            border-top: 2px solid #4F6AFF;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="page">
        <div className="bg-gradient" />
        <div className="bg-vignette" />
        <div className="bg-aurora" />
        <div className="error-container">
          <div className="error-card">
            <h2 className="error-title">Item Not Found</h2>
            <p className="error-message">The item you're trying to purchase could not be found.</p>
            <Link href="/pricing">
              <Button className="back-button">
                <ArrowLeft className="button-icon" />
                Back to Pricing
              </Button>
            </Link>
          </div>
        </div>
        <style jsx>{`
          .page {
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
          }
          .bg-gradient {
            position: fixed;
            inset: 0;
            background: 
              radial-gradient(1200px 600px at 50% -10%, rgba(110,104,220,.12), transparent 60%),
              radial-gradient(900px 520px at 72% 120%, rgba(60,80,220,.08), transparent 60%);
            pointer-events: none;
            z-index: -3;
          }
          .bg-vignette {
            position: fixed;
            inset: -1px;
            background: radial-gradient(160% 110% at 50% 0%, transparent 50%, rgba(0,0,0,.35) 90%);
            pointer-events: none;
            z-index: -2;
          }
          .bg-aurora {
            position: fixed;
            inset: 0;
            background: 
              radial-gradient(50% 40% at 20% 20%, rgba(130,120,255,.07), transparent 60%),
              radial-gradient(40% 35% at 80% 85%, rgba(80,120,255,.06), transparent 60%);
            filter: blur(40px);
            pointer-events: none;
            z-index: -1;
            animation: drift 20s ease-in-out infinite alternate;
          }
          @keyframes drift {
            from { transform: rotate(-10deg) scale(1.1); }
            to { transform: rotate(10deg) scale(1.2); }
          }
          .error-container {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            padding: 2rem;
          }
          .error-card {
            max-width: 28rem;
            background: linear-gradient(180deg, rgba(14,20,36,.85), rgba(10,14,26,.98));
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 24px;
            box-shadow: 0 34px 90px rgba(0,0,0,.55), 0 6px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
            backdrop-filter: blur(24px);
            padding: 3rem;
            text-align: center;
          }
          .error-title {
            font-size: 1.25rem;
            font-weight: 800;
            color: #FFFFFF;
            margin-bottom: 1rem;
          }
          .error-message {
            color: #8a96ad;
            margin-bottom: 1.5rem;
          }
          .back-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            height: 3rem;
            background: linear-gradient(135deg, #8A7FFF, #4F6AFF);
            border: none;
            border-radius: 14px;
            color: #FFFFFF;
            font-size: 1rem;
            font-weight: 600;
            padding: 0 1.5rem;
            transition: all 0.2s ease;
            box-shadow: 0 12px 30px rgba(79,106,255,.32);
            text-decoration: none;
          }
          .back-button:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 16px 40px rgba(79,106,255,.4);
          }
          .button-icon {
            width: 1rem;
            height: 1rem;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="bg-gradient" />
      <div className="bg-vignette" />
      <div className="bg-aurora" />
      
      <div className="checkout-container">
        <div className="checkout-header">
          <Link href={item.type === 'plan' ? '/pricing' : '/marketplace'}>
            <Button variant="outline" size="sm" className="back-button-outline">
              <ArrowLeft className="button-icon" />
              Back
            </Button>
          </Link>
          <div className="header-content">
            <h1 className="page-title">Checkout</h1>
            <p className="page-subtitle">Complete your purchase securely</p>
          </div>
        </div>

        <div className="checkout-grid">
          <div className="order-summary">
            <Card className="summary-card">
              <CardHeader>
                <CardTitle className="card-title">Order Summary</CardTitle>
                <CardDescription className="card-description">
                  Review your purchase details
                </CardDescription>
              </CardHeader>
              <CardContent className="card-content">
                <div className="item-details">
                  <div className="item-icon">
                    {item.type === 'plan' ? (
                      <Shield className="icon" />
                    ) : (
                      <Download className="icon" />
                    )}
                  </div>
                  <div className="item-info">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-description">{item.description}</p>
                    
                    {item.author && (
                      <div className="item-meta">
                        <span className="author">by {item.author}</span>
                        {item.rating && (
                          <div className="rating">
                            <Star className="star-icon" />
                            <span className="rating-value">{item.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Badge className="item-badge">
                      {item.type === 'plan' ? 'Subscription' : 'One-time Purchase'}
                    </Badge>
                  </div>
                  <div className="item-price">
                    <div className="price-amount">
                      {item.price === 0 ? 'Custom' : `$${item.price}`}
                    </div>
                    {item.type === 'plan' && item.price > 0 && (
                      <div className="price-period">/month</div>
                    )}
                  </div>
                </div>

                {item.features && (
                  <>
                    <Separator className="separator" />
                    <div className="features-section">
                      <h4 className="features-title">What's included:</h4>
                      <div className="features-grid">
                        {item.features.map((feature, index) => (
                          <div key={index} className="feature-item">
                            <Check className="check-icon" />
                            <span className="feature-text">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="payment-details">
            <Card className="payment-card">
              <CardHeader>
                <CardTitle className="card-title">Payment Details</CardTitle>
                <CardDescription className="card-description">
                  Secure payment powered by Stripe
                </CardDescription>
              </CardHeader>
              <CardContent className="card-content">
                <div className="pricing-breakdown">
                  <div className="price-row">
                    <span className="price-label">Subtotal</span>
                    <span className="price-value">{item.price === 0 ? 'Custom' : `$${item.price}`}</span>
                  </div>
                  <div className="price-row">
                    <span className="price-label">Tax</span>
                    <span className="price-value">$0.00</span>
                  </div>
                  <Separator className="separator" />
                  <div className="price-row total">
                    <span className="price-label">Total</span>
                    <span className="price-value">{item.price === 0 ? 'Custom' : `$${item.price}`}</span>
                  </div>
                </div>

                <div className="security-notice">
                  <div className="security-header">
                    <Lock className="security-icon" />
                    <span className="security-title">Secure Payment</span>
                  </div>
                  <p className="security-text">
                    Your payment information is encrypted and processed securely by Stripe.
                  </p>
                </div>

                {item.price === 0 ? (
                  <Link href="/contact">
                    <Button className="checkout-button">
                      Contact Sales
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="checkout-button"
                  >
                    {processing ? (
                      <>
                        <div className="processing-spinner"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="button-icon" />
                        Complete Purchase
                      </>
                    )}
                  </Button>
                )}

                <p className="legal-text">
                  By completing this purchase, you agree to our{' '}
                  <Link href="/terms" className="legal-link">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="legal-link">
                    Privacy Policy
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .bg-gradient {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(1200px 600px at 50% -10%, rgba(110,104,220,.12), transparent 60%),
            radial-gradient(900px 520px at 72% 120%, rgba(60,80,220,.08), transparent 60%);
          pointer-events: none;
          z-index: -3;
        }

        .bg-vignette {
          position: fixed;
          inset: -1px;
          background: radial-gradient(160% 110% at 50% 0%, transparent 50%, rgba(0,0,0,.35) 90%);
          pointer-events: none;
          z-index: -2;
        }

        .bg-aurora {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(50% 40% at 20% 20%, rgba(130,120,255,.07), transparent 60%),
            radial-gradient(40% 35% at 80% 85%, rgba(80,120,255,.06), transparent 60%);
          filter: blur(40px);
          pointer-events: none;
          z-index: -1;
          animation: drift 20s ease-in-out infinite alternate;
        }

        @keyframes drift {
          from { transform: rotate(-10deg) scale(1.1); }
          to { transform: rotate(10deg) scale(1.2); }
        }

        .checkout-container {
          padding: 5rem 2rem 5rem;
          max-width: 64rem;
          margin: 0 auto;
          width: 100%;
        }

        .checkout-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .back-button-outline {
          background: rgba(8,12,22,.95);
          border: 1px solid rgba(175,190,255,.18);
          border-radius: 8px;
          color: #a3b3ff;
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }

        .back-button-outline:hover {
          background: rgba(175,190,255,.1);
          border-color: rgba(175,190,255,.3);
        }

        .header-content {
          flex: 1;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 0.25rem;
          letter-spacing: -0.025em;
        }

        .page-subtitle {
          color: #8a96ad;
          font-size: 1rem;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .checkout-grid {
            grid-template-columns: 2fr 1fr;
          }
        }

        .summary-card, .payment-card {
          background: linear-gradient(180deg, rgba(14,20,36,.85), rgba(10,14,26,.98));
          border: 1px solid rgba(175,190,255,.16);
          border-radius: 24px;
          box-shadow: 0 34px 90px rgba(0,0,0,.55), 0 6px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
          backdrop-filter: blur(24px);
        }

        .payment-card {
          border-color: rgba(34, 197, 94, 0.16);
        }

        .card-title {
          color: #FFFFFF;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .card-description {
          color: #8a96ad;
          font-size: 0.875rem;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .item-details {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .item-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #4F6AFF, #8A7FFF);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon {
          width: 2rem;
          height: 2rem;
          color: #FFFFFF;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
        }

        .item-description {
          color: #8a96ad;
          margin-bottom: 0.5rem;
        }

        .item-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .author {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .star-icon {
          width: 1rem;
          height: 1rem;
          color: #fbbf24;
          fill: currentColor;
        }

        .rating-value {
          font-size: 0.875rem;
          color: #8a96ad;
        }

        .item-badge {
          background: rgba(79, 106, 255, 0.1);
          color: #4F6AFF;
          border: 1px solid rgba(79, 106, 255, 0.3);
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .item-price {
          text-align: right;
        }

        .price-amount {
          font-size: 1.5rem;
          font-weight: 800;
          color: #FFFFFF;
        }

        .price-period {
          font-size: 0.875rem;
          color: #8a96ad;
        }

        .separator {
          background: rgba(175,190,255,.12);
          height: 1px;
          border: none;
        }

        .features-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .features-title {
          font-weight: 500;
          color: #FFFFFF;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }

        @media (min-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .check-icon {
          width: 1rem;
          height: 1rem;
          color: #22c55e;
          flex-shrink: 0;
        }

        .feature-text {
          font-size: 0.875rem;
          color: #d1d5db;
        }

        .pricing-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-row.total {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .price-label {
          color: #8a96ad;
        }

        .price-value {
          color: #FFFFFF;
        }

        .security-notice {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 12px;
          padding: 1rem;
        }

        .security-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .security-icon {
          width: 1rem;
          height: 1rem;
          color: #22c55e;
        }

        .security-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #22c55e;
        }

        .security-text {
          font-size: 0.75rem;
          color: #8a96ad;
          margin: 0;
        }

        .checkout-button {
          width: 100%;
          height: 3.5rem;
          background: linear-gradient(135deg, #8A7FFF, #4F6AFF);
          border: none;
          border-radius: 14px;
          color: #FFFFFF;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 12px 30px rgba(79,106,255,.32);
          text-decoration: none;
        }

        .checkout-button:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 40px rgba(79,106,255,.4);
        }

        .checkout-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .button-icon {
          width: 1rem;
          height: 1rem;
        }

        .processing-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid #FFFFFF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .legal-text {
          font-size: 0.75rem;
          color: #6b7280;
          text-align: center;
          margin: 0;
        }

        .legal-link {
          color: #4F6AFF;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .legal-link:hover {
          color: #8A7FFF;
        }
      `}</style>
    </div>
  )
}
