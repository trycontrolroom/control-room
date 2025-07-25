import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

const plans = [
  {
    name: 'Beginner',
    price: '$39',
    period: '/month',
    description: 'Perfect for small teams getting started',
    trial: '7-day free trial',
    features: [
      'Up to 3 agents',
      'Up to 2 active policies',
      'Up to 5 custom metrics',
      'Real-time metrics enabled',
      'Agent code editor (read/write)',
      'RBAC + multi-workspace',
      'Affiliate dashboard access',
      'Email support'
    ],
    limitations: [
      'Limited AI Helper (5 executions/day)',
      'Basic support only'
    ],
    cta: 'Start 7-Day Trial',
    ctaVariant: 'default' as const,
    popular: true,
    stripePrice: 'price_beginner_monthly'
  },
  {
    name: 'Unlimited',
    price: '$149',
    period: '/month',
    description: 'For growing teams with advanced needs',
    trial: '7-day free trial',
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
    ],
    limitations: [],
    cta: 'Start 7-Day Trial',
    ctaVariant: 'default' as const,
    popular: false,
    stripePrice: 'price_unlimited_monthly'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with complex requirements',
    trial: 'Custom trial available',
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
    ],
    limitations: [],
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
    popular: false,
    stripePrice: null
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen command-center-bg">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Choose Your Command Level
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Scale your AI agent operations with plans designed for every mission size. 
              All plans include a 7-day free trial with phone verification.
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
              <span className="text-blue-300 font-semibold">🎉 7-Day Free Trial • No Credit Card Required</span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`glass-panel relative ${
                  plan.popular 
                    ? 'border-blue-500/50 neon-glow' 
                    : 'border-blue-500/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  {plan.trial && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium">
                        {plan.trial}
                      </span>
                    </div>
                  )}
                  <CardDescription className="text-gray-300">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <span className="text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6">
                    {plan.name === 'Enterprise' ? (
                      <Link href="/contact">
                        <Button 
                          variant={plan.ctaVariant}
                          className="w-full command-button"
                          size="lg"
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/signup?plan=${plan.stripePrice}&trial=true`}>
                        <Button 
                          variant={plan.ctaVariant}
                          className={`w-full ${plan.popular ? 'command-button' : ''}`}
                          size="lg"
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="glass-panel rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-white">
              Feature Comparison
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-6 text-gray-300">Feature</th>
                    <th className="text-center py-4 px-6 text-gray-300">Beginner</th>
                    <th className="text-center py-4 px-6 text-gray-300">Unlimited</th>
                    <th className="text-center py-4 px-6 text-gray-300">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">Agents</td>
                    <td className="text-center py-4 px-6">3</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">Active Policies</td>
                    <td className="text-center py-4 px-6">2</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">Custom Metrics</td>
                    <td className="text-center py-4 px-6">5</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">AI Helper Usage</td>
                    <td className="text-center py-4 px-6">5/day</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">Code Editor</td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">Real-time Metrics</td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">Affiliate Dashboard</td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">Audit Logs</td>
                    <td className="text-center py-4 px-6"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6">Advanced</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Support Level</td>
                    <td className="text-center py-4 px-6">Email</td>
                    <td className="text-center py-4 px-6">Priority</td>
                    <td className="text-center py-4 px-6">Dedicated + SLA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
