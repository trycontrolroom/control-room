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
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  User,
  Shield,
  Building,
  CreditCard,
  Bell,
  Bot,
  Key,
  DollarSign,
  AlertTriangle,
  Download,
  Trash2,
  LogOut,
  Copy,
  Eye,
  EyeOff,
  UserPlus,
  Users,
  Crown,
  Settings,
  Clock,
  FileText,
  ExternalLink,
  Save,
  Loader2
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  subscriptionPlan: string
  apiKey?: string
  avatar?: string
}

interface WorkspaceData {
  id: string
  name: string
  description: string
  members: WorkspaceMember[]
  apiKey?: string
}

interface WorkspaceMember {
  id: string
  name: string
  email: string
  role: string
  joinedAt: string
  lastActive: string
}

interface SubscriptionUsage {
  agentsCount: number
  policiesCount: number
  metricsCount: number
  helperExecutionsToday: number
  limits: {
    agents: number
    policies: number
    metrics: number
    helperExecutions: number
  }
}

interface NotificationSettings {
  email: boolean
  inApp: boolean
  policyViolations: boolean
  agentFailures: boolean
  billingEvents: boolean
  emailAddress?: string
}

interface AffiliateData {
  isAffiliate: boolean
  referralLink?: string
  stats?: {
    clicks: number
    conversions: number
    earnings: number
  }
  payoutMethod?: string
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('account')
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null)
  const [subscriptionUsage, setSubscriptionUsage] = useState<SubscriptionUsage | null>(null)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    inApp: true,
    policyViolations: true,
    agentFailures: true,
    billingEvents: true
  })
  const [affiliateData, setAffiliateData] = useState<AffiliateData>({ isAffiliate: false })
  
  const [showApiKey, setShowApiKey] = useState(false)
  const [showWorkspaceApiKey, setShowWorkspaceApiKey] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('VIEWER')
  const [sendingInvite, setSendingInvite] = useState(false)
  const [aiHelperMode, setAiHelperMode] = useState('explain')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchAllData()
    }
  }, [status, router])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        fetchUserProfile(),
        fetchWorkspaceData(),
        fetchSubscriptionUsage(),
        fetchNotificationSettings(),
        fetchAffiliateData()
      ])
    } catch (error) {
      console.error('Failed to fetch settings data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  const fetchWorkspaceData = async () => {
    try {
      const response = await fetch('/api/workspace/current')
      if (response.ok) {
        const data = await response.json()
        setWorkspaceData(data)
      }
    } catch (error) {
      console.error('Failed to fetch workspace data:', error)
    }
  }

  const fetchSubscriptionUsage = async () => {
    try {
      const response = await fetch('/api/usage/check')
      if (response.ok) {
        const data = await response.json()
        setSubscriptionUsage(data)
      }
    } catch (error) {
      console.error('Failed to fetch subscription usage:', error)
    }
  }

  const fetchNotificationSettings = async () => {
    try {
      const response = await fetch('/api/user/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Failed to fetch notification settings:', error)
    }
  }

  const fetchAffiliateData = async () => {
    try {
      const response = await fetch('/api/affiliate/status')
      if (response.ok) {
        const data = await response.json()
        setAffiliateData(data)
      }
    } catch (error) {
      console.error('Failed to fetch affiliate data:', error)
    }
  }

  const handleGenerateApiKey = async () => {
    try {
      const response = await fetch('/api/user/api-key', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        setUserProfile(prev => prev ? { ...prev, apiKey: data.apiKey } : null)
      }
    } catch (error) {
      console.error('Failed to generate API key:', error)
    }
  }

  const handleGenerateWorkspaceApiKey = async () => {
    if (!workspaceData || session?.user?.role !== 'ADMIN') return
    
    try {
      const response = await fetch('/api/workspace/api-key', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        setWorkspaceData(prev => prev ? { ...prev, apiKey: data.apiKey } : null)
      }
    } catch (error) {
      console.error('Failed to generate workspace API key:', error)
    }
  }

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !workspaceData) return
    
    try {
      setSendingInvite(true)
      const response = await fetch('/api/workspace/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })

      if (response.ok) {
        setInviteEmail('')
        setInviteRole('VIEWER')
        await fetchWorkspaceData()
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        await fetchWorkspaceData()
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
        await fetchWorkspaceData()
      }
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) return
    
    try {
      setChangingPassword(true)
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      })

      if (response.ok) {
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      console.error('Failed to change password:', error)
    } finally {
      setChangingPassword(false)
    }
  }

  const handleUpdateNotifications = async (updates: Partial<NotificationSettings>) => {
    try {
      const newSettings = { ...notifications, ...updates }
      setNotifications(newSettings)
      
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      })

      if (!response.ok) {
        setNotifications(notifications)
      }
    } catch (error) {
      console.error('Failed to update notifications:', error)
      setNotifications(notifications)
    }
  }

  const handleClearAiHistory = async () => {
    try {
      const response = await fetch('/api/ai-helper/clear-history', { method: 'POST' })
      if (response.ok) {
        console.log('AI chat history cleared')
      }
    } catch (error) {
      console.error('Failed to clear AI history:', error)
    }
  }

  const handleDownloadAuditLogs = async () => {
    try {
      const response = await fetch('/api/audit-logs/export?format=csv&days=30', {
        method: 'GET'
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
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const isAdmin = session?.user?.role === 'ADMIN'
  const isManager = session?.user?.role === 'MANAGER' || isAdmin

  const sections = [
    { id: 'account', label: 'Account & Security', icon: User },
    { id: 'workspace', label: 'Workspace Management', icon: Building },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ai-helper', label: 'AI Helper & Privacy', icon: Bot },
    { id: 'api', label: 'API & Integrations', icon: Key },
    ...(affiliateData.isAffiliate ? [{ id: 'affiliate', label: 'Affiliate', icon: DollarSign }] : []),
    ...(isAdmin ? [{ id: 'audit', label: 'Audit & Logs', icon: FileText }] : []),
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
  ]

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </DashboardLayout>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return (
          <Card className="settings-card blue">
            <CardHeader>
              <div className="card-header-content">
                <User className="card-icon blue" />
                <CardTitle className="card-title">Account & Security</CardTitle>
              </div>
              <CardDescription className="card-description">
                Manage your profile, security settings, and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Profile Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Name</Label>
                    <Input
                      id="name"
                      value={userProfile?.name || ''}
                      onChange={(e) => setUserProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="form-input-enhanced"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Email</Label>
                    <Input
                      value={userProfile?.email || ''}
                      disabled
                      className="bg-gray-800/30 border-gray-600 text-gray-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Role</Label>
                    <div className="flex items-center space-x-2">
                      <Badge variant={userProfile?.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {userProfile?.role === 'ADMIN' && <Crown className="w-3 h-3 mr-1" />}
                        {userProfile?.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Subscription Plan</Label>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {userProfile?.subscriptionPlan}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* API Key */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">API Access</h4>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Personal API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value={userProfile?.apiKey || 'No API key generated'}
                      disabled
                      className="form-input-enhanced flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="border-gray-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    {userProfile?.apiKey && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(userProfile.apiKey || '')}
                        className="border-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleGenerateApiKey}
                      className="command-button"
                      size="sm"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      {userProfile?.apiKey ? 'Regenerate' : 'Generate'} API Key
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Password Change */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Change Password</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="form-input-enhanced"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-input-enhanced"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleChangePassword}
                  disabled={!newPassword || newPassword !== confirmPassword || changingPassword}
                  className="command-button"
                >
                  {changingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                  Change Password
                </Button>
              </div>

              <Separator className="bg-gray-700" />

              {/* Logout */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={() => router.push('/api/auth/signout')}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'workspace':
        return (
          <Card className="settings-card purple">
            <CardHeader>
              <div className="card-header-content">
                <Building className="card-icon purple" />
                <CardTitle className="card-title">Workspace Management</CardTitle>
              </div>
              <CardDescription className="card-description">
                Manage workspace settings, members, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Workspace */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Current Workspace</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="workspaceName" className="text-gray-300">Workspace Name</Label>
                  <Input
                    id="workspaceName"
                    value={workspaceData?.name || ''}
                    onChange={(e) => setWorkspaceData(prev => prev ? { ...prev, name: e.target.value } : null)}
                    disabled={!isManager}
                    className="form-input-enhanced"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workspaceDescription" className="text-gray-300">Description</Label>
                  <Textarea
                    id="workspaceDescription"
                    value={workspaceData?.description || ''}
                    onChange={(e) => setWorkspaceData(prev => prev ? { ...prev, description: e.target.value } : null)}
                    disabled={!isManager}
                    className="form-input-enhanced"
                    rows={3}
                  />
                </div>
              </div>

              {isAdmin && (
                <>
                  <Separator className="bg-gray-700" />

                  {/* Workspace API Key */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-300">Workspace API Access</h4>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300">Workspace API Key</Label>
                      <div className="flex space-x-2">
                        <Input
                          type={showWorkspaceApiKey ? 'text' : 'password'}
                          value={workspaceData?.apiKey || 'No API key generated'}
                          disabled
                          className="form-input-enhanced flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowWorkspaceApiKey(!showWorkspaceApiKey)}
                          className="border-gray-600"
                        >
                          {showWorkspaceApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        {workspaceData?.apiKey && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(workspaceData.apiKey || '')}
                            className="border-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <Button
                        onClick={handleGenerateWorkspaceApiKey}
                        className="command-button"
                        size="sm"
                      >
                        <Key className="w-4 h-4 mr-2" />
                        {workspaceData?.apiKey ? 'Regenerate' : 'Generate'} Workspace API Key
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <Separator className="bg-gray-700" />

              {/* Team Members */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-300">Team Members</h4>
                  {isManager && (
                    <Badge variant="secondary" className="text-xs">
                      {workspaceData?.members?.length || 0} members
                    </Badge>
                  )}
                </div>

                {isManager && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      placeholder="Email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="form-input-enhanced"
                    />
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger className="form-input-enhanced">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="VIEWER" className="text-white hover:bg-gray-700">Viewer</SelectItem>
                        <SelectItem value="MANAGER" className="text-white hover:bg-gray-700">Manager</SelectItem>
                        {isAdmin && <SelectItem value="ADMIN" className="text-white hover:bg-gray-700">Admin</SelectItem>}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleInviteMember}
                      disabled={!inviteEmail || sendingInvite}
                      className="command-button"
                    >
                      {sendingInvite ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                      Invite
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  {workspaceData?.members?.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-gray-400 text-sm">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={member.role === 'ADMIN' ? 'default' : 'secondary'}>
                          {member.role === 'ADMIN' && <Crown className="w-3 h-3 mr-1" />}
                          {member.role}
                        </Badge>
                        {isAdmin && member.id !== session?.user?.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'billing':
        return (
          <Card className="glass-panel border-green-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-green-400" />
                <CardTitle className="text-white">Billing & Plan</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Manage your subscription, usage, and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Current Plan</h4>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded border border-gray-600">
                  <div>
                    <p className="text-white font-medium">{userProfile?.subscriptionPlan} Plan</p>
                    <p className="text-gray-400 text-sm">Active subscription</p>
                  </div>
                  <Button className="command-button">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Button>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Usage Statistics */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Usage This Month</h4>
                
                {subscriptionUsage && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Agents</span>
                        <span className="text-white">{subscriptionUsage.agentsCount} / {subscriptionUsage.limits.agents}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((subscriptionUsage.agentsCount / subscriptionUsage.limits.agents) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Policies</span>
                        <span className="text-white">{subscriptionUsage.policiesCount} / {subscriptionUsage.limits.policies}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((subscriptionUsage.policiesCount / subscriptionUsage.limits.policies) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Custom Metrics</span>
                        <span className="text-white">{subscriptionUsage.metricsCount} / {subscriptionUsage.limits.metrics}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((subscriptionUsage.metricsCount / subscriptionUsage.limits.metrics) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">AI Helper Executions</span>
                        <span className="text-white">{subscriptionUsage.helperExecutionsToday} / {subscriptionUsage.limits.helperExecutions}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((subscriptionUsage.helperExecutionsToday / subscriptionUsage.limits.helperExecutions) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case 'notifications':
        return (
          <Card className="glass-panel border-yellow-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-yellow-400" />
                <CardTitle className="text-white">Notifications</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Configure how you receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Notification Preferences</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Email Notifications</Label>
                    <p className="text-xs text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleUpdateNotifications({ email: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">In-App Notifications</Label>
                    <p className="text-xs text-gray-500">Show notifications in the dashboard</p>
                  </div>
                  <Switch
                    checked={notifications.inApp}
                    onCheckedChange={(checked) => handleUpdateNotifications({ inApp: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Policy Violations</Label>
                    <p className="text-xs text-gray-500">Alert when policies are violated</p>
                  </div>
                  <Switch
                    checked={notifications.policyViolations}
                    onCheckedChange={(checked) => handleUpdateNotifications({ policyViolations: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Agent Failures</Label>
                    <p className="text-xs text-gray-500">Notify when agents fail or stop</p>
                  </div>
                  <Switch
                    checked={notifications.agentFailures}
                    onCheckedChange={(checked) => handleUpdateNotifications({ agentFailures: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Billing Events</Label>
                    <p className="text-xs text-gray-500">Updates about billing and subscriptions</p>
                  </div>
                  <Switch
                    checked={notifications.billingEvents}
                    onCheckedChange={(checked) => handleUpdateNotifications({ billingEvents: checked })}
                  />
                </div>
              </div>

              {notifications.email && (
                <>
                  <Separator className="bg-gray-700" />
                  <div className="space-y-2">
                    <Label htmlFor="notificationEmail" className="text-gray-300">Email Address</Label>
                    <Input
                      id="notificationEmail"
                      type="email"
                      value={notifications.emailAddress || session?.user?.email || ''}
                      onChange={(e) => handleUpdateNotifications({ emailAddress: e.target.value })}
                      placeholder="your@email.com"
                      className="form-input-enhanced"
                    />
                  </div>
                </>
              )}

              {isManager && (
                <>
                  <Separator className="bg-gray-700" />
                  <div className="space-y-2">
                    <Button className="command-button" size="sm">
                      <Bell className="w-4 h-4 mr-2" />
                      Test Notifications
                    </Button>
                    <p className="text-xs text-gray-500">Send a test notification to verify your settings</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )

      case 'ai-helper':
        return (
          <Card className="glass-panel border-cyan-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <CardTitle className="text-white">AI Helper & Privacy</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Configure AI assistant behavior and manage your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">AI Helper Mode</h4>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Operation Mode</Label>
                  <Select value={aiHelperMode} onValueChange={setAiHelperMode}>
                    <SelectTrigger className="form-input-enhanced">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="explain" className="text-white hover:bg-gray-700">Explain Only</SelectItem>
                      <SelectItem value="action" className="text-white hover:bg-gray-700">Allow Actions</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {aiHelperMode === 'explain' 
                      ? 'AI can only explain features and provide information'
                      : 'AI can perform actions like creating policies and metrics'
                    }
                  </p>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Data Management</h4>
                
                <div className="space-y-3">
                  <Button
                    onClick={handleClearAiHistory}
                    variant="outline"
                    className="w-full border-gray-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear AI Chat History
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full border-gray-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Chat History
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 p-3 bg-gray-800/30 rounded border border-gray-600">
                  <p className="font-medium text-gray-400 mb-1">Privacy Notice:</p>
                  <ul className="space-y-1">
                    <li>• Chat history is stored locally per workspace</li>
                    <li>• No sensitive data is sent to external AI services</li>
                    <li>• You can clear or export your data at any time</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'api':
        return (
          <Card className="glass-panel border-orange-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-orange-400" />
                <CardTitle className="text-white">API & Integrations</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Manage API access and third-party integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">API Endpoints</h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800/30 rounded border border-gray-600">
                    <p className="text-sm font-medium text-gray-300 mb-1">Base URL</p>
                    <code className="text-xs text-blue-400">https://api.control-room.ai/v1</code>
                  </div>
                  
                  <div className="p-3 bg-gray-800/30 rounded border border-gray-600">
                    <p className="text-sm font-medium text-gray-300 mb-1">Authentication</p>
                    <code className="text-xs text-blue-400">Authorization: Bearer YOUR_API_KEY</code>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Integrations</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/30 rounded border border-gray-600 opacity-50">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">GitHub</p>
                        <p className="text-gray-400 text-sm">Coming Soon</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Sync agents with GitHub repositories</p>
                  </div>
                  
                  <div className="p-4 bg-gray-800/30 rounded border border-gray-600 opacity-50">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Slack</p>
                        <p className="text-gray-400 text-sm">Coming Soon</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Receive notifications in Slack</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'affiliate':
        return affiliateData.isAffiliate ? (
          <Card className="glass-panel border-green-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <CardTitle className="text-white">Affiliate Program</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Manage your affiliate account and track earnings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Referral Link</h4>
                
                <div className="flex space-x-2">
                  <Input
                    value={affiliateData.referralLink || ''}
                    disabled
                    className="form-input-enhanced flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(affiliateData.referralLink || '')}
                    className="border-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {affiliateData.stats && (
                <>
                  <Separator className="bg-gray-700" />
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-300">Performance</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-800/30 rounded border border-gray-600">
                        <p className="text-2xl font-bold text-green-400">{affiliateData.stats.clicks}</p>
                        <p className="text-sm text-gray-400">Total Clicks</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-800/30 rounded border border-gray-600">
                        <p className="text-2xl font-bold text-blue-400">{affiliateData.stats.conversions}</p>
                        <p className="text-sm text-gray-400">Conversions</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-800/30 rounded border border-gray-600">
                        <p className="text-2xl font-bold text-yellow-400">${affiliateData.stats.earnings}</p>
                        <p className="text-sm text-gray-400">Total Earnings</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator className="bg-gray-700" />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Payout Method</h4>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Current Method</Label>
                  <p className="text-white">{affiliateData.payoutMethod || 'Not configured'}</p>
                </div>
                
                <Button className="command-button" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Payout Method
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null

      case 'audit':
        return isAdmin ? (
          <Card className="glass-panel border-purple-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-white">Audit & Logs</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                View and export workspace activity logs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Audit Logs</h4>
                
                <div className="space-y-3">
                  <Button
                    onClick={handleDownloadAuditLogs}
                    className="w-full command-button"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Last 30 Days (CSV)
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full border-gray-600"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Audit Log Viewer
                  </Button>
                </div>
                
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
        ) : null

      case 'danger':
        return (
          <Card className="glass-panel border-red-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <CardTitle className="text-white">Danger Zone</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {isAdmin ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300">Workspace Actions</h4>
                    
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Delete Workspace</p>
                          <p className="text-gray-400 text-sm">Permanently delete this workspace and all its data</p>
                        </div>
                        <Button
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300">Workspace Actions</h4>
                    
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Leave Workspace</p>
                          <p className="text-gray-400 text-sm">Remove yourself from this workspace</p>
                        </div>
                        <Button
                          variant="outline"
                          className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Leave
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Separator className="bg-gray-700" />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-300">Account Actions</h4>
                  
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Delete Account</p>
                        <p className="text-gray-400 text-sm">Permanently delete your account and all associated data</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-1">
              Configure your account, workspace, and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-panel border-gray-500/20">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{section.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {renderSection()}
          </div>
        </div>
      </div>
    </DashboardLayout>
    
    <style jsx>{`
      .settings-card {
        background: linear-gradient(180deg, rgba(14,20,36,.85), rgba(10,14,26,.98));
        border-radius: 24px;
        box-shadow: 0 34px 90px rgba(0,0,0,.55), 0 6px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
        backdrop-filter: blur(24px);
      }

      .settings-card.blue {
        border: 1px solid rgba(79, 106, 255, 0.2);
      }

      .settings-card.purple {
        border: 1px solid rgba(147, 51, 234, 0.2);
      }

      .settings-card.green {
        border: 1px solid rgba(34, 197, 94, 0.2);
      }

      .settings-card.cyan {
        border: 1px solid rgba(6, 182, 212, 0.2);
      }

      .settings-card.orange {
        border: 1px solid rgba(251, 146, 60, 0.2);
      }

      .card-header-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .card-icon {
        width: 1.25rem;
        height: 1.25rem;
      }

      .card-icon.blue {
        color: #4F6AFF;
      }

      .card-icon.purple {
        color: #9333ea;
      }

      .card-icon.green {
        color: #22c55e;
      }

      .card-icon.cyan {
        color: #06b6d4;
      }

      .card-icon.orange {
        color: #fb923c;
      }

      .card-title {
        color: #FFFFFF;
      }

      .card-description {
        color: #8a96ad;
      }

      .action-button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        height: 2.5rem;
        border-radius: 12px;
        font-weight: 600;
        padding: 0 1rem;
        transition: all 0.2s ease;
        text-decoration: none;
      }

      .action-button.primary {
        background: linear-gradient(135deg, #8A7FFF, #4F6AFF);
        border: none;
        color: #FFFFFF;
        box-shadow: 0 8px 20px rgba(79,106,255,.25);
      }

      .action-button.primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 30px rgba(79,106,255,.35);
      }

      .button-icon {
        width: 1rem;
        height: 1rem;
      }
    `}</style>
  )
}
