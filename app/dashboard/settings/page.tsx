'use client'

import { Plus } from "lucide-react";
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
  CreditCard,
  Building,
  Settings,
  Users,
  Bot,
  Crown,
  UserPlus,
  Clock,
  Palette,
  Globe,
  Zap
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
  workspace: {
    name: string
    description: string
    timezone: string
    defaultAgentTimeout: number
    autoScaling: boolean
    maxConcurrentAgents: number
  }
  userPreferences: {
    theme: string
    language: string
    dateFormat: string
    dashboardRefreshRate: number
    compactMode: boolean
    showAdvancedMetrics: boolean
    enableSounds: boolean
    enableAnimations: boolean
  }
  agentDefaults: {
    defaultMemoryLimit: number
    defaultCpuLimit: number
    defaultTimeout: number
    autoRestart: boolean
    logLevel: string
    retryAttempts: number
    healthCheckInterval: number
  }
}

interface WorkspaceMember {
  id: string
  name: string
  email: string
  role: string
  joinedAt: string
  lastActive: string
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
    },
    workspace: {
      name: 'Default Workspace',
      description: '',
      timezone: 'UTC',
      defaultAgentTimeout: 300,
      autoScaling: true,
      maxConcurrentAgents: 10
    },
    userPreferences: {
      theme: 'dark',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      dashboardRefreshRate: 5,
      compactMode: false,
      showAdvancedMetrics: false,
      enableSounds: true,
      enableAnimations: true
    },
    agentDefaults: {
      defaultMemoryLimit: 512,
      defaultCpuLimit: 1,
      defaultTimeout: 300,
      autoRestart: true,
      logLevel: 'info',
      retryAttempts: 3,
      healthCheckInterval: 30
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('VIEWER')
  const [sendingInvite, setSendingInvite] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchSettings()
      fetchWorkspaceMembers()
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

  const updateWorkspace = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      workspace: {
        ...prev.workspace,
        [key]: value
      }
    }))
  }

  const updateUserPreferences = async (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        [key]: value
      }
    }))

    if (key === 'theme') {
      try {
        const root = document.documentElement
        if (value === 'light') {
          root.classList.remove('dark')
          root.classList.add('light')
        } else if (value === 'dark') {
          root.classList.remove('light')
          root.classList.add('dark')
        } else if (value === 'auto') {
          root.classList.remove('light', 'dark')
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          root.classList.add(prefersDark ? 'dark' : 'light')
        }

        await fetch('/api/user/preferences', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme: value })
        })
      } catch (error) {
        console.error('Failed to update theme preference:', error)
      }
    }
  }

  const updateAgentDefaults = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      agentDefaults: {
        ...prev.agentDefaults,
        [key]: value
      }
    }))
  }

  const fetchWorkspaceMembers = async () => {
    try {
      setLoadingMembers(true)
      const response = await fetch('/api/workspace/members')
      if (response.ok) {
        const data = await response.json()
        setWorkspaceMembers(data)
      }
    } catch (error) {
      console.error('Failed to fetch workspace members:', error)
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return
    
    try {
      setSendingInvite(true)
      const response = await fetch('/api/workspace/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole
        }),
      })

      if (response.ok) {
        setInviteEmail('')
        setInviteRole('VIEWER')
        fetchWorkspaceMembers()
      }
    } catch (error) {
      console.error('Failed to send invite:', error)
    } finally {
      setSendingInvite(false)
    }
  }

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/workspace/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        fetchWorkspaceMembers()
      }
    } catch (error) {
      console.error('Failed to update member role:', error)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/workspace/members/${memberId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchWorkspaceMembers()
      }
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
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
          {/* User Preferences */}
          <Card className="glass-panel border-purple-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-white">User Preferences</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Customize your dashboard experience and interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    Theme
                  </Label>
                  <Select 
                    value={settings.userPreferences.theme} 
                    onValueChange={(value) => updateUserPreferences('theme', value)}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="dark" className="text-white hover:bg-gray-700">Dark (Military)</SelectItem>
                      <SelectItem value="light" className="text-white hover:bg-gray-700">Light</SelectItem>
                      <SelectItem value="auto" className="text-white hover:bg-gray-700">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Language
                  </Label>
                  <Select 
                    value={settings.userPreferences.language} 
                    onValueChange={(value) => updateUserPreferences('language', value)}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="en" className="text-white hover:bg-gray-700">English</SelectItem>
                      <SelectItem value="es" className="text-white hover:bg-gray-700">Spanish</SelectItem>
                      <SelectItem value="fr" className="text-white hover:bg-gray-700">French</SelectItem>
                      <SelectItem value="de" className="text-white hover:bg-gray-700">German</SelectItem>
                      <SelectItem value="ja" className="text-white hover:bg-gray-700">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Date Format</Label>
                  <Select 
                    value={settings.userPreferences.dateFormat} 
                    onValueChange={(value) => updateUserPreferences('dateFormat', value)}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="MM/DD/YYYY" className="text-white hover:bg-gray-700">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY" className="text-white hover:bg-gray-700">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD" className="text-white hover:bg-gray-700">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refreshRate" className="text-gray-300 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Refresh Rate (seconds)
                  </Label>
                  <Input
                    id="refreshRate"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.userPreferences.dashboardRefreshRate}
                    onChange={(e) => updateUserPreferences('dashboardRefreshRate', parseInt(e.target.value))}
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Interface Options</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Compact Mode</Label>
                    <p className="text-xs text-gray-500">Reduce spacing and padding for more content</p>
                  </div>
                  <Switch
                    checked={settings.userPreferences.compactMode}
                    onCheckedChange={(checked) => updateUserPreferences('compactMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Advanced Metrics</Label>
                    <p className="text-xs text-gray-500">Show detailed performance metrics</p>
                  </div>
                  <Switch
                    checked={settings.userPreferences.showAdvancedMetrics}
                    onCheckedChange={(checked) => updateUserPreferences('showAdvancedMetrics', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Sound Effects</Label>
                    <p className="text-xs text-gray-500">Play sounds for notifications and alerts</p>
                  </div>
                  <Switch
                    checked={settings.userPreferences.enableSounds}
                    onCheckedChange={(checked) => updateUserPreferences('enableSounds', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Animations</Label>
                    <p className="text-xs text-gray-500">Enable smooth transitions and animations</p>
                  </div>
                  <Switch
                    checked={settings.userPreferences.enableAnimations}
                    onCheckedChange={(checked) => updateUserPreferences('enableAnimations', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
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

          {/* Agent Defaults */}
          <Card className="glass-panel border-orange-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-orange-400" />
                <CardTitle className="text-white">Agent Defaults</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Set default configuration for new agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultMemoryLimit" className="text-gray-300">
                    Memory Limit (MB)
                  </Label>
                  <Input
                    id="defaultMemoryLimit"
                    type="number"
                    value={settings.agentDefaults.defaultMemoryLimit}
                    onChange={(e) => updateAgentDefaults('defaultMemoryLimit', parseInt(e.target.value))}
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultCpuLimit" className="text-gray-300">
                    CPU Limit (cores)
                  </Label>
                  <Input
                    id="defaultCpuLimit"
                    type="number"
                    step="0.1"
                    value={settings.agentDefaults.defaultCpuLimit}
                    onChange={(e) => updateAgentDefaults('defaultCpuLimit', parseFloat(e.target.value))}
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultTimeout" className="text-gray-300 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Timeout (seconds)
                  </Label>
                  <Input
                    id="defaultTimeout"
                    type="number"
                    value={settings.agentDefaults.defaultTimeout}
                    onChange={(e) => updateAgentDefaults('defaultTimeout', parseInt(e.target.value))}
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retryAttempts" className="text-gray-300">
                    Retry Attempts
                  </Label>
                  <Input
                    id="retryAttempts"
                    type="number"
                    min="0"
                    max="10"
                    value={settings.agentDefaults.retryAttempts}
                    onChange={(e) => updateAgentDefaults('retryAttempts', parseInt(e.target.value))}
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Log Level</Label>
                  <Select 
                    value={settings.agentDefaults.logLevel} 
                    onValueChange={(value) => updateAgentDefaults('logLevel', value)}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="debug" className="text-white hover:bg-gray-700">Debug</SelectItem>
                      <SelectItem value="info" className="text-white hover:bg-gray-700">Info</SelectItem>
                      <SelectItem value="warn" className="text-white hover:bg-gray-700">Warning</SelectItem>
                      <SelectItem value="error" className="text-white hover:bg-gray-700">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthCheckInterval" className="text-gray-300">
                    Health Check Interval (seconds)
                  </Label>
                  <Input
                    id="healthCheckInterval"
                    type="number"
                    min="10"
                    max="300"
                    value={settings.agentDefaults.healthCheckInterval}
                    onChange={(e) => updateAgentDefaults('healthCheckInterval', parseInt(e.target.value))}
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-300">Auto-Restart on Failure</Label>
                  <p className="text-xs text-gray-500">Automatically restart agents when they fail</p>
                </div>
                <Switch
                  checked={settings.agentDefaults.autoRestart}
                  onCheckedChange={(checked) => updateAgentDefaults('autoRestart', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs */}
          <Card className="glass-panel border-purple-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-white">Audit Logs</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Download workspace activity logs and audit trails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Download Period</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="bg-gray-800/50 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="7" className="text-white hover:bg-gray-700">Last 7 days</SelectItem>
                    <SelectItem value="30" className="text-white hover:bg-gray-700">Last 30 days</SelectItem>
                    <SelectItem value="90" className="text-white hover:bg-gray-700">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/audit-logs/download', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ days: 30 })
                      })
                      if (response.ok) {
                        const blob = await response.blob()
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
                        document.body.appendChild(a)
                        a.click()
                        window.URL.revokeObjectURL(url)
                        document.body.removeChild(a)
                      }
                    } catch (error) {
                      console.error('Failed to download audit logs:', error)
                    }
                  }}
                  className="w-full command-button"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Download Audit Logs
                </Button>
                
                <div className="text-xs text-gray-500 p-3 bg-gray-800/30 rounded border border-gray-600">
                  <p className="font-medium text-gray-400 mb-1">Audit logs include:</p>
                  <ul className="space-y-1">
                    <li>• User login/logout events</li>
                    <li>• Agent creation, modification, and deletion</li>
                    <li>• Policy changes and deployments</li>
                    <li>• Workspace member changes</li>
                    <li>• Billing and subscription events</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}