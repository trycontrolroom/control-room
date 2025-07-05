'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  Zap,
  Building,
  ChevronDown,
  Plus,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface Workspace {
  id: string
  name: string
  description: string
  memberCount: number
  role: string
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Activity },
  { name: 'Analytics', href: '/dashboard/stats', icon: BarChart3 },
  { name: 'Policies', href: '/dashboard/policies', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
]

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: Users },
]

const developerNavigation = [
  { name: 'Developer Panel', href: '/developer', icon: Shield },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false)
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false)

  const isAdmin = session?.user?.role === 'ADMIN'
  const isDeveloper = session?.user?.email === 'admin@control-room.ai'

  useEffect(() => {
    if (session?.user?.id) {
      fetchWorkspaces()
    }
  }, [session?.user?.id])

  const fetchWorkspaces = async () => {
    try {
      setLoadingWorkspaces(true)
      const response = await fetch('/api/workspaces')
      if (response.ok) {
        const data = await response.json()
        setWorkspaces(data.workspaces)
        setCurrentWorkspace(data.currentWorkspace)
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error)
    } finally {
      setLoadingWorkspaces(false)
    }
  }

  const handleWorkspaceSwitch = async (workspaceId: string) => {
    try {
      const response = await fetch('/api/workspaces/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workspaceId }),
      })

      if (response.ok) {
        const workspace = workspaces.find(w => w.id === workspaceId)
        setCurrentWorkspace(workspace || null)
        setShowWorkspaceDropdown(false)
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to switch workspace:', error)
    }
  }

  return (
    <div className="min-h-screen command-center-bg">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-blue-500/20">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-700">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Control Room
              </span>
            </Link>
          </div>

          {/* Workspace Selector */}
          <div className="px-4 py-4 border-b border-gray-700">
            <div className="relative">
              <button
                onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
                className="w-full flex items-center justify-between p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Building className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white truncate">
                      {currentWorkspace?.name || 'Loading...'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {currentWorkspace?.memberCount || 0} member{(currentWorkspace?.memberCount || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showWorkspaceDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showWorkspaceDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {loadingWorkspaces ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mx-auto"></div>
                      <span className="text-sm text-gray-400 mt-2">Loading workspaces...</span>
                    </div>
                  ) : (
                    <>
                      {workspaces.map((workspace) => (
                        <button
                          key={workspace.id}
                          onClick={() => handleWorkspaceSwitch(workspace.id)}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition-colors border-b border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded flex items-center justify-center">
                              <Building className="w-3 h-3 text-white" />
                            </div>
                            <div className="text-left">
                              <div className="text-sm font-medium text-white">{workspace.name}</div>
                              <div className="text-xs text-gray-400">
                                {workspace.memberCount} member{workspace.memberCount !== 1 ? 's' : ''} • {workspace.role}
                              </div>
                            </div>
                          </div>
                          {currentWorkspace?.id === workspace.id && (
                            <Check className="w-4 h-4 text-green-400" />
                          )}
                        </button>
                      ))}
                      
                      <div className="border-t border-gray-700">
                        <Link
                          href="/dashboard/settings"
                          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-700/50 transition-colors text-blue-400"
                          onClick={() => setShowWorkspaceDropdown(false)}
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-sm font-medium">Create Workspace</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}

            {(isAdmin || isDeveloper) && (
              <>
                <div className="border-t border-gray-700 my-4" />
                {isAdmin && adminNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
                {isDeveloper && developerNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
              </>
            )}
          </nav>

          {/* User Profile */}
          <div className="px-4 py-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {session?.user?.role}
                </p>
              </div>
            </div>
            <Button
              onClick={() => signOut()}
              variant="outline"
              size="sm"
              className="w-full border-red-500/50 hover:bg-red-500/10 text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
