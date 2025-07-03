'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  ConnectionMode,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Play, Pause, Trash2, Save, Zap, Info, HelpCircle, Users, Clock, Target } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

interface Policy {
  id: string
  name: string
  description: string
  isActive: boolean
  trigger: any
  conditions: any[]
  actions: any[]
  lastTriggered?: string
  targetAgents?: string[]
}

interface Agent {
  id: string
  name: string
  status: string
}

interface TooltipProps {
  content: string
  children: React.ReactNode
}

function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 border border-gray-600 rounded-lg shadow-lg -top-2 left-full ml-2 w-64">
          <div className="absolute top-3 -left-1 w-2 h-2 bg-gray-800 border-l border-b border-gray-600 transform rotate-45"></div>
          {content}
        </div>
      )}
    </div>
  )
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Agent Error Count > 10' },
    position: { x: 100, y: 100 },
    style: { background: '#ef4444', color: 'white', border: '1px solid #dc2626' }
  },
  {
    id: '2',
    data: { label: 'Within 1 Hour' },
    position: { x: 100, y: 200 },
    style: { background: '#f59e0b', color: 'white', border: '1px solid #d97706' }
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Pause Agent & Send Alert' },
    position: { x: 100, y: 300 },
    style: { background: '#10b981', color: 'white', border: '1px solid #059669' }
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
]

