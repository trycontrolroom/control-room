'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  DollarSign, 
  Bell, 
  Shield, 
  Smartphone, 
  Mail, 
  MessageSquare,
  AlertTriangle,
  Save,
  User,
  CreditCard
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

interface Settings {
  spendingLimits: {
    monthlyCapPerAgent: number
    alertThreshold80: boolean
    alertThreshold100: boolean
    autoPauseOnBreach: boolean
  }
  notifications: {
    email: boolean
    sms: boolean
    slack: boolean
    slackWebhook: string
    emailAddress: string
    phoneNumber: string
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: number
  }
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<Settings>({
    spendingLimits: {
      monthlyCapPerAgent: 100,
      alertThreshold80: true,
      alertThreshold100: true,
      autoPauseOnBreach: true
    },
    notifications: {
      email: true,
      sms: false,
      slack: false,
      slackWebhook: '',
      emailAddress: '',
      phoneNumber: ''
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 24
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchSettings()
    }
  }, [status, router])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        console.log('Settings saved successfully')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateSpendingLimits = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      spendingLimits: {
        ...prev.spendingLimits,
        [key]: value
      }
    }))
  }

  const updateNotifications = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const updateSecurity = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }))
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-1">
              Configure your account preferences and security settings
            </p>
          </div>
          
          <Button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="command-button"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Firewall */}
          <Card className="glass-panel border-yellow-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <CardTitle className="text-white">Spending Firewall</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Set monthly spending limits and automatic controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monthlyCapPerAgent" className="text-gray-300">
                  Monthly Cap Per Agent ($)
                </Label>
                <Input
                  id="monthlyCapPerAgent"
                  type="number"
                  value={settings.spendingLimits.monthlyCapPerAgent}
                  onChange={(e) => updateSpendingLimits('monthlyCapPerAgent', parseFloat(e.target.value))}
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Alert Thresholds</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">80% Threshold Alert</Label>
                    <p className="text-xs text-gray-500">Get notified when spending reaches 80%</p>
                  </div>
                  <Switch
                    checked={settings.spendingLimits.alertThreshold80}
                    onCheckedChange={(checked) => updateSpendingLimits('alertThreshold80', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">100% Threshold Alert</Label>
                    <p className="text-xs text-gray-500">Get notified when spending reaches 100%</p>
                  </div>
                  <Switch
                    checked={settings.spendingLimits.alertThreshold100}
                    onCheckedChange={(checked) => updateSpendingLimits('alertThreshold100', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Auto-Pause on Breach</Label>
                    <p className="text-xs text-gray-500">Automatically pause agents when limit is exceeded</p>
                  </div>
                  <Switch
                    checked={settings.spendingLimits.autoPauseOnBreach}
                    onCheckedChange={(checked) => updateSpendingLimits('autoPauseOnBreach', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass-panel border-blue-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-white">Notifications</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Configure how you receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Notification Channels</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <Label className="text-gray-300">Email Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateNotifications('email', checked)}
                  />
                </div>

                {settings.notifications.email && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="emailAddress" className="text-gray-300">Email Address</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      value={settings.notifications.emailAddress}
                      onChange={(e) => updateNotifications('emailAddress', e.target.value)}
                      placeholder={session?.user?.email || 'your@email.com'}
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    <Label className="text-gray-300">SMS Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) => updateNotifications('sms', checked)}
                  />
                </div>

                {settings.notifications.sms && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={settings.notifications.phoneNumber}
                      onChange={(e) => updateNotifications('phoneNumber', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <Label className="text-gray-300">Slack Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.slack}
                    onCheckedChange={(checked) => updateNotifications('slack', checked)}
                  />
                </div>

                {settings.notifications.slack && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="slackWebhook" className="text-gray-300">Slack Webhook URL</Label>
                    <Input
                      id="slackWebhook"
                      type="url"
                      value={settings.notifications.slackWebhook}
                      onChange={(e) => updateNotifications('slackWebhook', e.target.value)}
                      placeholder="https://hooks.slack.com/services/..."
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="glass-panel border-green-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <CardTitle className="text-white">Security</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-300">Two-Factor Authentication</Label>
                  <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={settings.security.twoFactorEnabled}
                  onCheckedChange={(checked) => updateSecurity('twoFactorEnabled', checked)}
                />
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className="text-gray-300">
                  Session Timeout (hours)
                </Label>
                <Select 
                  value={settings.security.sessionTimeout.toString()} 
                  onValueChange={(value) => updateSecurity('sessionTimeout', parseInt(value))}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="168">1 week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="glass-panel border-purple-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-white">Account Information</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                View and manage your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Name</Label>
                <div className="text-white">{session?.user?.name}</div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Email</Label>
                <div className="text-white">{session?.user?.email}</div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Role</Label>
                <div className="text-white">{session?.user?.role}</div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-3">
                <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700/50">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Billing
                </Button>
                <Button variant="outline" className="w-full border-red-500/50 hover:bg-red-500/10 text-red-400">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
