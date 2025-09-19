import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function getWorkspaceId(request: NextRequest, body?: any) {
  // 1) From JSON body (POST)
  if (body && body.workspaceId) return body.workspaceId
  // 2) From query param (GET)
  const url = new URL(request.url)
  if (url.searchParams.get('workspaceId')) return url.searchParams.get('workspaceId')!
  // 3) Fallback to cookie
  return request.cookies.get('workspaceId')?.value ?? ''
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const workspaceId = getWorkspaceId(request)
    if (!workspaceId) {
      return NextResponse.json({ error: 'No workspace selected' }, { status: 400 })
    }
    const policies = await prisma.policy.findMany({
      where: { userId: session.user.id, workspaceId },
      include: { agent: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(policies)
  } catch (err) {
    console.error('GET /api/policies', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const workspaceId = getWorkspaceId(request, body)
    if (!workspaceId) {
      return NextResponse.json({ error: 'No workspace selected' }, { status: 400 })
    }
    const {
      name, description, triggerType, triggerValue, timeWindow,
      actionType, actionConfig, agentId, priority
    } = body

    const policy = await prisma.policy.create({
      data: {
        name, description, triggerType, timeWindow, actionType, actionConfig,
        agentId: agentId || null,
        priority, userId: session.user.id, workspaceId,
        triggerValue: typeof triggerValue === 'number' ? triggerValue : parseFloat(triggerValue)
      },
    })
    return NextResponse.json(policy)
  } catch (err) {
    console.error('POST /api/policies', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}