import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cuid } from '@paralleldrive/cuid2'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, message, mode, workspaceId } = await request.json()

    if (!sessionId || !message || !mode || !workspaceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const chatSession = await prisma.aIChatSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
        workspaceId: workspaceId
      }
    })

    if (!chatSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    await prisma.aIChatMessage.create({
      data: {
        id: cuid(),
        sessionId: sessionId,
        role: 'user',
        content: message
      }
    })

    const workspaceData = await getWorkspaceContext(workspaceId)

    const systemPrompt = mode === 'explain' 
      ? getExplainModePrompt(workspaceData)
      : getActionModePrompt(workspaceData)

    const recentMessages = await prisma.aIChatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...recentMessages.reverse().slice(-9).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    await prisma.aIChatMessage.create({
      data: {
        id: cuid(),
        sessionId: sessionId,
        role: 'assistant',
        content: response
      }
    })

    let suggestion = null
    if (mode === 'action') {
      suggestion = parseActionSuggestion(response, message, workspaceData)
    }

    return NextResponse.json({
      message: response,
      suggestion
    })

  } catch (error) {
    console.error('AI Helper chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

async function getWorkspaceContext(workspaceId: string) {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        agents: {
          select: { id: true, name: true, status: true, description: true },
          take: 10
        },
        policies: {
          select: { id: true, name: true, description: true },
          take: 10
        },
        _count: {
          select: {
            agents: true,
            policies: true,
            members: true
          }
        }
      }
    })

    return workspace
  } catch (error) {
    console.error('Failed to get workspace context:', error)
    return null
  }
}

function getExplainModePrompt(workspaceData: any) {
  return `You are an AI assistant for Control Room, an enterprise AI Agent Governance SaaS platform. You are in EXPLAIN MODE, which means you can:

1. Explain platform features and capabilities
2. Analyze workspace data and provide insights
3. Answer questions about AI agent management
4. Help users understand policies, metrics, and monitoring
5. Provide guidance on best practices

You CANNOT create, modify, or delete anything in explain mode.

Current workspace context:
- Workspace: ${workspaceData?.name || 'Unknown'}
- Agents: ${workspaceData?._count?.agents || 0}
- Policies: ${workspaceData?._count?.policies || 0}
- Members: ${workspaceData?._count?.members || 0}

Recent agents: ${workspaceData?.agents?.map((a: any) => `${a.name} (${a.status})`).join(', ') || 'None'}

Be helpful, informative, and concise. Focus on explaining how Control Room works and helping users understand their data.`
}

function getActionModePrompt(workspaceData: any) {
  return `You are an AI assistant for Control Room in ACTION MODE. You can help create:

1. **Policies** - Governance rules for AI agents
2. **Custom Metrics** - Monitoring and analytics
3. **Tasks** - Agent task management

When a user asks you to create something, respond with your explanation AND include a JSON suggestion in this format:

For policies:
SUGGESTION: {"type": "policy", "title": "Policy Name", "description": "Description", "data": {"name": "Policy Name", "description": "Description", "rules": {...}}}

For metrics:
SUGGESTION: {"type": "metric", "title": "Metric Name", "description": "Description", "data": {"name": "Metric Name", "description": "Description", "query": "...", "type": "..."}}

For tasks:
SUGGESTION: {"type": "task", "title": "Task Name", "description": "Description", "data": {"agentId": "agent-id", "name": "Task Name", "description": "Description", "schedule": "..."}}

Current workspace context:
- Workspace: ${workspaceData?.name || 'Unknown'}
- Available agents: ${workspaceData?.agents?.map((a: any) => `${a.id}:${a.name}`).join(', ') || 'None'}

Always ask for clarification if you need more details to create something properly.`
}

function parseActionSuggestion(response: string, userMessage: string, workspaceData: any) {
  try {
    const suggestionMatch = response.match(/SUGGESTION:\s*({.*?})/s)
    if (suggestionMatch) {
      const suggestion = JSON.parse(suggestionMatch[1])
      
      if (suggestion.type && suggestion.title && suggestion.description && suggestion.data) {
        return suggestion
      }
    }
    return null
  } catch (error) {
    console.error('Failed to parse action suggestion:', error)
    return null
  }
}
