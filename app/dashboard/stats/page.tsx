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
  FileText
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
      const wsId = session?.user?.workspaceId
      const res = await fetch(`/api/custom-metrics?workspaceId=${wsId}`)
      if (res.ok) setCustomMetrics(await res.json())
    } catch (e) {
      console.error('fetchCustomMetrics error', e)
    }
  }

  async function handleCreateCustomMetric(m: any) {
    setCreatingMetric(true)
    try {
      const wsId = session?.user?.workspaceId
      const res = await fetch(`/api/custom-metrics?workspaceId=${wsId}`, {
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

          {/* 👇 now disabled by workspaceRole */}
          <Button
            onClick={() => setShowMetricModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white ml-4"
            disabled={session?.user?.workspaceRole === 'VIEWER'}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Metric
          </Button>
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

        {/* Additional Insights & Quick Actions */}
        {/* …keep your existing “Additional Insights” and “Quick Actions” here… */}

        <CustomMetricModal
          isOpen={showMetricModal}
          onClose={() => setShowMetricModal(false)}
          onSubmit={handleCreateCustomMetric}
        />
      </div>
    </DashboardLayout>
  )
}