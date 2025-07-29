'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Shield,
  BarChart3,
  Settings,
  FileText,
  Users,
  ShoppingCart,
  LogOut,
  User,
  Activity,
  ChevronDown,
  Plus,
  Check,
  X,
  ArrowRight,
  DollarSign,
  Menu,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AIHelper } from '@/components/ai-helper'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface Workspace {
  id: string
  name: string
  memberCount: number
  role: string
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(false)
  const [triedLoading, setTriedLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formName, setFormName] = useState('')
  const [formError, setFormError] = useState('')

  const isAdmin = currentWorkspace?.role === 'ADMIN'
  const isDeveloper = session?.user?.email === 'admin@control-room.ai'
  const [isAffiliate, setIsAffiliate] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [helperAIOpen, setHelperAIOpen] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) return
    setLoading(true)
    fetch('/api/workspaces')
      .then(r => r.json())
      .then(data => {
        setWorkspaces(data.workspaces || [])
        setCurrentWorkspace(data.currentWorkspace || null)
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
        setTriedLoading(true)
      })
  }, [session?.user?.id])

  useEffect(() => {
    if (!session?.user?.id) return
    fetch('/api/affiliate/status')
      .then(r => r.json())
      .then(data => {
        setIsAffiliate(data.isApproved || false)
      })
      .catch(() => setIsAffiliate(false))
  }, [session?.user?.id])

  useEffect(() => {
    if (triedLoading && workspaces.length === 0) {
      setShowCreateModal(true)
    }
  }, [triedLoading, workspaces.length])

  const handleSwitch = async (workspaceId: string) => {
    try {
      const res = await fetch('/api/workspaces/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId })
      })
      if (!res.ok) throw await res.json()
      window.location.reload()
    } catch (err: any) {
      console.error('Switch failed:', err.error || err)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) {
      setFormError('Workspace name is required')
      return
    }
    setIsCreating(true)
    setFormError('')
    try {
      const createRes = await fetch('/api/workspaces/create', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name: formName.trim() })
      })
      if (!createRes.ok) throw await createRes.json()
      const { workspace } = await createRes.json()

      const switchRes = await fetch('/api/workspaces/switch', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ workspaceId: workspace.id })
      })
      if (!switchRes.ok) throw await switchRes.json()
      window.location.href = '/dashboard'
    } catch (err: any) {
      console.error('Create workflow failed:', err)
      setFormError(err.error || 'An unexpected error occurred')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`${
        helperAIOpen ? 'w-16' : (sidebarCollapsed ? 'w-0' : 'w-64')
      } bg-gray-900 text-gray-300 flex flex-col transition-all duration-300 overflow-hidden relative`}>
        {/* Arrow button when Helper AI is open */}
        {helperAIOpen && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setHelperAIOpen(false)
                setSidebarCollapsed(false)
              }}
              className="h-12 w-6 rounded-l-none border-gray-600 hover:bg-gray-700 bg-gray-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
        <div className="p-4 border-b border-gray-700">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">Control Room <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full ml-2">BETA</span></span>
          </Link>
        </div>
        {/* Workspace selector */}
        <div className="p-4 border-b border-gray-700 relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between p-2 bg-gray-800 rounded"
          >
            <span>{currentWorkspace?.name || 'Loading…'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute mt-2 w-full bg-gray-800 border border-gray-700 rounded shadow-lg z-20">
              {loading ? (
                <div className="p-2 text-center text-gray-400">Loading…</div>
              ) : (
                <>
                  {workspaces.map(ws => (
                    <button
                      key={ws.id}
                      onClick={() => handleSwitch(ws.id)}
                      className="w-full text-left p-2 hover:bg-gray-700 flex justify-between"
                    >
                      <span>{ws.name}</span>
                      {currentWorkspace?.id === ws.id && <Check className="w-4 h-4 text-green-400" />}
                    </button>
                  ))}
                  <div className="border-t border-gray-700">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="w-full text-left p-2 hover:bg-gray-700 text-blue-400"
                    >
                      <Plus className="inline-block w-4 h-4 mr-2" /> Create Workspace
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-2">
          {/* Main section */}
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center p-2 rounded',
              pathname === '/dashboard' ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
            )}
          >
            <Activity className="w-5 h-5 mr-2" />
            Manage
          </Link>
          
          {/* Divider */}
          <div className="border-t border-gray-700 my-4"></div>
          
          {/* Core features section */}
          {[
            { name: 'Create', href: '/dashboard/create', icon: Plus },
            { name: 'Stats', href: '/dashboard/stats', icon: BarChart3 },
            { name: 'Policies', href: '/dashboard/policies', icon: FileText },
          ].map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center p-2 rounded',
                  active ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
                )}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.name}
              </Link>
            )
          })}
          
          {/* Divider */}
          <div className="border-t border-gray-700 my-4"></div>
          
          {/* Admin section */}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center p-2 rounded',
                pathname.startsWith('/admin') ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
              )}
            >
              <Users className="w-5 h-5 mr-2" />
              Admin Panel
            </Link>
          )}
          
          {isDeveloper && (
            <Link
              href="/developer"
              className={cn(
                'flex items-center p-2 rounded',
                pathname.startsWith('/developer') ? 'bg-green-500 text-white' : 'hover:bg-gray-700'
              )}
            >
              <Shield className="w-5 h-5 mr-2" /> Developer Panel
            </Link>
          )}
        </nav>
        
        {/* Marketplace and Affiliate Dashboard above profile */}
        <div className="px-4 pb-4 space-y-2">
          {isAffiliate && (
            <Link
              href="/dashboard/affiliate"
              className={cn(
                'flex items-center p-2 rounded',
                pathname === '/dashboard/affiliate' ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
              )}
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Affiliate Dashboard
            </Link>
          )}
          <Link
            href="/marketplace"
            className={cn(
              'flex items-center p-2 rounded',
              pathname === '/marketplace' ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
            )}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Marketplace
          </Link>
        </div>
        {/* Profile and Settings */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center mb-3">
            <User className="w-8 h-8 rounded-full bg-gray-700 p-1 mr-2 text-white" />
            <div className="flex-1">
              <p className="text-white text-sm truncate">{session?.user?.name}</p>
              <p className="text-gray-400 text-xs truncate">
                {currentWorkspace?.role || session?.user?.role}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            className={cn(
              'flex items-center p-2 rounded w-full',
              pathname === '/dashboard/settings' ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
            )}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </div>
      </aside>
      {/* Helper AI Space - only visible when Helper AI is open */}
      {helperAIOpen && (
        <div className="w-64 bg-gray-800 flex flex-col transition-all duration-300">
          {/* This space will be filled by the Helper AI component */}
        </div>
      )}
      
      {/* Main */}
      <main className={`flex-1 bg-gray-800 flex flex-col transition-all duration-300 ${
        helperAIOpen ? 'ml-0' : ''
      }`}>
        {/* Top bar - only show when sidebar is collapsed and Helper AI is not open */}
        {sidebarCollapsed && !helperAIOpen && (
          <div className="bg-gray-900 border-b border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarCollapsed(false)}
                  className="border-gray-600 hover:bg-gray-700"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Page content */}
        <div className="flex-1 overflow-auto p-6">
          {React.isValidElement(children)
            ? React.cloneElement(children as React.ReactElement, {
                currentWorkspace,
                workspaces,
                isAdmin,
                session,
              })
            : children}
        </div>
      </main>
      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-30">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-white font-semibold">Create Workspace</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <Label htmlFor="ws-name" className="text-gray-300">Name *</Label>
                <Input
                  id="ws-name"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  disabled={isCreating}
                  className="mt-1 bg-gray-800 text-white"
                />
              </div>
              {formError && <p className="text-red-400 mb-4">{formError}</p>}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                >Cancel</Button>
                <Button type="submit" disabled={isCreating || !formName.trim()}>
                  {isCreating ? 'Creating…' : (
                    <>
                      Create <ArrowRight className="w-4 h-4 ml-1"/>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* AI Helper */}
      <AIHelper 
        onSidebarToggle={() => {
          if (helperAIOpen) {
            setHelperAIOpen(false)
            setSidebarCollapsed(false)
          } else {
            setHelperAIOpen(true)
            setSidebarCollapsed(true)
          }
        }}
        isInSidebarSpace={helperAIOpen}
      />
    </div>
  )
}
