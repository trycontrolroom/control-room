import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, DollarSign, Users, TrendingUp, Gift, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

const benefits = [
  {
    icon: DollarSign,
    title: '50% Lifetime Commission',
    description: 'Earn 50% of every payment from your referrals for as long as they remain customers'
  },
  {
    icon: Users,
    title: 'Growing Market',
    description: 'AI agent governance is exploding. Be part of the next big wave in enterprise AI'
  },
  {
    icon: TrendingUp,
    title: 'High Conversion',
    description: 'Our 7-day free trial and proven product convert visitors into paying customers'
  },
  {
    icon: Gift,
    title: 'Marketing Support',
    description: 'Get access to marketing materials, case studies, and dedicated affiliate support'
  }
]

const stats = [
  { label: 'Average Commission', value: '$2,950', description: 'per successful referral' },
  { label: 'Conversion Rate', value: '12.5%', description: 'trial to paid conversion' },
  { label: 'Customer LTV', value: '$5,900', description: 'average lifetime value' },
  { label: 'Payout Frequency', value: 'Monthly', description: 'reliable payments' }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'AI Consultant',
    avatar: '/avatars/sarah.jpg',
    quote: 'Control Room affiliates have become my biggest revenue stream. The commissions are incredible and the product sells itself.',
    earnings: '$47,000+ earned'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Tech Blogger',
    avatar: '/avatars/marcus.jpg', 
    quote: 'I love promoting products I actually use. Control Room has transformed how my clients manage their AI agents.',
    earnings: '$23,500+ earned'
  },
  {
    name: 'Jennifer Kim',
    role: 'Enterprise Sales',
    avatar: '/avatars/jennifer.jpg',
    quote: 'The enterprise deals through Control Room affiliates are massive. One referral paid for my vacation to Europe.',
    earnings: '$89,000+ earned'
  }
]

export default function AffiliatePage() {
  return (
    <div className="min-h-screen command-center-bg">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2">
              💰 50% Lifetime Commission Program
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Earn Big with Control Room
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join the most lucrative affiliate program in AI agent governance. 
              Earn 50% lifetime commissions promoting the platform that's revolutionizing enterprise AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup?affiliate=apply">
                <Button size="lg" className="command-button">
                  Apply Now <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="border-gray-600 hover:bg-gray-700">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-panel border-blue-500/20 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-blue-300 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-400">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Why Partner with Control Room?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <Card key={index} className="glass-panel border-blue-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-500/20 p-3 rounded-lg">
                          <Icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                          <p className="text-gray-300">{benefit.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* How It Works Section */}
          <div id="how-it-works" className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-panel border-blue-500/20 text-center">
                <CardContent className="p-6">
                  <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-400">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Apply & Get Approved</h3>
                  <p className="text-gray-300">
                    Submit your application and get approved within 24-48 hours. We review all applications personally.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-blue-500/20 text-center">
                <CardContent className="p-6">
                  <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-400">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Share Your Link</h3>
                  <p className="text-gray-300">
                    Get your unique referral link and start sharing Control Room with your audience through any channel.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-blue-500/20 text-center">
                <CardContent className="p-6">
                  <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-400">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Earn Commissions</h3>
                  <p className="text-gray-300">
                    Earn 50% of every payment for the lifetime of each customer you refer. Payments sent monthly.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="glass-panel border-blue-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">{testimonial.name[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {testimonial.earnings}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Commission Structure */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Commission Structure
            </h2>
            <Card className="glass-panel border-blue-500/20 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-2">Beginner Plan</div>
                    <div className="text-lg text-gray-300 mb-2">$39/month</div>
                    <div className="text-3xl font-bold text-white">$19.50</div>
                    <div className="text-sm text-gray-400">per month per customer</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400 mb-2">Unlimited Plan</div>
                    <div className="text-lg text-gray-300 mb-2">$149/month</div>
                    <div className="text-3xl font-bold text-white">$74.50</div>
                    <div className="text-sm text-gray-400">per month per customer</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400 mb-2">Enterprise Plan</div>
                    <div className="text-lg text-gray-300 mb-2">Custom pricing</div>
                    <div className="text-3xl font-bold text-white">50%</div>
                    <div className="text-sm text-gray-400">of contract value</div>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-center text-green-300">
                    <Star className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Lifetime Commissions - Earn as long as they stay subscribed!</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="glass-panel border-blue-500/20 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Start Earning?
                </h2>
                <p className="text-gray-300 mb-6">
                  Join hundreds of affiliates already earning substantial commissions with Control Room. 
                  Apply now and start earning within 48 hours.
                </p>
                <Link href="/signup?affiliate=apply">
                  <Button size="lg" className="command-button">
                    Apply for Affiliate Program <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <p className="text-sm text-gray-400 mt-4">
                  No upfront costs • Quick approval • Monthly payouts
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
