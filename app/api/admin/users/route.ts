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

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    let workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id,
            role: 'ADMIN'
          }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found or insufficient permissions' }, { status: 403 })
    }

    const workspaceMembers = await prisma.workspaceMember.findMany({
      where: {
        workspaceId: workspace.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            lastLogin: true,
            isActive: true
          }
        }
      },
      orderBy: {
        user: {
          createdAt: 'desc'
        }
      }
    })

    const formattedUsers = workspaceMembers.map((member: any) => ({
      id: member.user.id,
      name: member.user.name || member.user.email,
      email: member.user.email,
      role: member.role,
      createdAt: member.user.createdAt.toISOString(),
      lastLogin: member.user.lastLogin?.toISOString(),
      isActive: member.user.isActive
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
