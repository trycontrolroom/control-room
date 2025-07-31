import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createId } from '@paralleldrive/cuid2'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { workspaceId } = await request.json()

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 })
    }

    let chatSession = await prisma.aIChatSession.findFirst({
      where: {
        userId: session.user.id,
        workspaceId: workspaceId
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50 // Limit to last 50 messages
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!chatSession) {
      chatSession = await prisma.aIChatSession.create({
        data: {
          id: createId(),
          userId: session.user.id,
          workspaceId: workspaceId
        },
        include: {
          messages: true
        }
      })
    }

    return NextResponse.json({
      sessionId: chatSession.id,
      messages: chatSession.messages
    })

  } catch (error) {
    console.error('AI Helper session error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
