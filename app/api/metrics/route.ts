import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agentId')
  const metricName = searchParams.get('metric')
  const timeRange = searchParams.get('timeRange') || '24h'

  // Determine time window
  const now = new Date()
  const startTime = new Date(now)
  if (timeRange === '1h') startTime.setHours(now.getHours() - 1)
  else if (timeRange === '24h') startTime.setDate(now.getDate() - 1)
  else if (timeRange === '7d') startTime.setDate(now.getDate() - 7)
  else if (timeRange === '30d') startTime.setDate(now.getDate() - 30)

  // 1) Select workspace from cookie or fallback
  let workspaceId = request.cookies.get('workspace-id')?.value
  if (!workspaceId) {
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id }
    })
    if (membership) workspaceId = membership.workspaceId
  }

  if (!workspaceId) {
    // no workspace at all
    return NextResponse.json([], { status: 200 })
  }

  // 2) If user asked for a specific agent, ensure it belongs to that workspace
  const where: any = {
    timestamp: { gte: startTime, lte: now }
  }
  if (agentId) {
    const agent = await prisma.agent.findFirst({
      where: { id: agentId, workspaceId, userId: session.user.id }
    })
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }
    where.agentId = agentId
  } else {
    // 3) Otherwise track *all* of their agents in this workspace
    const userAgents = await prisma.agent.findMany({
      where: { workspaceId, userId: session.user.id },
      select: { id: true }
    })
    where.agentId = { in: userAgents.map(a => a.id) }
  }

  if (metricName) {
    where.name = metricName
  }

  // 4) Pull the metrics
  const metrics = await prisma.metric.findMany({
    where,
    include: { agent: { select: { name: true } } },
    orderBy: { timestamp: 'asc' }
  })

  return NextResponse.json(metrics)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { agentId, name, value, unit } = await request.json()

  // Determine workspace from cookie or fallback
  let workspaceId = request.cookies.get('workspace-id')?.value
  if (!workspaceId) {
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id }
    })
    if (membership) workspaceId = membership.workspaceId
  }
  if (!workspaceId) {
    return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
  }

  // Validate agent belongs here
  const agent = await prisma.agent.findFirst({
    where: { id: agentId, workspaceId, userId: session.user.id }
  })
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  // Create the metric
  const metric = await prisma.metric.create({
    data: {
      agentId,
      name,
      value: parseFloat(value),
      unit
    }
  })

  return NextResponse.json(metric)
}