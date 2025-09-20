'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  ShoppingCart, 
  Settings,
  CheckCircle,
  XCircle,
  Code,
  Globe,
  AlertTriangle
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

interface MarketplaceSubmission {
  id: string
  name: string
  author: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  submittedAt: string
  price: number
  workspaceId: string
  workspaceName: string
}

interface SiteSettings {
  maintenanceMode: boolean
  newRegistrations: boolean
  marketplaceEnabled: boolean
  announcement: string
}

export default function DeveloperPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<MarketplaceSubmission[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    maintenanceMode: false,
    newRegistrations: true,
    marketplaceEnabled: true,
    announcement: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      if (session?.user?.email !== 'admin@control-room.ai') {
        router.push('/dashboard')
        return
      }
      
      fetchDeveloperData()
    }
  }, [status, router, session])

  const fetchDeveloperData = async () => {
    try {
      const [submissionsRes, settingsRes] = await Promise.all([
        fetch('/api/developer/marketplace-submissions'),
        fetch('/api/developer/settings')
      ])

      if (submissionsRes.ok) {
        const submissionData = await submissionsRes.json()
        setSubmissions(submissionData)
      }

      if (settingsRes.ok) {
        const settings = await settingsRes.json()
        setSiteSettings(settings)
      }
    } catch (error) {
      console.error('Failed to fetch developer data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmissionAction = async (submissionId: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/developer/marketplace-submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      })

      if (response.ok) {
        fetchDeveloperData()
      }
    } catch (error) {
      console.error('Failed to update submission:', error)
    }
  }

  const handleSiteSettingChange = async (setting: string, value: any) => {
    const newSettings = { ...siteSettings, [setting]: value }
    setSiteSettings(newSettings)

    try {
      await fetch('/api/developer/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      })
    } catch (error) {
      console.error('Failed to update site settings:', error)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'PENDING':
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
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
            <h1 className="text-3xl font-bold text-white">Developer Panel</h1>
            <p className="text-gray-400 mt-1">
              Global platform settings and marketplace management
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-medium">Platform Developer</span>
          </div>
        </div>

        {/* Global Marketplace Submissions */}
        <Card className="glass-panel border-purple-500/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-white">Global Marketplace Submissions</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Review and approve agent submissions from all workspaces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {submissions.map((submission) => (
                <div key={submission.id} className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-white">{submission.name}</h4>
                      <p className="text-sm text-gray-400">by {submission.author}</p>
                      <p className="text-xs text-gray-500">Workspace: {submission.workspaceName}</p>
                    </div>
                    <Badge className={getStatusBadgeColor(submission.status)}>
                      {submission.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      <span>Price: ${submission.price}</span>
                      <span className="ml-4">
                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {submission.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleSubmissionAction(submission.id, 'APPROVED')}
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSubmissionAction(submission.id, 'REJECTED')}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {submissions.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No pending submissions across all workspaces</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Global Platform Settings */}
        <Card className="glass-panel border-yellow-500/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-yellow-400" />
              <CardTitle className="text-white">Global Platform Settings</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Configure platform-wide settings and announcements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-gray-300 font-medium">Maintenance Mode</label>
                  <p className="text-xs text-gray-500">Temporarily disable the platform</p>
                </div>
                <Switch
                  checked={siteSettings.maintenanceMode}
                  onCheckedChange={(checked) => handleSiteSettingChange('maintenanceMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-gray-300 font-medium">New Registrations</label>
                  <p className="text-xs text-gray-500">Allow new user signups</p>
                </div>
                <Switch
                  checked={siteSettings.newRegistrations}
                  onCheckedChange={(checked) => handleSiteSettingChange('newRegistrations', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-gray-300 font-medium">Marketplace</label>
                  <p className="text-xs text-gray-500">Enable marketplace features</p>
                </div>
                <Switch
                  checked={siteSettings.marketplaceEnabled}
                  onCheckedChange={(checked) => handleSiteSettingChange('marketplaceEnabled', checked)}
                />
              </div>
            </div>

            <Separator className="bg-gray-700" />

            <div className="space-y-2">
              <label className="text-gray-300 font-medium">Global Site Announcement</label>
              <Input
                value={siteSettings.announcement}
                onChange={(e) => handleSiteSettingChange('announcement', e.target.value)}
                placeholder="Enter platform-wide announcement..."
                className="form-input-enhanced"
              />
              <p className="text-xs text-gray-500">
                This message will be displayed to all users across all workspaces
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Platform Statistics */}
        <Card className="glass-panel border-blue-500/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-white">Platform Statistics</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Overview of platform-wide metrics and health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">
                  {submissions.filter(s => s.status === 'PENDING').length}
                </div>
                <div className="text-sm text-gray-400">Pending Submissions</div>
              </div>
              
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">
                  {submissions.filter(s => s.status === 'APPROVED').length}
                </div>
                <div className="text-sm text-gray-400">Approved Agents</div>
              </div>
              
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">
                  {new Set(submissions.map(s => s.workspaceId)).size}
                </div>
                <div className="text-sm text-gray-400">Active Workspaces</div>
              </div>
              
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">
                  {siteSettings.maintenanceMode ? 'ON' : 'OFF'}
                </div>
                <div className="text-sm text-gray-400">Maintenance Mode</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
