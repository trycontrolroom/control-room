'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'VIEWER' | 'SELLER'
  createdAt: string
  lastLogin?: string
  isActive: boolean
}

interface MarketplaceSubmission {
  id: string
  name: string
  author: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  submittedAt: string
  price: number
}

interface RevenueData {
  totalRevenue: number
  monthlyRevenue: number
  subscriptionRevenue: number
  marketplaceRevenue: number
  activeSubscriptions: number
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [submissions, setSubmissions] = useState<MarketplaceSubmission[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    subscriptionRevenue: 0,
    marketplaceRevenue: 0,
    activeSubscriptions: 0
  })
  const [siteSettings, setSiteSettings] = useState({
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
      if (session?.user?.role !== 'ADMIN') {
        router.push('/dashboard')
        return
      }
      
      fetchAdminData()
    }
  }, [status, router, session])

  const fetchAdminData = async () => {
    try {
      const [usersRes, submissionsRes, revenueRes, settingsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/marketplace-submissions'),
        fetch('/api/admin/revenue'),
        fetch('/api/admin/settings')
      ])

      if (usersRes.ok) {
        const userData = await usersRes.json()
        setUsers(userData)
      }

      if (submissionsRes.ok) {
        const submissionData = await submissionsRes.json()
        setSubmissions(submissionData)
      }

      if (revenueRes.ok) {
        const revenue = await revenueRes.json()
        setRevenueData(revenue)
      }

      if (settingsRes.ok) {
        const settings = await settingsRes.json()
        setSiteSettings(settings)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        fetchAdminData()
      }
    } catch (error) {
      console.error('Failed to update user role:', error)
    }
  }

  const handleSubmissionAction = async (submissionId: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/admin/marketplace-submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      })

      if (response.ok) {
        fetchAdminData()
      }
    } catch (error) {
      console.error('Failed to update submission:', error)
    }
  }

  const handleSiteSettingChange = async (setting: string, value: any) => {
    const newSettings = { ...siteSettings, [setting]: value }
    setSiteSettings(newSettings)

    try {
      await fetch('/api/admin/settings', {
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'MANAGER':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
      case 'SELLER':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'VIEWER':
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
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
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 mt-1">
              Manage users, revenue, and platform settings
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Administrator</span>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="glass-panel border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${revenueData.totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${revenueData.monthlyRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${revenueData.subscriptionRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Marketplace</CardTitle>
              <ShoppingCart className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${revenueData.marketplaceRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-indigo-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Subs</CardTitle>
              <UserCheck className="h-4 w-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {revenueData.activeSubscriptions}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <Card className="glass-panel border-blue-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-white">User Management</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Manage user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white">{user.name}</span>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Select 
                        value={user.role} 
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-32 bg-gray-800/50 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VIEWER">Viewer</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="SELLER">Seller</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Marketplace Submissions */}
          <Card className="glass-panel border-purple-500/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-white">Marketplace Submissions</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Review and approve agent submissions
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
                    <p className="text-gray-400">No pending submissions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Site Settings */}
        <Card className="glass-panel border-yellow-500/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-yellow-400" />
              <CardTitle className="text-white">Site Settings</CardTitle>
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
              <label className="text-gray-300 font-medium">Site Announcement</label>
              <Input
                value={siteSettings.announcement}
                onChange={(e) => handleSiteSettingChange('announcement', e.target.value)}
                placeholder="Enter site-wide announcement..."
                className="bg-gray-800/50 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-500">
                This message will be displayed to all users at the top of the dashboard
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
