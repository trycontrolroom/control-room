'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  UserCheck,
  Crown,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

interface WorkspaceUser {
  id: string
  name?: string
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
  const [currentWorkspace, setCurrentWorkspace] = useState<{ id: string; name: string } | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    subscriptionRevenue: 0,
    marketplaceRevenue: 0,
    activeSubscriptions: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users')

  // Only redirect if NOT signed in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Once we're authenticated, load the admin data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchAdminData()
    }
  }, [status])

  async function fetchAdminData() {
    setLoading(true)
    try {
      // 1) fetch workspaces & currentWorkspace
      const workspacesRes = await fetch('/api/workspaces')
      if (!workspacesRes.ok) throw new Error('Failed to load workspaces')
      const { currentWorkspace: cw } = await workspacesRes.json()
      setCurrentWorkspace(cw)

      // 2) fetch revenue
      const revenueRes = await fetch('/api/admin/revenue')
      if (revenueRes.ok) {
        setRevenueData(await revenueRes.json())
      }

      // 3) fetch members
      if (cw) {
        const membersRes = await fetch(`/api/workspaces/members?workspaceId=${cw.id}`)
        if (membersRes.ok) {
          const members: any[] = await membersRes.json()
          setWorkspaceUsers(
            members.map(m => ({
              id: m.userId,
              membershipId: m.id,
              name: m.name,
              email: m.email,
              role: m.role,
              status: m.isActive ? 'ACTIVE' : 'INVITED',
              createdAt: m.joinedAt,
              lastLogin: m.lastLogin
            }))
          )
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleWorkspaceRoleChange(membershipId: string, newRole: string) {
    // simple guard: can't remove last ADMIN
    const adminCount = workspaceUsers.filter(u => u.role === 'ADMIN').length
    const me = workspaceUsers.find(u => u.membershipId === membershipId)
    if (me?.role === 'ADMIN' && adminCount === 1 && newRole !== 'ADMIN') {
      alert('Cannot remove the last ADMIN from the workspace')
      return
    }

    const res = await fetch(`/api/workspaces/members/${membershipId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    })
    if (res.ok) {
      fetchAdminData()
    } else {
      console.error('Failed to update role')
    }
  }

  function getBadgeClasses(role: string) {
    switch (role) {
      case 'ADMIN':   return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'MANAGER': return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
      case 'VIEWER':
      default:        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  // while we wait:
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
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Workspace Admin Panel</h1>
            <p className="text-gray-400 mt-1">Manage workspace users, revenue, and settings</p>
          </div>
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Administrator</span>
          </div>
        </div>

        {/* revenue overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="glass-panel border-green-500/20">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-300">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${revenueData.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-blue-500/20">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-300">Monthly Revenue</CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${revenueData.monthlyRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-purple-500/20">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-300">Subscriptions</CardTitle>
              <Users className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${revenueData.subscriptionRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-yellow-500/20">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-300">Marketplace</CardTitle>
              <ShoppingCart className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${revenueData.marketplaceRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-indigo-500/20">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-300">Active Subs</CardTitle>
              <UserCheck className="w-4 h-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{revenueData.activeSubscriptions}</div>
            </CardContent>
          </Card>
        </div>

        {/* tabs */}
        <Card className="glass-panel border-blue-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-white">
                  {currentWorkspace
                    ? `${currentWorkspace.name} – Workspace Management`
                    : 'Workspace Management'}
                </CardTitle>
              </div>
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
                : 'Configure workspace settings and preferences'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === 'users' ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {workspaceUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No workspace users found.
                  </div>
                ) : (
                  workspaceUsers.map(u => (
                    <div
                      key={u.membershipId}
                      className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-white">{u.name || u.email}</span>
                          <Badge className={getBadgeClasses(u.role)}>{u.role}</Badge>
                          <Badge
                            className={
                              u.status === 'ACTIVE'
                                ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                            }
                          >
                            {u.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{u.email}</p>
                        <div className="flex space-x-4 text-xs text-gray-500">
                          <span>Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                          {u.lastLogin && (
                            <span>Last Login: {new Date(u.lastLogin).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={u.role}
                          onValueChange={val => handleWorkspaceRoleChange(u.membershipId, val)}
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
            ) : (
              <div className="text-center py-8 text-gray-400">
                Workspace settings configuration coming soon…
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}