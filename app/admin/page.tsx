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

interface WorkspaceUser {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'VIEWER'
  status: 'ACTIVE' | 'INVITED'
  createdAt: string
  lastLogin?: string
  membershipId: string
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
  const [workspaceUsers, setWorkspaceUsers] = useState<WorkspaceUser[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(null)
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    subscriptionRevenue: 0,
    marketplaceRevenue: 0,
    activeSubscriptions: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')

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
      const [workspacesRes, revenueRes] = await Promise.all([
        fetch('/api/workspaces'),
        fetch('/api/admin/revenue')
      ])

      if (workspacesRes.ok) {
        const workspaceData = await workspacesRes.json()
        setCurrentWorkspace(workspaceData.currentWorkspace)
        
        // Fetch workspace members if we have a current workspace
        if (workspaceData.currentWorkspace) {
          const membersRes = await fetch(`/api/workspaces/members?workspaceId=${workspaceData.currentWorkspace.id}`)
          if (membersRes.ok) {
            const membersData = await membersRes.json()
            const transformedMembers = membersData.map((member: any) => ({
              id: member.userId,
              membershipId: member.id,
              name: member.name,
              email: member.email,
              role: member.role,
              status: member.isActive ? 'ACTIVE' : 'INVITED',
              createdAt: member.joinedAt,
              lastLogin: member.lastLogin
            }))
            setWorkspaceUsers(transformedMembers)
          }
        }
      }

      if (revenueRes.ok) {
        const revenue = await revenueRes.json()
        setRevenueData(revenue)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkspaceRoleChange = async (membershipId: string, newRole: string) => {
    const adminCount = workspaceUsers.filter(user => user.role === 'ADMIN').length
    const currentUser = workspaceUsers.find(user => user.membershipId === membershipId)
    
    if (currentUser?.role === 'ADMIN' && adminCount === 1 && newRole !== 'ADMIN') {
      alert('Cannot remove the last ADMIN from the workspace')
      return
    }

    try {
      const response = await fetch(`/api/workspaces/members/${membershipId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        fetchAdminData()
      } else {
        console.error('Failed to update workspace role')
      }
    } catch (error) {
      console.error('Failed to update workspace role:', error)
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
            <h1 className="text-3xl font-bold text-white">Workspace Admin Panel</h1>
            <p className="text-gray-400 mt-1">
              Manage workspace users, revenue, and settings
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

        {/* Workspace Management Tabs */}
        <Card className="glass-panel border-blue-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-white">
                  {currentWorkspace ? `${currentWorkspace.name} - Workspace Management` : 'Workspace Management'}
                </CardTitle>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
                <Button
                  variant={activeTab === 'users' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('users')}
                  className={activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}
                >
                  Workspace Users
                </Button>
                <Button
                  variant={activeTab === 'settings' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('settings')}
                  className={activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}
                >
                  Settings
                </Button>
              </div>
            </div>
            <CardDescription className="text-gray-400">
              {activeTab === 'users' 
                ? 'Manage user roles and permissions within this workspace'
                : 'Configure workspace settings and preferences'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === 'users' && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {workspaceUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No workspace users found. Make sure you have an active workspace selected.
                  </div>
                ) : (
                  workspaceUsers.map((user) => (
                    <div key={user.membershipId} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-white">{user.name || user.email}</span>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge className={user.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'}>
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <div className="flex space-x-4 text-xs text-gray-500">
                          <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                          {user.lastLogin && (
                            <span>Last Login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={user.role} 
                          onValueChange={(value) => handleWorkspaceRoleChange(user.membershipId, value)}
                        >
                          <SelectTrigger className="w-32 bg-gray-800/50 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VIEWER">Viewer</SelectItem>
                            <SelectItem value="MANAGER">Manager</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-400">
                  Workspace settings configuration coming soon...
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  )
}
