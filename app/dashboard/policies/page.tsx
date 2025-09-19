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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Play,
  Pause,
  Trash2,
  Save,
  Zap,
  HelpCircle,
  Users,
  Clock,
  Target,
  Pencil,
  X,
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

// Helper to get workspaceId from cookies
function getCurrentWorkspaceId(): string {
  if (typeof document === 'undefined') return ''
  const kv = document.cookie
    .split('; ')
    .map(pair => pair.split('=') as [string, string])
    .reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = decodeURIComponent(v)
      return acc
    }, {})
  return kv['workspaceId'] || kv['workspace-id'] || ''
}

interface Policy {
  id: string
  name: string
  description: string
  isActive: boolean
  lastTriggered?: string
  targetAgents?: string[]
  triggerType?: string
  triggerValue?: number | string
  timeWindow?: string
  actionType?: string
  priority?: string
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
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {visible && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 border border-gray-600 rounded shadow-lg -top-2 left-full ml-2 w-64">
          <div className="absolute top-3 -left-1 w-2 h-2 bg-gray-800 border-l border-b border-gray-600 transform rotate-45" />
          {content}
        </div>
      )}
    </div>
  )
}

// static flow defaults
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Agent Error Count > 10' },
    position: { x: 100, y: 100 },
    style: { background: '#ef4444', color: 'white', border: '1px solid #dc2626' },
  },
  {
    id: '2',
    data: { label: 'Within 1 Hour' },
    position: { x: 100, y: 200 },
    style: { background: '#f59e0b', color: 'white', border: '1px solid #d97706' },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Pause Agent & Send Alert' },
    position: { x: 100, y: 300 },
    style: { background: '#10b981', color: 'white', border: '1px solid #059669' },
  },
]
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
]

// UI → Prisma enum maps
const TRIGGER_MAP: Record<string, string> = {
  error_count: 'ERROR_RATE',
  uptime: 'UPTIME',
  cost: 'COST',
  latency: 'LATENCY',
  memory: 'CUSTOM_METRIC',
}
const ACTION_MAP: Record<string, string> = {
  pause_agent: 'PAUSE_AGENT',
  send_alert: 'SEND_ALERT',
  restart_agent: 'RESTART',
  scale_down: 'SCALE_DOWN',
}

