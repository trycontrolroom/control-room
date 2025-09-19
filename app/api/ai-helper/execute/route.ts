import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, workspaceId, ...params } = body

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 })
    }

    if (session.user.workspaceRole === 'VIEWER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    let result = { success: false, message: 'Unknown action' }

    switch (action) {
      case 'create_policy':
        result = await handleCreatePolicy(session, workspaceId, params)
        break
      case 'create_task':
        result = await handleCreateTask(session, workspaceId, params)
        break
      case 'create_metric':
        result = await handleCreateMetric(session, workspaceId, params)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('AI Helper execution error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleCreatePolicy(session: any, workspaceId: string, params: any) {
  return { success: false, message: 'Policy creation not implemented yet' }
}

async function handleCreateTask(session: any, workspaceId: string, params: any) {
  return { success: false, message: 'Task creation not implemented yet' }
}

async function handleCreateMetric(session: any, workspaceId: string, params: any) {
  try {
    const { input } = params
    
    if (!input?.trim()) {
      return { success: false, message: 'Input is required' }
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that helps create custom metrics for an AI agent monitoring platform. 
          Parse the user's natural language request and extract metric details.
          
          Respond with a JSON object containing:
          - name: string (required, unique metric name)
          - unit: string (one of: number, percentage, milliseconds, seconds, minutes, hours, bytes, kilobytes, megabytes, gigabytes, requests, errors, currency)
          - formula: string (optional, how to compute the metric)
          - color: string (hex color, default #3b82f6)
          - grouping: string (one of: performance, reliability, cost, usage, custom)
          
          Examples:
          "Create a metric tracking average latency called SLA Latency" -> {"name": "SLA Latency", "unit": "milliseconds", "grouping": "performance", "color": "#06b6d4"}
          "Add a success rate metric in percentage" -> {"name": "Success Rate", "unit": "percentage", "grouping": "reliability", "color": "#10b981"}
          "Make a cost metric showing daily spend" -> {"name": "Daily Spend", "unit": "currency", "grouping": "cost", "color": "#f59e0b"}
          
          Only respond with valid JSON, no other text.`
        },
        {
          role: 'user',
          content: input
        }
      ],
      temperature: 0.1
    })

    const responseText = completion.choices[0]?.message?.content?.trim()
    if (!responseText) {
      return { success: false, message: 'Failed to parse metric request' }
    }

    let metricData
    try {
      metricData = JSON.parse(responseText)
    } catch (e) {
      return { success: false, message: 'Failed to parse AI response' }
    }

    if (!metricData.name?.trim()) {
      return { success: false, message: 'Metric name is required' }
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        userId: session.user.id
      },
      include: {
        workspace: true
      }
    })

    if (!membership) {
      return { success: false, message: 'No workspace found' }
    }

    const existingMetric = await prisma.customMetric.findFirst({
      where: {
        workspaceId: membership.workspaceId,
        name: metricData.name.trim(),
        userId: session.user.id
      }
    })

    if (existingMetric) {
      return { success: false, message: 'A metric with this name already exists' }
    }

    const maxOrder = await prisma.customMetric.findFirst({
      where: {
        userId: session.user.id,
        workspaceId: membership.workspaceId
      },
      orderBy: {
        order: 'desc'
      },
      select: {
        order: true
      }
    })

    const customMetric = await prisma.customMetric.create({
      data: {
        workspaceId: membership.workspaceId,
        name: metricData.name.trim(),
        unit: metricData.unit || 'number',
        formula: metricData.formula?.trim() || null,
        color: metricData.color || '#3b82f6',
        grouping: metricData.grouping || null,
        order: (maxOrder?.order || 0) + 1,
        userId: session.user.id
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        workspaceId: membership.workspaceId,
        action: 'CREATE_CUSTOM_METRIC_AI',
        details: { 
          metricName: customMetric.name,
          input: input,
          metricId: customMetric.id
        }
      }
    })

    return { 
      success: true, 
      message: `Successfully created metric: ${customMetric.name}`,
      metric: customMetric
    }
  } catch (error) {
    console.error('Failed to create metric via AI:', error)
    return { success: false, message: 'Failed to create metric' }
  }
}
