'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Users, TrendingUp } from 'lucide-react'

interface AffiliateApplicationFormProps {
  onSubmit: (data: AffiliateApplicationData) => void
  loading?: boolean
}

export interface AffiliateApplicationData {
  experience: string
  audience: string
  marketingChannels: string
  website?: string
  socialMedia?: string
}

export default function AffiliateApplicationForm({ onSubmit, loading }: AffiliateApplicationFormProps) {
  const [formData, setFormData] = useState<AffiliateApplicationData>({
    experience: '',
    audience: '',
    marketingChannels: '',
    website: '',
    socialMedia: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: keyof AffiliateApplicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="glass-panel border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-400" />
              Apply for Affiliate Program
            </CardTitle>
            <CardDescription>
              Earn 50% lifetime commissions on all referrals
            </CardDescription>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            50% Commission
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading || !formData.experience || !formData.audience || !formData.marketingChannels}
            className="w-full command-button"
          >
            {loading ? 'Submitting Application...' : 'Apply for Affiliate Program'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
