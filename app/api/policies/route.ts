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

    let workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id
          }
        }
      }
    })


    const policies = await prisma.policy.findMany({
      where: {
        userId: session.user.id,
        workspaceId: workspace.id
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

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        userId: session.user.id,
        workspace: {
          members: {
            some: {
              userId: session.user.id
            }
          }
        }
      },
      include: {
        workspace: true
      }
    })

    if (!membership) {
      const workspace = await prisma.workspace.create({
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
      
      const newMembership = await prisma.workspaceMember.findFirst({
        where: {
          userId: session.user.id,
          workspaceId: workspace.id
        },
        include: {
          workspace: true
        }
      })
      
      if (!newMembership) {
        return NextResponse.json({ error: 'Failed to create workspace membership' }, { status: 500 })
      }
      
      var finalMembership = newMembership
    } else {
      var finalMembership = membership
    }

    if (finalMembership.role === 'VIEWER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, triggerType, triggerValue, actionType, actionConfig, agentId } = body

    let workspace = finalMembership.workspace


    const policy = await prisma.policy.create({
      data: {
        name,
        description,
        triggerType,
        triggerValue,
        actionType,
        actionConfig,
        agentId,
        userId: session.user.id,
        workspaceId: workspace.id
      }
    })

    return NextResponse.json(policy)
  } catch (error) {
    console.error('Error creating policy:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
