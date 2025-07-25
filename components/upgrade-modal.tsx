'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Check, Zap, Crown } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  limitType: string
  currentUsage?: number
  limit?: number
}

const plans = [
  {
    name: 'Beginner',
    price: '$39',
    period: '/month',
    description: 'Perfect for small teams',
    priceId: 'price_beginner_monthly',
    features: [
      'Up to 3 agents',
      'Up to 2 active policies',
      'Up to 5 custom metrics',
      'AI Helper (5 executions/day)',
      'Code editor access',
      'RBAC + multi-workspace'
    ],
    icon: Zap,
    popular: true
  },
  {
    name: 'Unlimited',
    price: '$149',
    period: '/month',
    description: 'For growing teams',
    priceId: 'price_unlimited_monthly',
    features: [
      'Unlimited agents',
      'Unlimited policies',
      'Unlimited custom metrics',
      'Unlimited AI Helper',
      'Full code editor',
      'Priority processing',
      'Advanced audit logs'
    ],
    icon: Crown,
    popular: false
  }
]

export function UpgradeModal({ isOpen, onClose, currentPlan, limitType, currentUsage, limit }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null)

  if (!isOpen) return null

  const handleUpgrade = async (priceId: string) => {
    setLoading(priceId)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, trial: true })
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Upgrade error:', error)
    } finally {
      setLoading(null)
    }
  }

  const getLimitMessage = () => {
    switch (limitType) {
      case 'agents':
        return `You've reached your limit of ${limit} agents`
      case 'policies':
        return `You've reached your limit of ${limit} policies`
      case 'metrics':
        return `You've reached your limit of ${limit} custom metrics`
      case 'aiHelper':
        return `You've reached your daily limit of ${limit} AI Helper executions`
      default:
        return 'You\'ve reached your plan limit'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Upgrade Your Plan</h2>
              <p className="text-gray-300">{getLimitMessage()}</p>
              {currentUsage !== undefined && limit && (
                <div className="mt-2">
                  <Badge variant="outline" className="border-red-500/50 text-red-300">
                    {currentUsage}/{limit} used
                  </Badge>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-gray-600 hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon
              const isCurrentPlan = currentPlan.toLowerCase() === plan.name.toLowerCase()
              
              return (
                <Card 
                  key={plan.name}
                  className={`glass-panel relative ${
                    plan.popular 
                      ? 'border-blue-500/50 neon-glow' 
                      : 'border-blue-500/20'
                  } ${isCurrentPlan ? 'opacity-50' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        Recommended
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-3">
                      <Icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="mb-3">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400">{plan.period}</span>
                    </div>
                    <CardDescription className="text-gray-300">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleUpgrade(plan.priceId)}
                      disabled={isCurrentPlan || loading === plan.priceId}
                      className={`w-full ${plan.popular ? 'command-button' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {loading === plan.priceId ? (
                        'Processing...'
                      ) : isCurrentPlan ? (
                        'Current Plan'
                      ) : (
                        `Upgrade to ${plan.name}`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              All plans include a 7-day free trial • Cancel anytime • No setup fees
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