export default function PoliciesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [agents, setAgents] = useState<Agent[]>([])
  const [loadingAgents, setLoadingAgents] = useState(false)

  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    triggerType: 'error_count',
    triggerValue: '',
    timeWindow: '1h',
    customTimeValue: '',
    customTimeUnit: 'minutes',
    actionType: 'pause_agent',
    targetAgents: [] as string[],
    priority: 'medium'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchPolicies()
      fetchAgents()
    }
  }, [status, router])

  const fetchPolicies = async () => {
    try {
      const response = await fetch('/api/policies')
      if (response.ok) {
        const data = await response.json()
        setPolicies(data)
      }
    } catch (error) {
      console.error('Failed to fetch policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAgents = async () => {
    try {
      setLoadingAgents(true)
      const response = await fetch('/api/agents')
      if (response.ok) {
        const data = await response.json()
        setAgents(data)
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    } finally {
      setLoadingAgents(false)
    }
  }

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handleCreatePolicy = async () => {
    try {
      let timeWindow = newPolicy.timeWindow
      if (timeWindow === 'custom') {
        if (newPolicy.customTimeValue && newPolicy.customTimeUnit) {
          timeWindow = `${newPolicy.customTimeValue}${newPolicy.customTimeUnit.charAt(0)}`
        } else {
          alert('Please specify custom time value and unit')
          return
        }
      }

      const response = await fetch('/api/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPolicy.name,
          description: newPolicy.description,
          trigger: {
            type: newPolicy.triggerType,
            value: parseFloat(newPolicy.triggerValue),
            timeWindow: timeWindow
          },
          actions: [{ type: newPolicy.actionType }],
          targetAgents: newPolicy.targetAgents,
          priority: newPolicy.priority,
          flowData: { nodes, edges }
        }),
      })

      if (response.ok) {
        fetchPolicies()
        setIsCreating(false)
        setNewPolicy({
          name: '',
          description: '',
          triggerType: 'error_count',
          triggerValue: '',
          timeWindow: '1h',
          customTimeValue: '',
          customTimeUnit: 'minutes',
          actionType: 'pause_agent',
          targetAgents: [],
          priority: 'medium'
        })
      }
    } catch (error) {
      console.error('Failed to create policy:', error)
    }
  }

  const handleTogglePolicy = async (policyId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/policies/${policyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        fetchPolicies()
      }
    } catch (error) {
      console.error('Failed to toggle policy:', error)
    }
  }

  const handleDeletePolicy = async (policyId: string) => {
    try {
      const response = await fetch(`/api/policies/${policyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPolicies()
        setSelectedPolicy(null)
      }
    } catch (error) {
      console.error('Failed to delete policy:', error)
    }
  }

  const canModifyPolicies = session?.user?.role !== 'VIEWER'

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
            <h1 className="text-3xl font-bold text-white">Policy Builder</h1>
            <p className="text-gray-400 mt-1">
              Create automated rules to govern your AI agents
            </p>
          </div>
          
          {canModifyPolicies && (
            <Button 
              onClick={() => setIsCreating(true)}
              className="command-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Policy
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Policy List */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="glass-panel border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Active Policies</CardTitle>
                <CardDescription className="text-gray-400">
                  {policies.filter(p => p.isActive).length} of {policies.length} policies active
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {policies.map((policy) => (
                  <div
                    key={policy.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPolicy?.id === policy.id
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedPolicy(policy)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">{policy.name}</h3>
                      <Badge 
                        className={policy.isActive 
                          ? 'bg-green-500/20 text-green-400 border-green-500/50'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                        }
                      >
                        {policy.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{policy.description}</p>
                    {policy.lastTriggered && (
                      <p className="text-xs text-gray-500">
                        Last triggered: {new Date(policy.lastTriggered).toLocaleString()}
                      </p>
                    )}
                    
                    {canModifyPolicies && (
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTogglePolicy(policy.id, !policy.isActive)
                          }}
                          className={policy.isActive 
                            ? 'border-yellow-500/50 hover:bg-yellow-500/10'
                            : 'border-green-500/50 hover:bg-green-500/10'
                          }
                        >
                          {policy.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePolicy(policy.id)
                          }}
                          className="border-red-500/50 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {policies.length === 0 && (
                  <div className="text-center py-8">
                    <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No policies created yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Policy Builder / Flow Diagram */}
          <div className="lg:col-span-2">
            <Card className="glass-panel border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">
                  {isCreating ? 'Create New Policy' : selectedPolicy ? selectedPolicy.name : 'Policy Flow Diagram'}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {isCreating ? 'Design your policy using drag-and-drop' : 'Visual representation of policy logic'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isCreating ? (
                  <div className="space-y-6">
                    {/* Policy Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="name" className="text-gray-300 font-medium">Policy Name</Label>
                          <Tooltip content="Give your policy a descriptive name that clearly indicates its purpose. This will help you identify it in the policy list.">
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </Tooltip>
                        </div>
                        <Input
                          id="name"
                          value={newPolicy.name}
                          onChange={(e) => setNewPolicy(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="High Error Rate Policy"
                          className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="description" className="text-gray-300 font-medium">Description</Label>
                          <Tooltip content="Provide a detailed description of what this policy does and when it should trigger. This helps with maintenance and troubleshooting.">
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </Tooltip>
                        </div>
                        <Input
                          id="description"
                          value={newPolicy.description}
                          onChange={(e) => setNewPolicy(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Pause agent when errors exceed threshold"
                          className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500 transition-colors"
                        />
                      </div>

                      {/* Target Agents */}
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center space-x-2">
                          <Label className="text-gray-300 font-medium flex items-center">
                            <Users className="w-4 h-4 mr-2 text-blue-400" />
                            Target Agents
                          </Label>
                          <Tooltip content="Select which agents this policy should monitor. Leave empty to apply to all agents. You can select multiple agents by clicking on them.">
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </Tooltip>
                        </div>
                        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 min-h-[100px]">
                          {loadingAgents ? (
                            <div className="flex items-center justify-center py-4">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                              <span className="ml-2 text-gray-400">Loading agents...</span>
                            </div>
                          ) : agents.length === 0 ? (
                            <div className="text-center py-4">
                              <p className="text-gray-400">No agents available</p>
                              <p className="text-xs text-gray-500 mt-1">Create some agents first to use them in policies</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-400">
                                  {newPolicy.targetAgents.length === 0 ? 'All agents' : `${newPolicy.targetAgents.length} selected`}
                                </span>
                                {newPolicy.targetAgents.length > 0 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setNewPolicy(prev => ({ ...prev, targetAgents: [] }))}
                                    className="text-xs border-gray-600 hover:bg-gray-700/50"
                                  >
                                    Clear All
                                  </Button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {agents.map((agent) => (
                                  <div
                                    key={agent.id}
                                    className={`p-2 rounded border cursor-pointer transition-all ${
                                      newPolicy.targetAgents.includes(agent.id)
                                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                                    }`}
                                    onClick={() => {
                                      setNewPolicy(prev => ({
                                        ...prev,
                                        targetAgents: prev.targetAgents.includes(agent.id)
                                          ? prev.targetAgents.filter(id => id !== agent.id)
                                          : [...prev.targetAgents, agent.id]
                                      }))
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">{agent.name}</span>
                                      <Badge 
                                        className={`text-xs ${
                                          agent.status === 'active' 
                                            ? 'bg-green-500/20 text-green-400' 
                                            : 'bg-gray-500/20 text-gray-400'
                                        }`}
                                      >
                                        {agent.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Trigger Configuration */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label className="text-gray-300 font-medium flex items-center">
                            <Target className="w-4 h-4 mr-2 text-red-400" />
                            Trigger Type
                          </Label>
                          <Tooltip content="Choose what metric or condition should trigger this policy. Different trigger types monitor different aspects of your agents.">
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </Tooltip>
                        </div>
                        <Select 
                          value={newPolicy.triggerType} 
                          onValueChange={(value) => setNewPolicy(prev => ({ ...prev, triggerType: value }))}
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="error_count" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                                Error Count
                              </div>
                            </SelectItem>
                            <SelectItem value="uptime" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                Uptime Threshold
                              </div>
                            </SelectItem>
                            <SelectItem value="cost" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                                Cost Threshold
                              </div>
                            </SelectItem>
                            <SelectItem value="latency" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                Latency Threshold
                              </div>
                            </SelectItem>
                            <SelectItem value="memory" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                                Memory Usage
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="triggerValue" className="text-gray-300 font-medium">Trigger Value</Label>
                          <Tooltip content={`Set the threshold value for the ${newPolicy.triggerType.replace('_', ' ')} trigger. When this value is exceeded, the policy will activate.`}>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </Tooltip>
                        </div>
                        <Input
                          id="triggerValue"
                          type="number"
                          value={newPolicy.triggerValue}
                          onChange={(e) => setNewPolicy(prev => ({ ...prev, triggerValue: e.target.value }))}
                          placeholder={newPolicy.triggerType === 'cost' ? '100.00' : '10'}
                          className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500 transition-colors"
                        />
                      </div>

                      {/* Time Window Configuration */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label className="text-gray-300 font-medium flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-blue-400" />
                            Time Window
                          </Label>
                          <Tooltip content="Define the time period over which the trigger condition is evaluated. 'Indefinite' means the condition is checked continuously without a time limit.">
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </Tooltip>
                        </div>
                        <Select 
                          value={newPolicy.timeWindow} 
                          onValueChange={(value) => setNewPolicy(prev => ({ ...prev, timeWindow: value }))}
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="1m" className="text-white hover:bg-gray-700">1 minute</SelectItem>
                            <SelectItem value="5m" className="text-white hover:bg-gray-700">5 minutes</SelectItem>
                            <SelectItem value="15m" className="text-white hover:bg-gray-700">15 minutes</SelectItem>
                            <SelectItem value="30m" className="text-white hover:bg-gray-700">30 minutes</SelectItem>
                            <SelectItem value="1h" className="text-white hover:bg-gray-700">1 hour</SelectItem>
                            <SelectItem value="6h" className="text-white hover:bg-gray-700">6 hours</SelectItem>
                            <SelectItem value="24h" className="text-white hover:bg-gray-700">24 hours</SelectItem>
                            <SelectItem value="indefinite" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                                Indefinite
                              </div>
                            </SelectItem>
                            <SelectItem value="custom" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                                Custom
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Custom Time Window */}
                      {newPolicy.timeWindow === 'custom' && (
                        <div className="space-y-2">
                          <Label className="text-gray-300 font-medium">Custom Time Window</Label>
                          <div className="flex space-x-2">
                            <Input
                              type="number"
                              value={newPolicy.customTimeValue}
                              onChange={(e) => setNewPolicy(prev => ({ ...prev, customTimeValue: e.target.value }))}
                              placeholder="30"
                              className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500 flex-1"
                            />
                            <Select 
                              value={newPolicy.customTimeUnit} 
                              onValueChange={(value) => setNewPolicy(prev => ({ ...prev, customTimeUnit: value }))}
                            >
                              <SelectTrigger className="bg-gray-800/50 border-gray-600 w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="seconds" className="text-white hover:bg-gray-700">Seconds</SelectItem>
                                <SelectItem value="minutes" className="text-white hover:bg-gray-700">Minutes</SelectItem>
                                <SelectItem value="hours" className="text-white hover:bg-gray-700">Hours</SelectItem>
                                <SelectItem value="days" className="text-white hover:bg-gray-700">Days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {/* Action and Priority */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label className="text-gray-300 font-medium">Action</Label>
                          <Tooltip content="Choose what action should be taken when the policy triggers. Different actions have different impacts on your agents and operations.">
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </Tooltip>
                        </div>
                        <Select 
                          value={newPolicy.actionType} 
                          onValueChange={(value) => setNewPolicy(prev => ({ ...prev, actionType: value }))}
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="pause_agent" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <Pause className="w-4 h-4 mr-2 text-yellow-400" />
                                Pause Agent
                              </div>
                            </SelectItem>
                            <SelectItem value="send_alert" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <Info className="w-4 h-4 mr-2 text-blue-400" />
                                Send Alert
                              </div>
                            </SelectItem>
                            <SelectItem value="restart_agent" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <Play className="w-4 h-4 mr-2 text-green-400" />
                                Restart Agent
                              </div>
                            </SelectItem>
                            <SelectItem value="scale_down" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <Trash2 className="w-4 h-4 mr-2 text-red-400" />
                                Scale Down
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label className="text-gray-300 font-medium">Priority</Label>
                          <Tooltip content="Set the priority level for this policy. Higher priority policies are processed first when multiple policies trigger simultaneously.">
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </Tooltip>
                        </div>
                        <Select 
                          value={newPolicy.priority} 
                          onValueChange={(value) => setNewPolicy(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="low" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                Low Priority
                              </div>
                            </SelectItem>
                            <SelectItem value="medium" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                                Medium Priority
                              </div>
                            </SelectItem>
                            <SelectItem value="high" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                                High Priority
                              </div>
                            </SelectItem>
                            <SelectItem value="critical" className="text-white hover:bg-gray-700">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                                Critical Priority
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Flow Builder */}
                    <div className="h-96 border border-gray-600 rounded-lg bg-gray-900/50">
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        connectionMode={ConnectionMode.Loose}
                        fitView
                      >
                        <Background color="#374151" gap={16} />
                        <Controls />
                        <MiniMap 
                          nodeColor="#3b82f6"
                          maskColor="rgba(0, 0, 0, 0.8)"
                        />
                      </ReactFlow>
                    </div>

                    {/* Policy Summary */}
                    <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <Info className="w-4 h-4 mr-2 text-blue-400" />
                        Policy Summary
                      </h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>
                          <span className="text-gray-400">Name:</span> {newPolicy.name || 'Untitled Policy'}
                        </p>
                        <p>
                          <span className="text-gray-400">Targets:</span> {
                            newPolicy.targetAgents.length === 0 
                              ? 'All agents' 
                              : `${newPolicy.targetAgents.length} selected agent${newPolicy.targetAgents.length > 1 ? 's' : ''}`
                          }
                        </p>
                        <p>
                          <span className="text-gray-400">Trigger:</span> {
                            newPolicy.triggerValue 
                              ? `When ${newPolicy.triggerType.replace('_', ' ')} exceeds ${newPolicy.triggerValue}`
                              : 'No trigger value set'
                          }
                        </p>
                        <p>
                          <span className="text-gray-400">Time Window:</span> {
                            newPolicy.timeWindow === 'custom' 
                              ? `${newPolicy.customTimeValue} ${newPolicy.customTimeUnit}`
                              : newPolicy.timeWindow === 'indefinite'
                              ? 'Indefinite (continuous monitoring)'
                              : newPolicy.timeWindow
                          }
                        </p>
                        <p>
                          <span className="text-gray-400">Action:</span> {newPolicy.actionType.replace('_', ' ')}
                        </p>
                        <p>
                          <span className="text-gray-400">Priority:</span> {newPolicy.priority}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4">
                      <Button 
                        onClick={handleCreatePolicy}
                        className="command-button flex-1 sm:flex-none"
                        disabled={!newPolicy.name || !newPolicy.triggerValue || (newPolicy.timeWindow === 'custom' && (!newPolicy.customTimeValue || !newPolicy.customTimeUnit))}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Create Policy
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsCreating(false)
                          setNewPolicy({
                            name: '',
                            description: '',
                            triggerType: 'error_count',
                            triggerValue: '',
                            timeWindow: '1h',
                            customTimeValue: '',
                            customTimeUnit: 'minutes',
                            actionType: 'pause_agent',
                            targetAgents: [],
                            priority: 'medium'
                          })
                        }}
                        className="border-gray-600 hover:bg-gray-700/50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 border border-gray-600 rounded-lg bg-gray-900/50">
                    <ReactFlow
                      nodes={selectedPolicy ? [] : initialNodes}
                      edges={selectedPolicy ? [] : initialEdges}
                      fitView
                      attributionPosition="bottom-left"
                    >
                      <Background color="#374151" gap={16} />
                      <Controls />
                      <MiniMap 
                        nodeColor="#3b82f6"
                        maskColor="rgba(0, 0, 0, 0.8)"
                      />
                    </ReactFlow>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