export default function PoliciesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback((c: Connection) => setEdges((e) => addEdge(c, e)), [setEdges])

  // policies + agents
  const [policies, setPolicies] = useState<Policy[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingAgents, setLoadingAgents] = useState(false)

  // creation / editing UI
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // top-level error banner
  const [error, setError] = useState<string | null>(null)

  // shared form state
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
    priority: 'medium',
  })

  // fetch on auth
  useEffect(() => {
    if (status === 'unauthenticated') return router.push('/login')
    if (status === 'authenticated') {
      fetchPolicies()
      fetchAgents()
    }
    // eslint-disable-next-line
  }, [status])

  async function fetchPolicies() {
    setLoading(true)
    setError(null)
    try {
      const workspaceId = getCurrentWorkspaceId()
      if (!workspaceId) throw new Error('No workspace selected')
      const res = await fetch(`/api/policies?workspaceId=${workspaceId}`)
      if (!res.ok) throw new Error('Failed to load policies')
      setPolicies(await res.json())
    } catch (e: any) {
      setError(e.message || 'Failed to load policies')
    } finally {
      setLoading(false)
    }
  }

  async function fetchAgents() {
    setLoadingAgents(true)
    try {
      const res = await fetch('/api/agents')
      if (!res.ok) throw new Error('no agents')
      setAgents(await res.json())
    } catch {
      setAgents([])
    } finally {
      setLoadingAgents(false)
    }
  }

  function resetForm() {
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
      priority: 'medium',
    })
  }

  // create or update
  async function handleSavePolicy() {
    setError(null)
    const workspaceId = getCurrentWorkspaceId()
    if (!workspaceId) {
      setError('No workspace selected')
      return
    }

    // custom time window
    let tw = newPolicy.timeWindow
    if (tw === 'custom') {
      if (!newPolicy.customTimeValue) {
        setError('Specify custom time window')
        return
      }
      tw = `${newPolicy.customTimeValue}${newPolicy.customTimeUnit.charAt(0)}`
    }

    // enum mappings
    const mappedTrigger = TRIGGER_MAP[newPolicy.triggerType]
    const mappedAction = ACTION_MAP[newPolicy.actionType]
    if (!mappedTrigger) {
      setError('Invalid trigger type')
      return
    }

    const payload = {
      name: newPolicy.name,
      description: newPolicy.description,
      triggerType: mappedTrigger,
      triggerValue: parseFloat(newPolicy.triggerValue),
      timeWindow: tw,
      actionType: mappedAction,
      agentId:
        newPolicy.targetAgents.length > 0
          ? newPolicy.targetAgents[0]
          : null,
      priority: newPolicy.priority,
      workspaceId,
    }

    try {
      const res = editingId
        ? await fetch(`/api/policies/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/policies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Save failed')
      }

      await fetchPolicies()
      setIsCreating(false)
      setEditingId(null)
      resetForm()
    } catch (e: any) {
      setError(e.message)
    }
  }

  // toggle active
  async function handleToggle(id: string, on: boolean) {
    setError(null)
    const workspaceId = getCurrentWorkspaceId()
    try {
      const res = await fetch(`/api/policies/${id}?workspaceId=${workspaceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: on, workspaceId }),
      })
      if (!res.ok) throw new Error()
      fetchPolicies()
    } catch {
      setError('Failed to update policy')
    }
  }

  // delete
  async function handleDelete(id: string) {
    setError(null)
    const workspaceId = getCurrentWorkspaceId()
    try {
      const res = await fetch(`/api/policies/${id}?workspaceId=${workspaceId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      fetchPolicies()
    } catch {
      setError('Failed to delete policy')
    }
  }

  // load into form
  function handleEdit(p: Policy) {
    setEditingId(p.id)
    setIsCreating(true)
    resetForm()
    setNewPolicy({
      name: p.name,
      description: p.description ?? '',
      triggerType: Object.entries(TRIGGER_MAP).find(([, v]) => v === p.triggerType)?.[0] || 'error_count',
      triggerValue: String(p.triggerValue ?? ''),
      timeWindow: p.timeWindow ?? '1h',
      customTimeValue: '',
      customTimeUnit: 'minutes',
      actionType: Object.entries(ACTION_MAP).find(([, v]) => v === p.actionType)?.[0] || 'pause_agent',
      targetAgents: p.targetAgents ?? [],
      priority: p.priority ?? 'medium',
    })
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Policy Builder</h1>
          <p className="text-gray-400 mt-1">
            Create automated rules to govern your AI agents
          </p>
        </div>

        {/* Global error banner */}
        {error && (
          <div className="mb-4 text-red-400 border border-red-700 bg-red-900/30 p-3 rounded">
            {error}
          </div>
        )}

        {!isCreating ? (
          /* ——— list of existing policies ——— */
          <div className="w-full flex justify-center">
            <Card className="w-full max-w-4xl glass-panel border-blue-500/20">
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-0 leading-tight">
                    Active Policies
                  </h2>
                  <div className="text-gray-400 text-sm mb-0">
                    {policies.length}{' '}
                    {policies.length === 1 ? 'policy' : 'policies'}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsCreating(true)
                    setEditingId(null)
                    resetForm()
                  }}
                  className="ml-2 px-4 py-2 font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create Policy
                </Button>
              </div>

              <CardContent className="space-y-4">
                {policies.length === 0 ? (
                  <div className="text-center py-8">
                    <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No policies created yet</p>
                  </div>
                ) : (
                  policies.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-lg border border-gray-600 hover:border-gray-500"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">
                          {p.name}
                        </h3>
                        <Badge
                          className={
                            p.isActive
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }
                        >
                          {p.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {p.description}
                      </p>
                      {p.lastTriggered && (
                        <p className="text-xs text-gray-500">
                          Last triggered:{' '}
                          {new Date(p.lastTriggered).toLocaleString()}
                        </p>
                      )}
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleToggle(p.id, !p.isActive)
                          }
                        >
                          {p.isActive ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(p)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* ——— create / edit form + flow ——— */
          <div className="w-full flex justify-center">
            <Card className="w-full max-w-5xl glass-panel border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingId ? 'Edit Policy' : 'Create New Policy'}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Design your policy using drag‐and‐drop
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* top‐grid form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Policy Name */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor="name"
                        className="text-gray-300 font-medium"
                      >
                        Policy Name
                      </Label>
                      <Tooltip content="Descriptive name to identify this policy.">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Tooltip>
                    </div>
                    <Input
                      id="name"
                      value={newPolicy.name}
                      onChange={(e) =>
                        setNewPolicy((p) => ({
                          ...p,
                          name: e.target.value,
                        }))
                      }
                      placeholder="High Error Rate Policy"
                      className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor="description"
                        className="text-gray-300 font-medium"
                      >
                        Description
                      </Label>
                      <Tooltip content="What this policy does and when it triggers.">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Tooltip>
                    </div>
                    <Input
                      id="description"
                      value={newPolicy.description}
                      onChange={(e) =>
                        setNewPolicy((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Pause agent when errors exceed threshold"
                      className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>

                  {/* Target Agents (full-width) */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <Label className="text-gray-300 font-medium">
                        Target Agents
                      </Label>
                      <Tooltip content="Select agents this policy monitors.">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Tooltip>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 min-h-[100px]">
                      {loadingAgents ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400" />
                          <span className="ml-2 text-gray-400">
                            Loading agents...
                          </span>
                        </div>
                      ) : agents.length === 0 ? (
                        <p className="text-gray-400 text-center">
                          No agents available
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {agents.map((a) => (
                            <div
                              key={a.id}
                              className={`p-2 rounded border cursor-pointer transition-all ${
                                newPolicy.targetAgents.includes(a.id)
                                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                  : 'border-gray-600 hover:border-gray-500 text-gray-300'
                              }`}
                              onClick={() =>
                                setNewPolicy((p) => ({
                                  ...p,
                                  targetAgents: p.targetAgents.includes(a.id)
                                    ? p.targetAgents.filter((id) => id !== a.id)
                                    : [...p.targetAgents, a.id],
                                }))
                              }
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {a.name}
                                </span>
                                <Badge
                                  className={
                                    a.status === 'active'
                                      ? 'bg-green-500/20 text-green-400'
                                      : 'bg-gray-500/20 text-gray-400'
                                  }
                                >
                                  {a.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trigger Type */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-red-400" />
                      <Label className="text-gray-300 font-medium">
                        Trigger Type
                      </Label>
                      <Tooltip content="Condition that triggers the policy.">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Tooltip>
                    </div>
                    <Select
                      value={newPolicy.triggerType}
                      onValueChange={(v) =>
                        setNewPolicy((p) => ({ ...p, triggerType: v }))
                      }
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem
                          value="error_count"
                          className="text-white hover:bg-gray-700"
                        >
                          Error Count
                        </SelectItem>
                        <SelectItem
                          value="uptime"
                          className="text-white hover:bg-gray-700"
                        >
                          Uptime Threshold
                        </SelectItem>
                        <SelectItem
                          value="cost"
                          className="text-white hover:bg-gray-700"
                        >
                          Cost Threshold
                        </SelectItem>
                        <SelectItem
                          value="latency"
                          className="text-white hover:bg-gray-700"
                        >
                          Latency Threshold
                        </SelectItem>
                        <SelectItem
                          value="memory"
                          className="text-white hover:bg-gray-700"
                        >
                          Memory Usage
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Trigger Value */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor="triggerValue"
                        className="text-gray-300 font-medium"
                      >
                        Trigger Value
                      </Label>
                      <Tooltip content="Threshold to evaluate.">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Tooltip>
                    </div>
                    <Input
                      id="triggerValue"
                      type="number"
                      value={newPolicy.triggerValue}
                      onChange={(e) =>
                        setNewPolicy((p) => ({
                          ...p,
                          triggerValue: e.target.value,
                        }))
                      }
                      placeholder="10"
                      className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>

                  {/* Time Window */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <Label className="text-gray-300 font-medium">
                        Time Window
                      </Label>
                      <Tooltip content="Period over which trigger is evaluated.">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Tooltip>
                    </div>
                    <Select
                      value={newPolicy.timeWindow}
                      onValueChange={(v) =>
                        setNewPolicy((p) => ({ ...p, timeWindow: v }))
                      }
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem
                          value="1m"
                          className="text-white hover:bg-gray-700"
                        >
                          1 minute
                        </SelectItem>
                        <SelectItem
                          value="5m"
                          className="text-white hover:bg-gray-700"
                        >
                          5 minutes
                        </SelectItem>
                        <SelectItem
                          value="15m"
                          className="text-white hover:bg-gray-700"
                        >
                          15 minutes
                        </SelectItem>
                        <SelectItem
                          value="30m"
                          className="text-white hover:bg-gray-700"
                        >
                          30 minutes
                        </SelectItem>
                        <SelectItem
                          value="1h"
                          className="text-white hover:bg-gray-700"
                        >
                          1 hour
                        </SelectItem>
                        <SelectItem
                          value="6h"
                          className="text-white hover:bg-gray-700"
                        >
                          6 hours
                        </SelectItem>
                        <SelectItem
                          value="24h"
                          className="text-white hover:bg-gray-700"
                        >
                          24 hours
                        </SelectItem>
                        <SelectItem
                          value="custom"
                          className="text-white hover:bg-gray-700"
                        >
                          Custom
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Window Inputs */}
                  {newPolicy.timeWindow === 'custom' && (
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-gray-300 font-medium">
                        Custom Window
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={newPolicy.customTimeValue}
                          onChange={(e) =>
                            setNewPolicy((p) => ({
                              ...p,
                              customTimeValue: e.target.value,
                            }))
                          }
                          placeholder="30"
                          className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500 flex-1"
                        />
                        <Select
                          value={newPolicy.customTimeUnit}
                          onValueChange={(v) =>
                            setNewPolicy((p) => ({
                              ...p,
                              customTimeUnit: v,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem
                              value="seconds"
                              className="text-white hover:bg-gray-700"
                            >
                              Seconds
                            </SelectItem>
                            <SelectItem
                              value="minutes"
                              className="text-white hover:bg-gray-700"
                            >
                              Minutes
                            </SelectItem>
                            <SelectItem
                              value="hours"
                              className="text-white hover:bg-gray-700"
                            >
                              Hours
                            </SelectItem>
                            <SelectItem
                              value="days"
                              className="text-white hover:bg-gray-700"
                            >
                              Days
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label className="text-gray-300 font-medium">Action</Label>
                      <Tooltip content="What to do when triggered.">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Tooltip>
                    </div>
                    <Select
                      value={newPolicy.actionType}
                      onValueChange={(v) =>
                        setNewPolicy((p) => ({ ...p, actionType: v }))
                      }
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem
                          value="pause_agent"
                          className="text-white hover:bg-gray-700"
                        >
                          Pause Agent
                        </SelectItem>
                        <SelectItem
                          value="send_alert"
                          className="text-white hover:bg-gray-700"
                        >
                          Send Alert
                        </SelectItem>
                        <SelectItem
                          value="restart_agent"
                          className="text-white hover:bg-gray-700"
                        >
                          Restart Agent
                        </SelectItem>
                        <SelectItem
                          value="scale_down"
                          className="text-white hover:bg-gray-700"
                        >
                          Scale Down
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label className="text-gray-300 font-medium">
                        Priority
                      </Label>
                      <Tooltip content="Processing order when multiple triggers.">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Tooltip>
                    </div>
                    <Select
                      value={newPolicy.priority}
                      onValueChange={(v) =>
                        setNewPolicy((p) => ({ ...p, priority: v }))
                      }
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem
                          value="low"
                          className="text-white hover:bg-gray-700"
                        >
                          Low
                        </SelectItem>
                        <SelectItem
                          value="medium"
                          className="text-white hover:bg-gray-700"
                        >
                          Medium
                        </SelectItem>
                        <SelectItem
                          value="high"
                          className="text-white hover:bg-gray-700"
                        >
                          High
                        </SelectItem>
                        <SelectItem
                          value="critical"
                          className="text-white hover:bg-gray-700"
                        >
                          Critical
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* ReactFlow canvas */}
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
                    <MiniMap nodeColor="#3b82f6" maskColor="rgba(0, 0, 0, 0.8)" />
                  </ReactFlow>
                </div>

                {/* Summary + Save / Cancel */}
                <div className="flex space-x-4 items-center">
                  <Button
                    onClick={handleSavePolicy}
                    className="flex-1"
                    disabled={!newPolicy.name || !newPolicy.triggerValue}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Save Changes' : 'Create Policy'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setEditingId(null)
                      resetForm()
                    }}
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}