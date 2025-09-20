'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, Download, Loader2, MessageSquare, Play, Save, Send, User, X } from 'lucide-react'
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

useEffect(() => {
  if (!status || status === 'loading') return

  if (status === 'unauthenticated') {
    router.push('/login')
    return
  }

  if (!session) return

  if (editAgentId) {
    loadExistingAgent(editAgentId)
  } else {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Welcome to Create AI! I\'m here to help you build custom AI agents for Control Room.\n\nI can generate complete, production-ready agents with all required files (agent.js, package.json, config.json, README.md).\n\nTo get started, describe the agent you want to build - what should it do, when should it run, and what services should it integrate with?',
      timestamp: new Date()
    }])
  }
}, [status, session, editAgentId, router])

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
    
    if (agentFiles.length === 0) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'No agent files to save. Please generate an agent first.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      return
    }
    
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
        const successMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Agent saved successfully!',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, successMessage])
        if (!editAgentId) {
          router.push(`/dashboard/create?edit=${data.agentId}`)
        }
      } else {
        const errorData = await response.json()
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Save failed: ${errorData.error || 'Unknown error'}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (err) {
      console.error('Failed to save agent:', err)
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Save failed due to a network error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSaving(false)
    }
  }

  async function deployAgent() {
    if (!generatedAgent && !editAgentId) return
    
    if (agentFiles.length === 0) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'No agent files to deploy. Please generate an agent first.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      return
    }

    const requiredFiles = ['agent.js', 'package.json', 'config.json', 'README.md']
    const missingFiles = requiredFiles.filter(file => 
      !agentFiles.some(f => f.path === file)
    )

    if (missingFiles.length > 0) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Missing required files for deployment: ${missingFiles.join(', ')}. Please regenerate the agent with all required files.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      return
    }
    
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
        const successMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Agent deployed successfully! Redirecting to dashboard...',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, successMessage])
        setTimeout(() => router.push('/dashboard'), 2000)
      } else {
        const errorData = await response.json()
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Deployment failed: ${errorData.error || 'Unknown error'}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (err) {
      console.error('Failed to deploy agent:', err)
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Deployment failed due to a network error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
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

  function downloadAgent() {
    if (!generatedAgent && agentFiles.length === 0) return

    const files = agentFiles.length > 0 ? agentFiles : generatedAgent?.files || []
    const agentName = generatedAgent?.name || 'agent'
    
    files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.path
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
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

  const role = session?.user?.workspaceRole
  const canModify = role === 'ADMIN' || role === 'MANAGER'

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
              <Button variant="outline" onClick={downloadAgent} disabled={isSaving || isDeploying}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              {canModify && (
                <>
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
                  <Button onClick={deployAgent} disabled={isSaving || isDeploying} className="deploy-button">
                    {isDeploying ? (
                      <Loader2 className="button-icon animate-spin" />
                    ) : (
                      <Play className="button-icon" />
                    )}
                    Instant Deploy
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {!editAgentId && (
            <Card className="create-chat-card flex flex-col">
              <CardHeader>
                <CardTitle className="chat-title">
                  <MessageSquare className="chat-icon" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
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

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Describe your agent..."
                    disabled={isGenerating}
                    className="flex-1 form-input-enhanced"
                  />
                  <Button onClick={sendMessage} disabled={!inputMessage.trim() || isGenerating || !canModify}>                   
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
      
      <style jsx>{`
        .create-chat-card {
          background: linear-gradient(180deg, rgba(14,20,36,.85), rgba(10,14,26,.98));
          border: 1px solid rgba(79, 106, 255, 0.2);
          border-radius: 24px;
          box-shadow: 0 34px 90px rgba(0,0,0,.55), 0 6px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
          backdrop-filter: blur(24px);
        }

        .chat-title {
          display: flex;
          align-items: center;
          color: #FFFFFF;
        }

        .chat-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.5rem;
        }

        .deploy-button {
          background: linear-gradient(135deg, #8A7FFF, #4F6AFF);
          border: none;
          color: #FFFFFF;
          box-shadow: 0 8px 20px rgba(79,106,255,.25);
          border-radius: 12px;
          font-weight: 600;
          padding: 0 1rem;
          height: 2.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .deploy-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(79,106,255,.35);
        }

        .button-icon {
          width: 1rem;
          height: 1rem;
        }
      `}</style>
    </DashboardLayout>
  )
}
