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
import { Plus, Play, Pause, Trash2, Save, Zap } from 'lucide-react'
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

  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    triggerType: 'error_count',
    triggerValue: '',
    timeWindow: '1h',
    actionType: 'pause_agent'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchPolicies()
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

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handleCreatePolicy = async () => {
    try {
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
            timeWindow: newPolicy.timeWindow
          },
          actions: [{ type: newPolicy.actionType }],
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
          actionType: 'pause_agent'
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">Policy Name</Label>
                        <Input
                          id="name"
                          value={newPolicy.name}
                          onChange={(e) => setNewPolicy(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="High Error Rate Policy"
                          className="bg-gray-800/50 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-300">Description</Label>
                        <Input
                          id="description"
                          value={newPolicy.description}
                          onChange={(e) => setNewPolicy(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Pause agent when errors exceed threshold"
                          className="bg-gray-800/50 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Trigger Type</Label>
                        <Select 
                          value={newPolicy.triggerType} 
                          onValueChange={(value) => setNewPolicy(prev => ({ ...prev, triggerType: value }))}
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="error_count">Error Count</SelectItem>
                            <SelectItem value="uptime">Uptime Threshold</SelectItem>
                            <SelectItem value="cost">Cost Threshold</SelectItem>
                            <SelectItem value="latency">Latency Threshold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="triggerValue" className="text-gray-300">Trigger Value</Label>
                        <Input
                          id="triggerValue"
                          type="number"
                          value={newPolicy.triggerValue}
                          onChange={(e) => setNewPolicy(prev => ({ ...prev, triggerValue: e.target.value }))}
                          placeholder="10"
                          className="bg-gray-800/50 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Time Window</Label>
                        <Select 
                          value={newPolicy.timeWindow} 
                          onValueChange={(value) => setNewPolicy(prev => ({ ...prev, timeWindow: value }))}
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5m">5 minutes</SelectItem>
                            <SelectItem value="15m">15 minutes</SelectItem>
                            <SelectItem value="1h">1 hour</SelectItem>
                            <SelectItem value="24h">24 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Action</Label>
                        <Select 
                          value={newPolicy.actionType} 
                          onValueChange={(value) => setNewPolicy(prev => ({ ...prev, actionType: value }))}
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pause_agent">Pause Agent</SelectItem>
                            <SelectItem value="send_alert">Send Alert</SelectItem>
                            <SelectItem value="restart_agent">Restart Agent</SelectItem>
                            <SelectItem value="scale_down">Scale Down</SelectItem>
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

                    {/* Actions */}
                    <div className="flex space-x-4">
                      <Button 
                        onClick={handleCreatePolicy}
                        className="command-button"
                        disabled={!newPolicy.name || !newPolicy.triggerValue}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Create Policy
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsCreating(false)}
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
