'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Calendar, TrendingUp, AlertTriangle, DollarSign, Activity, Plus, Bell, FileText } from 'lucide-react'
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
  
  const [selectedAgent, setSelectedAgent] = useState<string>(searchParams.get('agent') || 'all')
  const [selectedMetric, setSelectedMetric] = useState('uptime')
  const [timeRange, setTimeRange] = useState('24h')
  const [metricData, setMetricData] = useState<MetricData[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showMetricModal, setShowMetricModal] = useState(false)
  const [customMetrics, setCustomMetrics] = useState<any[]>([])
  const [creatingMetric, setCreatingMetric] = useState(false)

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
  }, [status, router])

  useEffect(() => {
    fetchMetricData()
  }, [selectedAgent, selectedMetric, timeRange])

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      if (response.ok) {
        const data = await response.json()
        setAgents(data)
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    }
  }

  const fetchMetricData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        metric: selectedMetric,
        timeRange,
        ...(selectedAgent !== 'all' && { agentId: selectedAgent })
      })

      const response = await fetch(`/api/metrics?${params}`)
      if (response.ok) {
        const data = await response.json()
        
        const transformedData = data.map((item: any) => ({
          timestamp: new Date(item.timestamp).toLocaleTimeString(),
          value: item.value,
          agentName: item.agent?.name
        }))
        
        setMetricData(transformedData)
      }
    } catch (error) {
      console.error('Failed to fetch metric data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomMetrics = async () => {
    try {
      const response = await fetch('/api/custom-metrics')
      if (response.ok) {
        const data = await response.json()
        setCustomMetrics(data)
      }
    } catch (error) {
      console.error('Failed to fetch custom metrics:', error)
    }
  }

  const handleCreateCustomMetric = async (metricData: any) => {
    setCreatingMetric(true)
    try {
      const response = await fetch('/api/custom-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metricData)
      })

      if (response.ok) {
        const newMetric = await response.json()
        setCustomMetrics(prev => [...prev, newMetric])
        
        const newMetricType = {
          value: `custom_${newMetric.id}`,
          label: newMetric.name,
          color: newMetric.color || '#3b82f6'
        }
        metricTypes.push(newMetricType)
      } else {
        console.error('Failed to create custom metric')
      }
    } catch (error) {
      console.error('Error creating custom metric:', error)
    } finally {
      setCreatingMetric(false)
    }
  }

  const navigateToRealTimeDashboard = () => {
    router.push('/dashboard')
  }

  const openAlertConfiguration = () => {
    router.push('/dashboard/settings')
  }

  const generatePerformanceReport = async () => {
    alert('Performance report generation feature coming soon!')
  }

  const getCurrentMetric = () => {
    return metricTypes.find(m => m.value === selectedMetric) || metricTypes[0]
  }

  const getMetricSummary = () => {
    if (metricData.length === 0) return { current: 0, change: 0, trend: 'neutral' }
    
    const current = metricData[metricData.length - 1]?.value || 0
    const previous = metricData[metricData.length - 2]?.value || 0
    const change = ((current - previous) / previous) * 100
    
    return {
      current,
      change: isFinite(change) ? change : 0,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    }
  }

  const summary = getMetricSummary()
  const currentMetric = getCurrentMetric()

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
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
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
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48 bg-gray-800/50 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metricTypes.map((metric) => (
                <SelectItem key={metric.value} value={metric.value}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={() => setShowMetricModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white ml-4"
            disabled={session?.user?.role === 'VIEWER'}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Metric
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-panel border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Current {currentMetric.label}
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {selectedMetric === 'uptime' ? `${summary.current.toFixed(1)}%` :
                 selectedMetric === 'cost' ? `$${summary.current.toFixed(2)}` :
                 selectedMetric === 'latency' ? `${summary.current.toFixed(0)}ms` :
                 summary.current.toFixed(0)}
              </div>
              <p className={`text-xs ${
                summary.trend === 'up' ? 'text-green-400' :
                summary.trend === 'down' ? 'text-red-400' :
                'text-gray-400'
              }`}>
                {summary.change > 0 ? '+' : ''}{summary.change.toFixed(1)}% from previous
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Average Uptime</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">98.5%</div>
              <p className="text-xs text-green-400">+2.1% from last period</p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Errors</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">23</div>
              <p className="text-xs text-red-400">-15% from last period</p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$247.83</div>
              <p className="text-xs text-yellow-400">+8.2% from last period</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart */}
        <Card className="glass-panel border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white">{currentMetric.label} Over Time</CardTitle>
            <CardDescription className="text-gray-400">
              {selectedAgent === 'all' ? 'All agents' : agents.find(a => a.id === selectedAgent)?.name} - {timeRanges.find(r => r.value === timeRange)?.label}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {selectedMetric === 'policy_triggers' ? (
                  <BarChart data={metricData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#9ca3af"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill={currentMetric.color}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={metricData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#9ca3af"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      fontSize={12}
                    />
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
                      dot={{ fill: currentMetric.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: currentMetric.color, strokeWidth: 2 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-panel border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agents.length > 0 ? (
                <>
                  {(() => {
                    const bestAgent = agents.reduce((best, agent) => 
                      (agent.uptime || 0) > (best.uptime || 0) ? agent : best
                    );
                    return (
                      <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div>
                          <p className="text-sm font-medium text-green-400">Best Performing Agent</p>
                          <p className="text-white">{bestAgent.name} - {(bestAgent.uptime || 0).toFixed(1)}% uptime</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                    );
                  })()}
                  
                  {(() => {
                    const problemAgent = agents.reduce((worst, agent) => 
                      (agent.errorCount || 0) > (worst.errorCount || 0) ? agent : worst
                    );
                    return problemAgent.errorCount > 0 ? (
                      <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div>
                          <p className="text-sm font-medium text-red-400">Needs Attention</p>
                          <p className="text-white">{problemAgent.name} - {problemAgent.errorCount} errors today</p>
                        </div>
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                    ) : null;
                  })()}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No agents available for insights</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={navigateToRealTimeDashboard}
                className="w-full command-button justify-start"
              >
                <Activity className="w-4 h-4 mr-2" />
                View Real-time Dashboard
              </Button>
              <Button 
                onClick={generatePerformanceReport}
                variant="outline" 
                className="w-full justify-start border-gray-600 hover:bg-gray-700/50"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button 
                onClick={openAlertConfiguration}
                variant="outline" 
                className="w-full justify-start border-gray-600 hover:bg-gray-700/50"
              >
                <Bell className="w-4 h-4 mr-2" />
                Configure Alerts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Custom Metric Modal */}
        <CustomMetricModal
          isOpen={showMetricModal}
          onClose={() => setShowMetricModal(false)}
          onSubmit={handleCreateCustomMetric}
        />
      </div>
    </DashboardLayout>
  )
}
