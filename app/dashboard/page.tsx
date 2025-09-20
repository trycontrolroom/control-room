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
  DollarSign,
  Code,
  CheckSquare,
  X,
  Edit,
  Save,
  Calendar
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
  createdAt?: string
}

interface AgentTask {
  id: string
  agentId: string
  name: string
  description?: string
  status: 'PENDING' | 'RUNNING' | 'PAUSED' | 'FAILED' | 'COMPLETED'
  schedule?: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { socket, isConnected } = useSocket()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [editingTask, setEditingTask] = useState<AgentTask | null>(null)

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

  function getTaskStatusColor(status: string) {
    switch (status) {
      case 'RUNNING':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'PENDING':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'PAUSED':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'FAILED':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'COMPLETED':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  async function openAgentDetail(agent: Agent) {
    setSelectedAgent(agent)
    await fetchAgentTasks(agent.id)
  }

  async function fetchAgentTasks(agentId: string) {
    setLoadingTasks(true)
    try {
      const response = await fetch(`/api/agents/${agentId}/tasks`)
      if (response.ok) {
        const tasks: AgentTask[] = await response.json()
        setAgentTasks(tasks)
      }
    } catch (err) {
      console.error('Failed to fetch agent tasks:', err)
    } finally {
      setLoadingTasks(false)
    }
  }

  async function createTask() {
    if (!selectedAgent || !newTaskName.trim()) return
    
    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTaskName.trim(),
          description: newTaskDescription.trim() || undefined
        })
      })
      if (response.ok) {
        setNewTaskName('')
        setNewTaskDescription('')
        await fetchAgentTasks(selectedAgent.id)
      }
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  async function updateTask(taskId: string, updates: Partial<AgentTask>) {
    if (!selectedAgent) return
    
    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}/tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, ...updates })
      })
      if (response.ok) {
        await fetchAgentTasks(selectedAgent.id)
        setEditingTask(null)
      }
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  async function deleteTask(taskId: string) {
    if (!selectedAgent) return
    
    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}/tasks`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      })
      if (response.ok) {
        await fetchAgentTasks(selectedAgent.id)
      }
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const canModify = session?.user?.workspaceRole === 'ADMIN' || session?.user?.workspaceRole === 'MANAGER'

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
            <h1 className="text-3xl font-bold text-white">Manage</h1>
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
            <Card key={agent.id} className="agent-card data-stream cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => openAgentDetail(agent)}>
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
                    <Link href={`/dashboard/stats?agent=${agent.id}`} onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/agents/${agent.id}/logs`} onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="outline" className="border-gray-500/50 hover:bg-gray-500/10">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex space-x-2">
                    {canModify && (
                      <>
                        {agent.status === 'ACTIVE' ? (
                          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleAgentAction(agent.id, 'pause'); }} className="border-yellow-500/50 hover:bg-yellow-500/10">
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleAgentAction(agent.id, 'resume'); }} className="border-green-500/50 hover:bg-green-500/10">
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleAgentAction(agent.id, 'delete'); }} className="border-red-500/50 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
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

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-panel border-blue-500/20 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-white">{selectedAgent.name}</h2>
                <Badge className={getStatusColor(selectedAgent.status)}>{selectedAgent.status}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedAgent(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Live Metrics Preview */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Live Metrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="glass-panel border-green-500/20">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-400">Uptime</div>
                      <div className="text-xl font-bold text-green-400">{selectedAgent.uptime.toFixed(1)}%</div>
                    </CardContent>
                  </Card>
                  <Card className="glass-panel border-red-500/20">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-400">Errors</div>
                      <div className="text-xl font-bold text-red-400">{selectedAgent.errorCount}</div>
                    </CardContent>
                  </Card>
                  <Card className="glass-panel border-yellow-500/20">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-400">Cost</div>
                      <div className="text-xl font-bold text-yellow-400">${selectedAgent.cost.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                  <Card className="glass-panel border-gray-500/20">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-400">Last Seen</div>
                      <div className="text-sm font-bold text-gray-300">
                        {new Date(selectedAgent.lastSeen).toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Quick Actions
                </h3>
                <div className="flex space-x-4">
                  <Link href={`/dashboard/stats?agent=${selectedAgent.id}`}>
                    <Button variant="outline" className="border-blue-500/50 hover:bg-blue-500/10">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Stats
                    </Button>
                  </Link>
                  <Link href={`/dashboard/create?edit=${selectedAgent.id}`}>
                    <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/10">
                      <Code className="w-4 h-4 mr-2" />
                      Edit Code
                    </Button>
                  </Link>
                  <Link href={`/dashboard/policies?agent=${selectedAgent.id}`}>
                    <Button variant="outline" className="border-orange-500/50 hover:bg-orange-500/10">
                      <FileText className="w-4 h-4 mr-2" />
                      View Policies
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Tasks Management */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CheckSquare className="w-5 h-5 mr-2" />
                  Tasks Management
                </h3>
                
                {/* Add New Task */}
                {canModify && (
                  <Card className="glass-panel border-blue-500/20 mb-4">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Task name"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            className="form-input-enhanced px-3 py-2"
                          />
                          <input
                            type="text"
                            placeholder="Description (optional)"
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            className="form-input-enhanced px-3 py-2"
                          />
                        </div>
                        <Button onClick={createTask} disabled={!newTaskName.trim()} className="command-button">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Task
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tasks List */}
                <div className="space-y-3">
                  {loadingTasks ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
                    </div>
                  ) : agentTasks.length === 0 ? (
                    <Card className="glass-panel border-gray-500/20">
                      <CardContent className="text-center py-8">
                        <CheckSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400">No tasks configured for this agent</p>
                      </CardContent>
                    </Card>
                  ) : (
                    agentTasks.map(task => (
                      <Card key={task.id} className="glass-panel border-gray-500/20">
                        <CardContent className="p-4">
                          {editingTask?.id === task.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editingTask.name}
                                onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                                className="form-input-enhanced px-3 py-2 w-full"
                              />
                              <input
                                type="text"
                                value={editingTask.description || ''}
                                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                placeholder="Description"
                                className="form-input-enhanced px-3 py-2 w-full"
                              />
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={() => updateTask(task.id, { name: editingTask.name, description: editingTask.description })}>
                                  <Save className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <h4 className="font-semibold text-white">{task.name}</h4>
                                  <Badge className={getTaskStatusColor(task.status)}>{task.status}</Badge>
                                </div>
                                {task.description && (
                                  <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                                )}
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(task.createdAt).toLocaleDateString()}
                                  </span>
                                  {task.schedule && (
                                    <span>Schedule: {task.schedule}</span>
                                  )}
                                </div>
                              </div>
                              {canModify && (
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline" onClick={() => setEditingTask(task)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => deleteTask(task.id)} className="border-red-500/50 hover:bg-red-500/10">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
