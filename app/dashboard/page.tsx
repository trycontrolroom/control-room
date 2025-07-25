'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/components/socket-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Pause,
  Trash2,
  BarChart3,
  FileText,
  Plus,
  Activity,
  AlertTriangle,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'

interface Agent {
  id: string
  name: string
  status: 'ACTIVE' | 'PAUSED' | 'ERROR'
  uptime: number
  errorCount: number
  lastSeen: string
  cost: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { socket, isConnected } = useSocket()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  // redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status === 'authenticated') {
      fetchAgents()
    }
  }, [status, router])

  // real-time updates: only apply when payload.agents has items
  useEffect(() => {
    if (!socket) return
    const handler = (payload: { agents?: Agent[] }) => {
      if (Array.isArray(payload.agents) && payload.agents.length > 0) {
        setAgents(payload.agents)
      }
    }
    socket.on('agents:update', handler)
    return () => {
      socket.off('agents:update', handler)
    }
  }, [socket])

  async function fetchAgents() {
    setLoading(true)
    try {
      const wsId = session?.user?.workspaceId
      const response = await fetch(`/api/agents?workspaceId=${wsId}`)
      if (response.ok) {
        const data: Agent[] = await response.json()
        setAgents(data)
      }
    } catch (err) {
      console.error('Failed to fetch agents:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAgentAction(agentId: string, action: 'pause' | 'resume' | 'delete') {
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:
          action !== 'delete'
            ? JSON.stringify({ status: action === 'pause' ? 'PAUSED' : 'ACTIVE' })
            : undefined
      })
      if (response.ok) fetchAgents()
    } catch (err) {
      console.error(`Failed to ${action} agent:`, err)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'PAUSED':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'ERROR':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  // show loader while fetching
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
            <h1 className="text-3xl font-bold text-white">Command Center</h1>
            <p className="text-gray-400 mt-1">Monitor and control your AI agents in real-time</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {/* always‐visible Add Agent button */}
            <Link href="/dashboard/agents/new">
              <Button className="command-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Agent
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-panel border-blue-500/20">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Agents</CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{agents.length}</div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-green-500/20">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active</CardTitle>
              <Play className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {agents.filter(a => a.status === 'ACTIVE').length}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-red-500/20">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Errors</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {agents.reduce((sum, a) => sum + a.errorCount, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-yellow-500/20">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${agents.reduce((sum, a) => sum + a.cost, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <Card key={agent.id} className="agent-card data-stream">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">{agent.name}</CardTitle>
                  <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Uptime</div>
                    <div className="metric-value text-green-400">{agent.uptime.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Errors</div>
                    <div className="metric-value text-red-400">{agent.errorCount}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Cost</div>
                    <div className="metric-value text-yellow-400">${agent.cost.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Last Seen</div>
                    <div className="metric-value text-gray-300">
                      {new Date(agent.lastSeen).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/stats?agent=${agent.id}`}>
                      <Button size="sm" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/agents/${agent.id}/logs`}>
                      <Button size="sm" variant="outline" className="border-gray-500/50 hover:bg-gray-500/10">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex space-x-2">
                    {agent.status === 'ACTIVE' ? (
                      <Button size="sm" variant="outline" onClick={() => handleAgentAction(agent.id, 'pause')} className="border-yellow-500/50 hover:bg-yellow-500/10">
                        <Pause className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleAgentAction(agent.id, 'resume')} className="border-green-500/50 hover:bg-green-500/10">
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleAgentAction(agent.id, 'delete')} className="border-red-500/50 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {agents.length === 0 && (
          <Card className="glass-panel border-gray-500/20">
            <CardContent className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Agents Deployed</h3>
              <p className="text-gray-400 mb-6">Get started by deploying your first AI agent to the command center.</p>
              <Link href="/dashboard/agents/new">
                <Button className="command-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Deploy First Agent
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}