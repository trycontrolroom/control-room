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


    const customMetrics = await prisma.customMetric.findMany({
      where: {
        userId: session.user.id,
        workspaceId: workspace.id
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(customMetrics)
  } catch (error) {
    console.error('Error fetching custom metrics:', error)
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

    let workspace = finalMembership.workspace


    const body = await request.json()
    const { name, unit, formula, color, grouping } = body

    if (!name || !unit) {
      return NextResponse.json({ 
        error: 'Name and unit are required' 
      }, { status: 400 })
    }

    const existingMetric = await prisma.customMetric.findFirst({
      where: {
        name,
        userId: session.user.id,
        workspaceId: workspace.id
      }
    })

    if (existingMetric) {
      return NextResponse.json({ 
        error: 'A custom metric with this name already exists' 
      }, { status: 400 })
    }

    const maxOrder = await prisma.customMetric.findFirst({
      where: {
        userId: session.user.id,
        workspaceId: workspace.id
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
        name,
        unit,
        formula: formula || null,
        color: color || '#3b82f6',
        grouping: grouping || null,
        order: (maxOrder?.order || 0) + 1,
        userId: session.user.id,
        workspaceId: workspace.id
      }
    })

    return NextResponse.json(customMetric)
  } catch (error) {
    console.error('Error creating custom metric:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
