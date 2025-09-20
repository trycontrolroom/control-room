'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Copy, 
  ExternalLink, 
  Calendar,
  CreditCard,
  Eye,
  MousePointer,
  UserPlus,
  Settings
} from 'lucide-react'
import { useSession } from 'next-auth/react'

interface AffiliateStats {
  totalClicks: number
  totalConversions: number
  totalEarnings: number
  currentMonthEarnings: number
  conversionRate: number
  referralCode: string
  referralLink: string
  payoutInfo?: {
    method: string
    details: string
  }
}

export default function AffiliateDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [payoutMethod, setPayoutMethod] = useState('')
  const [payoutDetails, setPayoutDetails] = useState('')
  const [savingPayout, setSavingPayout] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchAffiliateStats()
  }, [])

  const fetchAffiliateStats = async () => {
    try {
      const response = await fetch('/api/affiliate/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
        setPayoutMethod(data.payoutInfo?.method || '')
        setPayoutDetails(data.payoutInfo?.details || '')
      }
    } catch (error) {
      console.error('Failed to fetch affiliate stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = async () => {
    if (stats?.referralLink) {
      await navigator.clipboard.writeText(stats.referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const savePayoutInfo = async () => {
    setSavingPayout(true)
    try {
      const response = await fetch('/api/affiliate/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: payoutMethod,
          details: payoutDetails
        })
      })

      if (response.ok) {
        await fetchAffiliateStats()
      }
    } catch (error) {
      console.error('Failed to save payout info:', error)
    } finally {
      setSavingPayout(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6">
        <Card className="glass-panel border-red-500/20">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-gray-300">You don't have access to the affiliate dashboard.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Affiliate Dashboard</h1>
          <p className="text-gray-300">Track your referrals and earnings</p>
        </div>
        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
          Active Affiliate
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-panel border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Clicks</p>
                <p className="text-2xl font-bold text-white">{stats.totalClicks.toLocaleString()}</p>
              </div>
              <MousePointer className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Conversions</p>
                <p className="text-2xl font-bold text-white">{stats.totalConversions}</p>
              </div>
              <UserPlus className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">{stats.conversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-white">${stats.totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Month Earnings */}
      <Card className="glass-panel border-green-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            This Month's Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-400 mb-2">
            ${stats.currentMonthEarnings.toLocaleString()}
          </div>
          <p className="text-gray-300">
            Keep sharing your referral link to increase your monthly earnings!
          </p>
        </CardContent>
      </Card>

      {/* Referral Link */}
      <Card className="glass-panel border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <ExternalLink className="w-5 h-5 mr-2" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link to earn 50% lifetime commissions on all referrals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={stats.referralLink}
              readOnly
              className="form-input-enhanced"
            />
            <Button
              onClick={copyReferralLink}
              variant="outline"
              className="border-gray-600 hover:bg-gray-700"
            >
              {copied ? 'Copied!' : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <strong>Your referral code:</strong> {stats.referralCode}
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Anyone who signs up through your link will be tracked automatically. 
              You'll earn 50% of their subscription fees for as long as they remain a customer.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payout Information */}
      <Card className="glass-panel border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payout Information
          </CardTitle>
          <CardDescription>
            Configure how you'd like to receive your affiliate payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payout-method" className="text-gray-300">
                Payout Method
              </Label>
              <Input
                id="payout-method"
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                placeholder="e.g., PayPal, Bank Transfer, Stripe"
                className="form-input-enhanced"
              />
            </div>
            <div>
              <Label htmlFor="payout-details" className="text-gray-300">
                Account Details
              </Label>
              <Input
                id="payout-details"
                value={payoutDetails}
                onChange={(e) => setPayoutDetails(e.target.value)}
                placeholder="e.g., email@example.com, account number"
                className="form-input-enhanced"
              />
            </div>
          </div>
          <Button
            onClick={savePayoutInfo}
            disabled={savingPayout || !payoutMethod || !payoutDetails}
            className="command-button"
          >
            {savingPayout ? 'Saving...' : 'Save Payout Info'}
          </Button>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              <strong>Payment Schedule:</strong> Affiliate payments are processed monthly on the 1st. 
              Minimum payout threshold is $50.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Tips */}
      <Card className="glass-panel border-gray-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Marketing Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Best Practices</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Share your personal experience with Control Room</li>
                <li>• Focus on the 7-day free trial (no risk for prospects)</li>
                <li>• Highlight the 50% lifetime commission structure</li>
                <li>• Target AI developers, consultants, and agencies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Marketing Channels</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Social media posts (LinkedIn, Twitter)</li>
                <li>• Blog articles and case studies</li>
                <li>• Email newsletters to your audience</li>
                <li>• Speaking at AI/tech conferences</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
