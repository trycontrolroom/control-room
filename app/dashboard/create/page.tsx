'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Code,
  Save,
  Trash2,
  Play,
  FileText,
  Folder,
  FolderOpen,
  Plus,
  X,
  Send,
  Bot,
  User,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { CodeEditor } from '@/components/code-editor'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface AgentFile {
  id?: string
  path: string
  content: string
  isNew?: boolean
}

interface GeneratedAgent {
  name: string
  description: string
  files: AgentFile[]
  config: any
}

export default function CreatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editAgentId = searchParams.get('edit')
  
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAgent, setGeneratedAgent] = useState<GeneratedAgent | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [agentFiles, setAgentFiles] = useState<AgentFile[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const canModify = session?.user?.workspaceRole === 'ADMIN' || session?.user?.workspaceRole === 'MANAGER'

  useEffect(() => {
    if (status === 'loading') {
      return // Wait for session to load
    }
    
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    
    if (session && !canModify) {
      router.push('/dashboard')
      return
    }
    
    if (session && canModify) {
      if (editAgentId) {
        loadExistingAgent(editAgentId)
      } else {
        setMessages([{
          id: '1',
          role: 'assistant',
          content: 'Welcome to the AI Agent Builder! Describe the agent you want to build, and I\'ll help you create it step by step.',
          timestamp: new Date()
        }])
      }
    }
  }, [status, session, canModify, editAgentId, router])

  async function loadExistingAgent(agentId: string) {
    try {
      const response = await fetch(`/api/agents/${agentId}/files`)
      if (response.ok) {
        const files: AgentFile[] = await response.json()
        setAgentFiles(files)
      }
    } catch (err) {
      console.error('Failed to load agent files:', err)
    }
  }

  async function sendMessage() {
    if (!inputMessage.trim() || isGenerating) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsGenerating(true)

    try {
      const response = await fetch('/api/agents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          workspaceId: session?.user?.workspaceId
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])

        if (data.generatedAgent) {
          setGeneratedAgent(data.generatedAgent)
          setAgentFiles(data.generatedAgent.files)
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  function handleFilesChange(newFiles: AgentFile[]) {
    setAgentFiles(newFiles)
    setHasUnsavedChanges(true)
  }

  async function saveAgent() {
    if (!generatedAgent && !editAgentId) return
    
    setIsSaving(true)
    try {
      const endpoint = editAgentId ? `/api/agents/${editAgentId}/files` : '/api/agents'
      const method = editAgentId ? 'PATCH' : 'POST'
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: generatedAgent?.name || 'Untitled Agent',
          description: generatedAgent?.description || '',
          files: agentFiles,
          config: generatedAgent?.config || {},
          workspaceId: session?.user?.workspaceId
        })
      })

      if (response.ok) {
        setHasUnsavedChanges(false)
        const data = await response.json()
        if (!editAgentId) {
          router.push(`/dashboard/create?edit=${data.agentId}`)
        }
      }
    } catch (err) {
      console.error('Failed to save agent:', err)
    } finally {
      setIsSaving(false)
    }
  }

  async function deployAgent() {
    if (!generatedAgent && !editAgentId) return
    
    setIsDeploying(true)
    try {
      const agentId = editAgentId || 'new'
      const response = await fetch(`/api/agents/${agentId}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: generatedAgent?.name || 'Untitled Agent',
          description: generatedAgent?.description || '',
          files: agentFiles,
          config: generatedAgent?.config || {},
          workspaceId: session?.user?.workspaceId
        })
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Failed to deploy agent:', err)
    } finally {
      setIsDeploying(false)
    }
  }

  function discardChanges() {
    if (editAgentId) {
      loadExistingAgent(editAgentId)
    } else {
      setGeneratedAgent(null)
      setAgentFiles([])
    }
    setHasUnsavedChanges(false)
  }


  if (status === 'loading') {
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
            <h1 className="text-3xl font-bold text-white">
              {editAgentId ? 'Edit Agent' : 'Create Agent'}
            </h1>
            <p className="text-gray-400 mt-1">
              {editAgentId ? 'Modify your AI agent code and configuration' : 'Build a new AI agent with guided assistance'}
            </p>
          </div>
          {(generatedAgent || editAgentId) && (
            <div className="flex space-x-3">
              <Button variant="outline" onClick={discardChanges} disabled={isSaving || isDeploying}>
                <X className="w-4 h-4 mr-2" />
                Discard
              </Button>
              <Button onClick={saveAgent} disabled={isSaving || isDeploying}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
              <Button onClick={deployAgent} disabled={isSaving || isDeploying} className="command-button">
                {isDeploying ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Instant Deploy
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Chat Interface */}
          {!editAgentId && (
            <Card className="glass-panel border-blue-500/20 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map(message => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-blue-500/20 border border-blue-500/50' 
                            : 'bg-gray-700 border border-gray-600'
                        }`}>
                          <p className="text-white text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-700 border border-gray-600 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                            <span className="text-white text-sm">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Describe your agent..."
                    disabled={isGenerating}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
                  />
                  <Button onClick={sendMessage} disabled={!inputMessage.trim() || isGenerating}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Code Editor */}
          <CodeEditor
            agentId={editAgentId || undefined}
            files={agentFiles}
            onFilesChange={handleFilesChange}
            onSave={saveAgent}
            onDiscard={discardChanges}
            canModify={canModify}
            hasUnsavedChanges={hasUnsavedChanges}
            isSaving={isSaving}
            className={editAgentId ? 'lg:col-span-2' : ''}
            showActions={false}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
