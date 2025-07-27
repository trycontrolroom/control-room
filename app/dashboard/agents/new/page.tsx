'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Upload,
  Link as LinkIcon,
  Code,
  Save,
  ArrowLeft,
  AlertCircle
} from 'lucide-react'

export default function NewAgentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connectionType, setConnectionType] = useState<'file' | 'repo' | 'api'>('file')
  const [file, setFile] = useState<File | null>(null)
  const [agentData, setAgentData] = useState({
    name: '',
    description: '',
    instructions: '',
    tags: '',
    repoUrl: '',
    apiEndpoint: '',
    apiKey: ''
  })

  // Only MANAGER or ADMIN can deploy
  const canModifyAgents = session?.user?.workspaceRole !== 'VIEWER'
  if (!canModifyAgents) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Access Restricted</h2>
            <p className="text-gray-400">You need Manager or Admin permissions to deploy agents.</p>
            <Link href="/dashboard">
              <Button className="mt-4 command-button">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!agentData.name.trim() || !agentData.description.trim()) {
      setError('Name and description are required')
      setLoading(false)
      return
    }

    // Build the config object
    const config: any = {
      connectionType,
      tags: agentData.tags.split(',').map(t => t.trim()).filter(Boolean),
      instructions: agentData.instructions
    }
    if (connectionType === 'repo') config.repoUrl = agentData.repoUrl
    if (connectionType === 'api') {
      config.apiEndpoint = agentData.apiEndpoint
      config.apiKey = agentData.apiKey
    }

    try {
      let res: Response
      if (file) {
        // multipart/form-data
        const formData = new FormData()
        formData.append('name', agentData.name)
        formData.append('description', agentData.description)
        formData.append('config', JSON.stringify(config))
        formData.append('file', file)
        res = await fetch('/api/agents', { method: 'POST', body: formData })
      } else {
        // JSON
        res = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: agentData.name,
            description: agentData.description,
            config
          })
        })
      }

      if (res.ok) {
        router.push('/dashboard')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to create agent')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to create agent. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Deploy New Agent</h1>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400 inline-block mr-2" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agent Details */}
          <Card className="glass-panel border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">Agent Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Name *</Label>
                <Input
                  id="name"
                  value={agentData.name}
                  onChange={e => setAgentData(s => ({ ...s, name: e.target.value }))}
                  placeholder="My AI Assistant"
                  className="bg-gray-800/50 border-gray-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Description *</Label>
                <Textarea
                  id="description"
                  value={agentData.description}
                  onChange={e => setAgentData(s => ({ ...s, description: e.target.value }))}
                  placeholder="What this agent does..."
                  className="bg-gray-800/50 border-gray-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions" className="text-gray-300">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={agentData.instructions}
                  onChange={e => setAgentData(s => ({ ...s, instructions: e.target.value }))}
                  placeholder="Usage notes..."
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-gray-300">Tags</Label>
                <Input
                  id="tags"
                  value={agentData.tags}
                  onChange={e => setAgentData(s => ({ ...s, tags: e.target.value }))}
                  placeholder="support, automation"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-500">Separate tags with commas</p>
              </div>
            </CardContent>
          </Card>

          {/* Connection Method */}
          <Card className="glass-panel border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">Connection Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { type: 'file', icon: Upload, label: 'Upload File', desc: 'Upload code or model' },
                  { type: 'repo', icon: LinkIcon, label: 'Repository URL', desc: 'Connect via Git repo' },
                  { type: 'api', icon: Code, label: 'API Connection', desc: 'Connect via API endpoint' }
                ].map(({ type, icon: Icon, label, desc }) => (
                  <div
                    key={type}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      connectionType === type
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setConnectionType(type as any)}
                  >
                    <Icon className="w-6 h-6 text-blue-400 mb-2" />
                    <h3 className="font-medium text-white mb-1">{label}</h3>
                    <p className="text-sm text-gray-400">{desc}</p>
                  </div>
                ))}
              </div>

              {connectionType === 'file' && (
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-gray-300">Upload File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".py,.js,.json,.yaml,.zip"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>
              )}

              {connectionType === 'repo' && (
                <div className="space-y-2">
                  <Label htmlFor="repoUrl" className="text-gray-300">Repository URL</Label>
                  <Input
                    id="repoUrl"
                    value={agentData.repoUrl}
                    onChange={e => setAgentData(s => ({ ...s, repoUrl: e.target.value }))}
                    placeholder="https://github.com/user/agent-repo"
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>
              )}

              {connectionType === 'api' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="apiEndpoint" className="text-gray-300">API Endpoint</Label>
                    <Input
                      id="apiEndpoint"
                      value={agentData.apiEndpoint}
                      onChange={e => setAgentData(s => ({ ...s, apiEndpoint: e.target.value }))}
                      placeholder="https://api.example.com/agent"
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey" className="text-gray-300">API Key (Optional)</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={agentData.apiKey}
                      onChange={e => setAgentData(s => ({ ...s, apiKey: e.target.value }))}
                      placeholder="sk-..."
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="command-button"
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Deploying…' : 'Deploy Agent'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  )
}