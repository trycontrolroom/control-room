import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')
    const metricName = searchParams.get('metric')
    const timeRange = searchParams.get('timeRange') || '24h'

    const now = new Date()
    let startTime = new Date()
    
    switch (timeRange) {
      case '1h':
        startTime.setHours(now.getHours() - 1)
        break
      case '24h':
        startTime.setDate(now.getDate() - 1)
        break
      case '7d':
        startTime.setDate(now.getDate() - 7)
        break
      case '30d':
        startTime.setDate(now.getDate() - 30)
        break
      default:
        startTime.setDate(now.getDate() - 1)
    }

    const where: any = {
      timestamp: {
        gte: startTime,
        lte: now
      }
    }

    let workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id
          }
        }
      }
    })

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: `${session.user.name || session.user.email}'s Workspace`,
          members: {
            create: {
              userId: session.user.id,
              role: 'ADMIN'
            }
          }
        }
      })
    }

    if (agentId) {
      const agent = await prisma.agent.findFirst({
        where: {
          id: agentId,
          userId: session.user.id,
          workspaceId: workspace.id
        }
      })

      if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
      }

      where.agentId = agentId
    } else {
      const userAgents = await prisma.agent.findMany({
        where: { 
          userId: session.user.id,
          workspaceId: workspace.id
        },
        select: { id: true }
      })

      where.agentId = {
        in: userAgents.map((agent: any) => agent.id)
      }
    }

    if (metricName) {
      where.name = metricName
    }

    const metrics = await prisma.metric.findMany({
      where,
      include: {
        agent: {
          select: { name: true }
        }
      },
      orderBy: { timestamp: 'asc' }
    })

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching metrics:', error)
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
    const { agentId, name, value, unit } = body

    let workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id
          }
        }
      }
    })

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: `${session.user.name || session.user.email}'s Workspace`,
          members: {
            create: {
              userId: session.user.id,
              role: 'ADMIN'
            }
          }
        }
      })
    }

    const agent = await prisma.agent.findFirst({
      where: {
        id: agentId,
        userId: session.user.id,
        workspaceId: workspace.id
      }
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const metric = await prisma.metric.create({
      data: {
        agentId,
        name,
        value: parseFloat(value),
        unit
      }
    })

    return NextResponse.json(metric)
  } catch (error) {
    console.error('Error creating metric:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
