'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Download,
  Filter,
  Calendar,
  User,
  Activity,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

interface AuditLog {
  id: string
  userId: string
  workspaceId: string | null
  action: string
  details: any
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

export default function AuditLogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  })
  const [filters, setFilters] = useState({
    action: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  })
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) {
      router.push('/login')
      return
    }
    if (session.user.workspaceRole !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchLogs()
  }, [session, status, pagination.page, filters])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.action && { action: filters.action }),
        ...(filters.search && { search: filters.search }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo })
      })

      const res = await fetch(`/api/audit-logs?${params}`)
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      setExporting(true)
      const params = new URLSearchParams({
        format: 'csv',
        ...(filters.action && { action: filters.action }),
        ...(filters.search && { search: filters.search }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo })
      })

      const res = await fetch(`/api/audit-logs/export?${params}`)
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to export audit logs:', error)
    } finally {
      setExporting(false)
    }
  }

  const getActionBadgeColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (action.includes('DELETE')) return 'bg-red-500/20 text-red-400 border-red-500/30'
    if (action.includes('UPDATE') || action.includes('EDIT')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    if (action.includes('LOGIN') || action.includes('AUTH')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  const formatDetails = (details: any) => {
    if (!details) return 'N/A'
    if (typeof details === 'string') return details
    if (typeof details === 'object') {
      return Object.entries(details)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    }
    return JSON.stringify(details)
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

  if (session?.user?.workspaceRole !== 'ADMIN') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Access Denied</h3>
            <p className="text-gray-400">You need admin privileges to view audit logs.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
            <p className="text-gray-400">Monitor all system activities and user actions</p>
          </div>
          <Button
            onClick={handleExportCSV}
            disabled={exporting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search logs..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Action Type
                </label>
                <Select
                  value={filters.action}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="All actions" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="">All actions</SelectItem>
                    <SelectItem value="CREATE">Create</SelectItem>
                    <SelectItem value="UPDATE">Update</SelectItem>
                    <SelectItem value="DELETE">Delete</SelectItem>
                    <SelectItem value="LOGIN">Login</SelectItem>
                    <SelectItem value="AGENT">Agent Actions</SelectItem>
                    <SelectItem value="POLICY">Policy Actions</SelectItem>
                    <SelectItem value="METRIC">Metric Actions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Date From
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Date To
                </label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setFilters({ action: '', search: '', dateFrom: '', dateTo: '' })
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Activity Log ({pagination.total} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Timestamp</TableHead>
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-gray-300">Action</TableHead>
                    <TableHead className="text-gray-300">Details</TableHead>
                    <TableHead className="text-gray-300">IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="border-gray-700">
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <div className="font-medium">{log.user.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-400">{log.user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 max-w-xs truncate">
                        {formatDetails(log.details)}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {log.ipAddress || 'Unknown'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {logs.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No audit logs found</h3>
                <p className="text-gray-400">Try adjusting your filters or check back later.</p>
              </div>
            )}

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page <= 1}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-400">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= pagination.pages}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
