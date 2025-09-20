import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createId } from '@paralleldrive/cuid2'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentId = params.id

    const agent = await prisma.agent.findFirst({
      where: {
        id: agentId,
        workspaceId: session.user.workspaceId
      }
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const tasks = await prisma.agentTask.findMany({
      where: { agentId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tasks)

  } catch (error) {
    console.error('Get agent tasks error:', error)
    return NextResponse.json(
      { error: 'Failed to get agent tasks' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentId = params.id
    const { name, description, schedule } = await request.json()

    const userRole = session.user.workspaceRole
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const agent = await prisma.agent.findFirst({
      where: {
        id: agentId,
        workspaceId: session.user.workspaceId
      }
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const task = await prisma.agentTask.create({
      data: {
        id: createId(),
        agentId,
        name: name.trim(),
        description: description?.trim() || null,
        schedule: schedule?.trim() || null,
        status: 'PENDING'
      }
    })

    return NextResponse.json(task)

  } catch (error) {
    console.error('Create agent task error:', error)
    return NextResponse.json(
      { error: 'Failed to create agent task' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentId = params.id
    const { taskId, ...updates } = await request.json()

    const userRole = session.user.workspaceRole
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const task = await prisma.agentTask.findFirst({
      where: {
        id: taskId,
        agent: {
          id: agentId,
          workspaceId: session.user.workspaceId
        }
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const updatedTask = await prisma.agentTask.update({
      where: { id: taskId },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedTask)

  } catch (error) {
    console.error('Update agent task error:', error)
    return NextResponse.json(
      { error: 'Failed to update agent task' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentId = params.id
    const { taskId } = await request.json()

    const userRole = session.user.workspaceRole
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const task = await prisma.agentTask.findFirst({
      where: {
        id: taskId,
        agent: {
          id: agentId,
          workspaceId: session.user.workspaceId
        }
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    await prisma.agentTask.delete({
      where: { id: taskId }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete agent task error:', error)
    return NextResponse.json(
      { error: 'Failed to delete agent task' },
      { status: 500 }
    )
  }
}
