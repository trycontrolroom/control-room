'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Users, TrendingUp, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AffiliateSignupData {
  fullName: string
  email: string
  phoneNumber: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  paymentMethod: string
  paypalEmail?: string
  bankAccountNumber?: string
  routingNumber?: string
  experience: string
  audience: string
  marketingChannels: string
  website?: string
  socialMedia?: string
  agreementAccepted: boolean
}

export default function AffiliateSignupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState<AffiliateSignupData>({
    fullName: '',
    email: session?.user?.email || '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'paypal',
    paypalEmail: '',
    bankAccountNumber: '',
    routingNumber: '',
    experience: '',
    audience: '',
    marketingChannels: '',
    website: '',
    socialMedia: '',
    agreementAccepted: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof AffiliateSignupData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreementAccepted) {
      setError('You must agree to the Affiliate Agreement to continue')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/affiliate/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          agreementAcceptedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        router.push('/dashboard/affiliate?welcome=true')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to submit application')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return formData.fullName && 
           formData.email && 
           formData.phoneNumber && 
           formData.address && 
           formData.city && 
           formData.state && 
           formData.zipCode && 
           formData.country && 
           formData.experience && 
           formData.audience && 
           formData.marketingChannels && 
           formData.agreementAccepted &&
           (formData.paymentMethod === 'paypal' ? formData.paypalEmail : 
            (formData.bankAccountNumber && formData.routingNumber))
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-blue-400" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent ml-3">
              Control Room
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Our Affiliate Program</h1>
          <p className="text-gray-300">Earn 50% lifetime commissions on all referrals</p>
        </div>

        <Card className="glass-panel border-blue-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                  Affiliate Application
                </CardTitle>
                <CardDescription>
                  Complete the form below to join our affiliate program
                </CardDescription>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                50% Commission
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-sm text-gray-300">Avg. $2,950 per referral</div>
              </div>
              <div className="text-center">
                <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-sm text-gray-300">12.5% conversion rate</div>
              </div>
              <div className="text-center">
                <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-sm text-gray-300">Monthly payouts</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="John Doe"
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Address Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address" className="text-gray-300">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-300">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="New York"
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-gray-300">State/Province *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        placeholder="NY"
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="text-gray-300">ZIP/Postal Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleChange('zipCode', e.target.value)}
                        placeholder="10001"
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-gray-300">Country *</Label>
                    <select
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2"
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Payment Method *</Label>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={(e) => handleChange('paymentMethod', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-gray-300">PayPal</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={formData.paymentMethod === 'bank'}
                          onChange={(e) => handleChange('paymentMethod', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-gray-300">Bank Transfer</span>
                      </label>
                    </div>
                  </div>

                  {formData.paymentMethod === 'paypal' && (
                    <div>
                      <Label htmlFor="paypalEmail" className="text-gray-300">PayPal Email *</Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        value={formData.paypalEmail}
                        onChange={(e) => handleChange('paypalEmail', e.target.value)}
                        placeholder="paypal@example.com"
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                  )}

                  {formData.paymentMethod === 'bank' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bankAccountNumber" className="text-gray-300">Account Number *</Label>
                        <Input
                          id="bankAccountNumber"
                          value={formData.bankAccountNumber}
                          onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                          placeholder="Account number"
                          className="bg-gray-800 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="routingNumber" className="text-gray-300">Routing Number *</Label>
                        <Input
                          id="routingNumber"
                          value={formData.routingNumber}
                          onChange={(e) => handleChange('routingNumber', e.target.value)}
                          placeholder="Routing number"
                          className="bg-gray-800 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Marketing Information */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Marketing Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="experience" className="text-gray-300">
                      Experience with AI/SaaS Marketing *
                    </Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleChange('experience', e.target.value)}
                      placeholder="Describe your experience promoting AI tools, SaaS products, or similar technologies..."
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="audience" className="text-gray-300">
                      Target Audience *
                    </Label>
                    <Textarea
                      id="audience"
                      value={formData.audience}
                      onChange={(e) => handleChange('audience', e.target.value)}
                      placeholder="Describe your audience (developers, AI consultants, agencies, etc.) and approximate size..."
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="marketingChannels" className="text-gray-300">
                      Marketing Channels *
                    </Label>
                    <Textarea
                      id="marketingChannels"
                      value={formData.marketingChannels}
                      onChange={(e) => handleChange('marketingChannels', e.target.value)}
                      placeholder="How do you plan to promote Control Room? (social media, blog, email, conferences, etc.)"
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website" className="text-gray-300">
                        Website/Blog (Optional)
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="socialMedia" className="text-gray-300">
                        Social Media (Optional)
                      </Label>
                      <Input
                        id="socialMedia"
                        value={formData.socialMedia}
                        onChange={(e) => handleChange('socialMedia', e.target.value)}
                        placeholder="@username or profile links"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Affiliate Agreement */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-4">Affiliate Agreement</h3>
                <div className="max-h-64 overflow-y-auto bg-gray-800/50 rounded p-4 mb-4 text-sm text-gray-300">
                  <h4 className="font-semibold text-white mb-2">Control Room Affiliate Program Agreement</h4>
                  <p className="mb-2"><strong>Effective Date:</strong> July 28, 2025</p>
                  <p className="mb-2"><strong>Last Updated:</strong> July 28, 2025</p>
                  
                  <p className="mb-4">
                    This Affiliate Program Agreement ("Agreement") governs your participation in the Control Room Affiliate Program ("Program") operated by Control Room Inc. ("Company," "we," "us," or "our"). By registering as an affiliate, you ("Affiliate," "you," or "your") agree to be legally bound by the terms of this Agreement.
                  </p>

                  <h5 className="font-semibold text-white mb-2">1. Program Overview</h5>
                  <p className="mb-4">
                    The Control Room Affiliate Program allows qualified individuals and entities to earn commissions by referring customers to our AI agent governance platform. Affiliates receive a 50% lifetime commission on all successful referrals.
                  </p>

                  <h5 className="font-semibold text-white mb-2">2. Eligibility</h5>
                  <p className="mb-4">
                    To participate in the Program, you must: (a) be at least 18 years old; (b) have a valid business or personal website, blog, or social media presence; (c) comply with all applicable laws and regulations; and (d) be approved by Company in its sole discretion.
                  </p>

                  <h5 className="font-semibold text-white mb-2">3. Commission Structure</h5>
                  <p className="mb-4">
                    Affiliates earn 50% commission on the first payment and all subsequent payments made by referred customers for the lifetime of their subscription. Commissions are calculated based on net revenue after refunds, chargebacks, and applicable taxes.
                  </p>

                  <h5 className="font-semibold text-white mb-2">4. Payment Terms</h5>
                  <p className="mb-4">
                    Commissions are paid monthly via PayPal or bank transfer, provided the minimum payout threshold of $50 is met. Payments are made within 30 days after the end of each calendar month.
                  </p>

                  <h5 className="font-semibold text-white mb-2">5. Prohibited Activities</h5>
                  <p className="mb-4">
                    Affiliates may not: (a) engage in spam or unsolicited marketing; (b) use misleading or false advertising; (c) bid on Company trademarks in paid search; (d) engage in cookie stuffing or other fraudulent activities; or (e) violate any applicable laws or regulations.
                  </p>

                  <h5 className="font-semibold text-white mb-2">6. Termination</h5>
                  <p className="mb-4">
                    Either party may terminate this Agreement at any time with or without cause. Upon termination, all unpaid commissions earned prior to termination will be paid according to the normal payment schedule.
                  </p>

                  <h5 className="font-semibold text-white mb-2">7. Intellectual Property</h5>
                  <p className="mb-4">
                    Company grants Affiliates a limited, non-exclusive license to use Company's trademarks and marketing materials solely for the purpose of promoting the Program in accordance with Company's brand guidelines.
                  </p>

                  <h5 className="font-semibold text-white mb-2">8. Limitation of Liability</h5>
                  <p className="mb-4">
                    Company's liability to Affiliates is limited to the payment of earned commissions. Company shall not be liable for any indirect, incidental, or consequential damages.
                  </p>

                  <h5 className="font-semibold text-white mb-2">9. Governing Law</h5>
                  <p className="mb-2">
                    This Agreement is governed by the laws of Delaware, United States, without regard to conflict of law principles.
                  </p>
                </div>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreementAccepted}
                    onChange={(e) => handleChange('agreementAccepted', e.target.checked)}
                    required
                    className="mt-1 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">
                    I have read, understood, and agree to be bound by the terms of the Control Room Affiliate Program Agreement. I acknowledge that my acceptance of this agreement is legally binding and that I will receive commission payments according to the terms outlined above.
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">What You'll Get:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 50% lifetime commission on all referrals</li>
                  <li>• Unique referral link and tracking dashboard</li>
                  <li>• Marketing materials and support</li>
                  <li>• Monthly payouts (minimum $50)</li>
                  <li>• Approval within 24-48 hours</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid()}
                className="w-full command-button"
                size="lg"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Affiliate Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
