'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Settings,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  BarChart3,
  Shield,
  Minimize2,
  Maximize2
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface AISuggestion {
  type: 'policy' | 'metric' | 'task'
  title: string
  description: string
  data: any
}

interface AIHelperProps {
  onSidebarToggle?: () => void
  isInSidebarSpace?: boolean
}

export function AIHelper({ onSidebarToggle, isInSidebarSpace = false }: AIHelperProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'explain' | 'action'>('explain')
  const [pendingSuggestion, setPendingSuggestion] = useState<AISuggestion | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (session?.user?.id && isOpen && !sessionId) {
      initializeChatSession()
    }
  }, [session?.user?.id, isOpen, sessionId])

  async function initializeChatSession() {
    try {
      const response = await fetch('/api/ai-helper/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: session?.user?.workspaceId
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSessionId(data.sessionId)
        
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.createdAt)
          })))
        } else {
          const welcomeMessage: ChatMessage = {
            id: 'welcome',
            role: 'assistant',
            content: `Hello! I'm your AI assistant for Control Room. I can help you in two ways:

**Explain Mode** (current): I can explain features, analyze your data, and answer questions about the platform.

**Action Mode**: I can help create policies, custom metrics, and tasks when you ask.

Switch modes using the toggle above. What would you like to know about?`,
            timestamp: new Date()
          }
          setMessages([welcomeMessage])
        }
      }
    } catch (error) {
      console.error('Failed to initialize chat session:', error)
    }
  }

  async function sendMessage() {
    if (!inputMessage.trim() || !sessionId || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-helper/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMessage.content,
          mode,
          workspaceId: session?.user?.workspaceId
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])

        if (data.suggestion && mode === 'action') {
          setPendingSuggestion(data.suggestion)
          setShowConfirmation(true)
        }
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  async function executeSuggestion() {
    if (!pendingSuggestion) return

    setIsLoading(true)
    setShowConfirmation(false)

    try {
      let endpoint = ''
      let payload = pendingSuggestion.data

      switch (pendingSuggestion.type) {
        case 'policy':
          endpoint = '/api/policies'
          break
        case 'metric':
          endpoint = '/api/custom-metrics'
          break
        case 'task':
          endpoint = `/api/agents/${payload.agentId}/tasks`
          break
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        
        const successMessage: ChatMessage = {
          id: `success-${Date.now()}`,
          role: 'assistant',
          content: `✅ Successfully created ${pendingSuggestion.type}: "${pendingSuggestion.title}"`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, successMessage])

        await fetch('/api/audit-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: `AI_HELPER_CREATE_${pendingSuggestion.type.toUpperCase()}`,
            details: {
              title: pendingSuggestion.title,
              description: pendingSuggestion.description,
              resultId: result.id
            }
          })
        })
      } else {
        throw new Error(`Failed to create ${pendingSuggestion.type}`)
      }
    } catch (error) {
      console.error('Failed to execute suggestion:', error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `❌ Failed to create ${pendingSuggestion.type}. Please try again or create it manually.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setPendingSuggestion(null)
    }
  }

  function toggleOpen() {
    setIsOpen(!isOpen)
    if (onSidebarToggle) {
      onSidebarToggle()
    }
  }

  function getSuggestionIcon(type: string) {
    switch (type) {
      case 'policy':
        return <Shield className="w-4 h-4" />
      case 'metric':
        return <BarChart3 className="w-4 h-4" />
      case 'task':
        return <FileText className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  if (!session?.user?.id) {
    return null
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full command-button shadow-lg z-50 hover:scale-110 transition-transform"
          size="sm"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}

      {/* AI Helper Panel */}
      {isOpen && (
        <div className={`${
          isInSidebarSpace 
            ? 'fixed right-0 top-0 w-64 h-full z-40' 
            : `fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'}`
        } transition-all duration-300`}>
          <Card className={`${
            isInSidebarSpace 
              ? 'glass-panel border-purple-500/20 h-full flex flex-col rounded-none border-l-0' 
              : 'glass-panel border-purple-500/20 h-full flex flex-col'
          }`}>
            {/* Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  <Bot className="w-5 h-5 mr-2 text-purple-400" />
                  AI Assistant
                  <Badge 
                    variant="outline" 
                    className={`ml-2 text-xs ${
                      mode === 'action' 
                        ? 'border-orange-500/50 text-orange-400' 
                        : 'border-blue-500/50 text-blue-400'
                    }`}
                  >
                    {mode === 'action' ? 'Action Mode' : 'Explain Mode'}
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-1">
                  {!isInSidebarSpace && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 p-0"
                    >
                      {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={toggleOpen}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {!isMinimized && (
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    size="sm"
                    variant={mode === 'explain' ? 'default' : 'outline'}
                    onClick={() => setMode('explain')}
                    className="text-xs"
                  >
                    Explain Mode
                  </Button>
                  <Button
                    size="sm"
                    variant={mode === 'action' ? 'default' : 'outline'}
                    onClick={() => setMode('action')}
                    className="text-xs"
                  >
                    Action Mode
                  </Button>
                </div>
              )}
            </CardHeader>

            {(!isMinimized || isInSidebarSpace) && (
              <CardContent className="flex-1 flex flex-col min-h-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500/20 text-blue-100 border border-blue-500/30'
                            : 'bg-gray-700/50 text-gray-100 border border-gray-600/30'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <Bot className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                          )}
                          {message.role === 'user' && (
                            <User className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700/50 border border-gray-600/30 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-purple-400" />
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-gray-300">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={
                      mode === 'explain' 
                        ? "Ask me about Control Room features..." 
                        : "Ask me to create policies, metrics, or tasks..."
                    }
                    className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="sm"
                    className="command-button"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && pendingSuggestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <Card className="glass-panel border-purple-500/20 w-96 max-w-[90vw]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                Confirm Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  {getSuggestionIcon(pendingSuggestion.type)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{pendingSuggestion.title}</h3>
                    <p className="text-sm text-gray-300 mt-1">{pendingSuggestion.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {pendingSuggestion.type.charAt(0).toUpperCase() + pendingSuggestion.type.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded p-3">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(pendingSuggestion.data, null, 2)}
                  </pre>
                </div>

                <div className="flex space-x-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowConfirmation(false)
                      setPendingSuggestion(null)
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={executeSuggestion}
                    disabled={isLoading}
                    className="command-button"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Create {pendingSuggestion.type}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
