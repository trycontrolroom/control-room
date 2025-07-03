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

    const policies = await prisma.policy.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        agent: true
      }
    })

    return NextResponse.json(policies)
  } catch (error) {
    console.error('Error fetching policies:', error)
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
    const { name, description, triggerType, triggerValue, actionType, actionConfig, agentId } = body

    const policy = await prisma.policy.create({
      data: {
        name,
        description,
        triggerType,
        triggerValue,
        actionType,
        actionConfig,
        agentId,
        userId: session.user.id
      }
    })

    return NextResponse.json(policy)
  } catch (error) {
    console.error('Error creating policy:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
