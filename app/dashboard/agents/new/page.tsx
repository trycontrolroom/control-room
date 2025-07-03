'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Upload, Link as LinkIcon, Code, Save, ArrowLeft, AlertCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'
import Link from 'next/link'

export default function NewAgentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connectionType, setConnectionType] = useState<'file' | 'repo' | 'api'>('file')
  
  const [agentData, setAgentData] = useState({
    name: '',
    description: '',
    tags: '',
    instructions: '',
    repoUrl: '',
    apiEndpoint: '',
    apiKey: '',
    file: null as File | null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const config = {
        connectionType,
        ...(connectionType === 'repo' && { repoUrl: agentData.repoUrl }),
        ...(connectionType === 'api' && { 
          apiEndpoint: agentData.apiEndpoint,
          apiKey: agentData.apiKey 
        }),
        tags: agentData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        instructions: agentData.instructions
      }

      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: agentData.name,
          description: agentData.description,
          config
        })
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create agent')
      }
    } catch (error) {
      console.error('Failed to create agent:', error)
      setError('Failed to create agent. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canModifyAgents = session?.user?.role !== 'VIEWER'

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Deploy New Agent</h1>
            <p className="text-gray-400 mt-1">Connect your AI agent to the command center</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-panel border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">Agent Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Agent Name *</Label>
                  <Input
                    id="name"
                    value={agentData.name}
                    onChange={(e) => setAgentData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My AI Assistant"
                    className="bg-gray-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-gray-300">Tags</Label>
                  <Input
                    id="tags"
                    value={agentData.tags}
                    onChange={(e) => setAgentData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="customer-service, automation"
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-500">Separate tags with commas</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Description *</Label>
                <Textarea
                  id="description"
                  value={agentData.description}
                  onChange={(e) => setAgentData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this agent does..."
                  className="bg-gray-800/50 border-gray-600 text-white min-h-20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions" className="text-gray-300">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={agentData.instructions}
                  onChange={(e) => setAgentData(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Special instructions for this agent..."
                  className="bg-gray-800/50 border-gray-600 text-white min-h-20"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">Connection Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { type: 'file', icon: Upload, label: 'Upload File', desc: 'Upload agent code or config' },
                  { type: 'repo', icon: LinkIcon, label: 'Repository URL', desc: 'Connect via Git repository' },
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
                  <Label htmlFor="file" className="text-gray-300">Upload Agent File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setAgentData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    accept=".py,.js,.json,.yaml,.yml,.zip"
                  />
                  <p className="text-xs text-gray-500">Supported formats: .py, .js, .json, .yaml, .yml, .zip</p>
                </div>
              )}

              {connectionType === 'repo' && (
                <div className="space-y-2">
                  <Label htmlFor="repoUrl" className="text-gray-300">Repository URL</Label>
                  <Input
                    id="repoUrl"
                    value={agentData.repoUrl}
                    onChange={(e) => setAgentData(prev => ({ ...prev, repoUrl: e.target.value }))}
                    placeholder="https://github.com/user/agent-repo"
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-500">Public GitHub repository URL</p>
                </div>
              )}

              {connectionType === 'api' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiEndpoint" className="text-gray-300">API Endpoint</Label>
                    <Input
                      id="apiEndpoint"
                      value={agentData.apiEndpoint}
                      onChange={(e) => setAgentData(prev => ({ ...prev, apiEndpoint: e.target.value }))}
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
                      onChange={(e) => setAgentData(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="sk-..."
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button 
              type="submit" 
              className="command-button"
              disabled={loading || !agentData.name || !agentData.description}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Deploying...' : 'Deploy Agent'}
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" className="border-gray-600 hover:bg-gray-700/50">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
