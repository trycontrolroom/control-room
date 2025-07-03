import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      'Basic dashboard',
      '1 agent monitoring',
      'Viewer access only',
      'Basic metrics',
      'Community support'
    ],
    limitations: [
      'No custom metrics',
      'No policy builder',
      'No notifications',
      'No marketplace access'
    ],
    cta: 'Start Free',
    ctaVariant: 'outline' as const,
    popular: false
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'For growing teams and advanced monitoring',
    features: [
      'Advanced dashboard',
      'Up to 10 agents',
      'Custom metrics builder',
      'Visual policy builder',
      'Real-time notifications',
      'Marketplace access',
      'Email & Slack alerts',
      'Priority support'
    ],
    limitations: [],
    cta: 'Upgrade to Pro',
    ctaVariant: 'default' as const,
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$499',
    period: '/month',
    description: 'For large organizations with complex needs',
    features: [
      'Unlimited agents',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated support',
      'Concierge setup',
      'SLA guarantees',
      'Custom policies',
      'White-label options',
      'Advanced security',
      'Audit logs'
    ],
    limitations: [],
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
    popular: false
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
              From reconnaissance to full-scale deployment.
            </p>
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
                      <Link href={plan.name === 'Free' ? '/login' : '/checkout?plan=' + plan.name.toLowerCase()}>
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
                    <th className="text-center py-4 px-6 text-gray-300">Free</th>
                    <th className="text-center py-4 px-6 text-gray-300">Pro</th>
                    <th className="text-center py-4 px-6 text-gray-300">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">Agents</td>
                    <td className="text-center py-4 px-6">1</td>
                    <td className="text-center py-4 px-6">10</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">Custom Metrics</td>
                    <td className="text-center py-4 px-6"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">Policy Builder</td>
                    <td className="text-center py-4 px-6"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">Real-time Notifications</td>
                    <td className="text-center py-4 px-6"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-6">Marketplace Access</td>
                    <td className="text-center py-4 px-6"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Support Level</td>
                    <td className="text-center py-4 px-6">Community</td>
                    <td className="text-center py-4 px-6">Priority</td>
                    <td className="text-center py-4 px-6">Dedicated</td>
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
