import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const files = await prisma.agentFile.findMany({
      where: { agentId },
      orderBy: { path: 'asc' }
    })

    return NextResponse.json(files)

  } catch (error) {
    console.error('Get agent files error:', error)
    return NextResponse.json(
      { error: 'Failed to get agent files' },
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
    const { files } = await request.json()

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

    await prisma.$transaction(async (tx) => {
      await tx.agentFile.deleteMany({
        where: { agentId }
      })

      if (files && files.length > 0) {
        await tx.agentFile.createMany({
          data: files.map((file: any) => ({
            agentId,
            path: file.path,
            content: file.content
          }))
        })
      }

      await tx.agent.update({
        where: { id: agentId },
        data: { updatedAt: new Date() }
      })
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Update agent files error:', error)
    return NextResponse.json(
      { error: 'Failed to update agent files' },
      { status: 500 }
    )
  }
}
