'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import {
  Calendar,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Activity,
  Plus,
  FileText,
  Bot,
  Trash2,
  Edit,
  BarChart3,
  X
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { CustomMetricModal } from '@/components/custom-metric-modal'

interface MetricData {
  timestamp: string
  value: number
  agentName?: string
}

const timeRanges = [
  { value: '1h', label: 'Last Hour' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' }
]

const metricTypes = [
  { value: 'uptime', label: 'Uptime History', color: '#10b981' },
  { value: 'error_rate', label: 'Error Rate', color: '#ef4444' },
  { value: 'cost', label: 'Cost Over Time', color: '#f59e0b' },
  { value: 'policy_triggers', label: 'Policy Triggers', color: '#8b5cf6' },
  { value: 'latency', label: 'Latency', color: '#06b6d4' }
]

export default function StatsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedAgent, setSelectedAgent] = useState<string>(
    searchParams.get('agent') || 'all'
  )
  const [selectedMetric, setSelectedMetric] = useState('uptime')
  const [timeRange, setTimeRange] = useState('24h')
  const [metricData, setMetricData] = useState<MetricData[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showMetricModal, setShowMetricModal] = useState(false)
  const [customMetrics, setCustomMetrics] = useState<any[]>([])
  const [creatingMetric, setCreatingMetric] = useState(false)
  const [showAiHelper, setShowAiHelper] = useState(false)
  const [aiHelperInput, setAiHelperInput] = useState('')
  const [aiHelperLoading, setAiHelperLoading] = useState(false)
  const [deletingMetricId, setDeletingMetricId] = useState<string | null>(null)

  // compute summary
  const summary = (() => {
    if (metricData.length === 0) return { current: 0, change: 0, trend: 'neutral' as const }
    const current = metricData[metricData.length - 1].value
    const previous = metricData[metricData.length - 2]?.value ?? current
    const change = previous === 0 ? 0 : ((current - previous) / previous) * 100
    return {
      current,
      change: isFinite(change) ? change : 0,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    }
  })()
  const currentMetric = metricTypes.find(m => m.value === selectedMetric)!

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status === 'authenticated') {
      fetchAgents()
      fetchMetricData()
      fetchCustomMetrics()
    }
  }, [status])

  useEffect(() => {
    fetchMetricData()
  }, [selectedAgent, selectedMetric, timeRange])

  async function fetchAgents() {
    setLoading(true)
    try {
      const wsId = session?.user?.workspaceId
      const res = await fetch(`/api/agents?workspaceId=${wsId}`)
      if (res.ok) setAgents(await res.json())
    } catch (e) {
      console.error('fetchAgents error', e)
    } finally {
      setLoading(false)
    }
  }

  async function fetchMetricData() {
    setLoading(true)
    try {
      const wsId = session?.user?.workspaceId || ''
      const params = new URLSearchParams({
        workspaceId: wsId,
        metric: selectedMetric,
        timeRange,
        ...(selectedAgent !== 'all' && { agentId: selectedAgent })
      })
      const res = await fetch(`/api/metrics?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setMetricData(
          data.map((d: any) => ({
            timestamp: new Date(d.timestamp).toLocaleTimeString(),
            value: d.value,
            agentName: d.agent?.name
          }))
        )
      }
    } catch (e) {
      console.error('fetchMetricData error', e)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCustomMetrics() {
    try {
      const res = await fetch('/api/custom-metrics')
      if (res.ok) setCustomMetrics(await res.json())
    } catch (e) {
      console.error('fetchCustomMetrics error', e)
    }
  }

  async function handleCreateCustomMetric(m: any) {
    setCreatingMetric(true)
    try {
      const res = await fetch('/api/custom-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(m)
      })
      if (res.ok) {
        const nm = await res.json()
        setCustomMetrics(prev => [...prev, nm])
        metricTypes.push({
          value: `custom_${nm.id}`,
          label: nm.name,
          color: nm.color || '#3b82f6'
        })
      }
    } catch (e) {
      console.error('handleCreateCustomMetric error', e)
    } finally {
      setCreatingMetric(false)
    }
  }

  async function handleDeleteCustomMetric(metricId: string) {
    setDeletingMetricId(metricId)
    try {
      const res = await fetch(`/api/custom-metrics/${metricId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setCustomMetrics(prev => prev.filter(m => m.id !== metricId))
        const index = metricTypes.findIndex(m => m.value === `custom_${metricId}`)
        if (index > -1) {
          metricTypes.splice(index, 1)
        }
        if (selectedMetric === `custom_${metricId}`) {
          setSelectedMetric('uptime')
        }
      }
    } catch (e) {
      console.error('handleDeleteCustomMetric error', e)
    } finally {
      setDeletingMetricId(null)
    }
  }

  async function handleAiHelperCreateMetric() {
    if (!aiHelperInput.trim()) return
    
    setAiHelperLoading(true)
    try {
      const res = await fetch('/api/ai-helper/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_metric',
          input: aiHelperInput,
          workspaceId: session?.user?.workspaceId
        })
      })
      
      if (res.ok) {
        const result = await res.json()
        if (result.success && result.metric) {
          setCustomMetrics(prev => [...prev, result.metric])
          metricTypes.push({
            value: `custom_${result.metric.id}`,
            label: result.metric.name,
            color: result.metric.color || '#3b82f6'
          })
          setAiHelperInput('')
          setShowAiHelper(false)
        }
      }
    } catch (e) {
      console.error('handleAiHelperCreateMetric error', e)
    } finally {
      setAiHelperLoading(false)
    }
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

  const timeLabel = timeRanges.find(r => r.value === timeRange)!.label
  const dataPoints = metricData.length
  const agentCount = selectedAgent === 'all' ? agents.length : 1

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Agent Analytics</h1>
            <p className="text-gray-400 mt-1">
              Monitor performance metrics and trends across your AI agents
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-gray-800/50 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map(r => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-48 bg-gray-800/50 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {agents.map(a => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48 bg-gray-800/50 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metricTypes.map(m => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Custom Metric Actions */}
          <div className="flex gap-2 ml-4">
            <Button
              onClick={() => setShowMetricModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={session?.user?.workspaceRole === 'VIEWER'}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Metric
            </Button>
            
            <Button
              onClick={() => setShowAiHelper(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={session?.user?.workspaceRole === 'VIEWER'}
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Create
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-panel border-blue-500/20">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Current {currentMetric.label}
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {selectedMetric === 'uptime'
                  ? `${summary.current.toFixed(1)}%`
                  : selectedMetric === 'cost'
                  ? `$${summary.current.toFixed(2)}`
                  : selectedMetric === 'latency'
                  ? `${summary.current.toFixed(0)}ms`
                  : summary.current.toFixed(0)}
              </div>
              <p
                className={`text-xs ${
                  summary.trend === 'up'
                    ? 'text-green-400'
                    : summary.trend === 'down'
                    ? 'text-red-400'
                    : 'text-gray-400'
                }`}
              >
                {summary.change > 0 ? '+' : ''}
                {summary.change.toFixed(1)}% from previous
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-gray-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Data Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dataPoints}</div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-gray-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Time Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{timeLabel}</div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-gray-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Agents Shown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{agentCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart */}
        <Card className="glass-panel border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white">{currentMetric.label} Over Time</CardTitle>
            <CardDescription className="text-gray-400">
              {selectedAgent === 'all'
                ? 'All agents'
                : agents.find(a => a.id === selectedAgent)?.name}{' '}
              – {timeLabel}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {selectedMetric === 'policy_triggers' ? (
                  <BarChart data={metricData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="timestamp" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="value" fill={currentMetric.color} radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={metricData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="timestamp" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={currentMetric.color}
                      strokeWidth={2}
                      dot={{ fill: currentMetric.color, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Custom Metrics Management */}
        {customMetrics.length > 0 && (
          <Card className="glass-panel border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                Custom Metrics
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your workspace custom metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customMetrics.map(metric => (
                  <div
                    key={metric.id}
                    className="bg-gray-800/30 border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: metric.color || '#3b82f6' }}
                        />
                        <h4 className="font-medium text-white">{metric.name}</h4>
                      </div>
                      {session?.user?.workspaceRole !== 'VIEWER' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCustomMetric(metric.id)}
                          disabled={deletingMetricId === metric.id}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          {deletingMetricId === metric.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-400" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-400">
                      <p><span className="text-gray-300">Unit:</span> {metric.unit || 'Number'}</p>
                      {metric.formula && (
                        <p><span className="text-gray-300">Formula:</span> {metric.formula}</p>
                      )}
                      {metric.grouping && (
                        <p><span className="text-gray-300">Group:</span> {metric.grouping}</p>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMetric(`custom_${metric.id}`)}
                      className="w-full mt-3 text-xs"
                    >
                      View Chart
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Helper Modal */}
        {showAiHelper && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="glass-panel border-purple-500/20 w-full max-w-lg">
              <CardHeader className="flex items-center justify-between pb-4">
                <div className="flex items-center space-x-2 text-white text-xl">
                  <Bot className="w-5 h-5 text-purple-400" />
                  <span>AI Metric Creator</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowAiHelper(false)}>
                  <X className="w-4 h-4 text-gray-400 hover:text-white" />
                </Button>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-300 mb-2">Examples:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• "Create a metric tracking average latency called SLA Latency"</li>
                      <li>• "Add a success rate metric in percentage for performance group"</li>
                      <li>• "Make a cost metric showing daily spend in dollars"</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="aiInput" className="text-gray-300 text-sm font-medium">
                      Describe the metric you want to create:
                    </label>
                    <textarea
                      id="aiInput"
                      value={aiHelperInput}
                      onChange={(e) => setAiHelperInput(e.target.value)}
                      placeholder="e.g., Create a metric tracking average response time in milliseconds for the performance group"
                      className="w-full h-24 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleAiHelperCreateMetric}
                      disabled={!aiHelperInput.trim() || aiHelperLoading}
                      className="command-button flex-1"
                    >
                      {aiHelperLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Bot className="w-4 h-4 mr-2" />
                          Create Metric
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAiHelper(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <CustomMetricModal
          isOpen={showMetricModal}
          onClose={() => setShowMetricModal(false)}
          onSubmit={handleCreateCustomMetric}
        />
      </div>
    </DashboardLayout>
  )
}
