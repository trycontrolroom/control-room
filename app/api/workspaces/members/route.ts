import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 })
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId: session.user.id
          }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 })
    }

    const members = await prisma.workspaceMember.findMany({
      where: {
        workspaceId: workspaceId
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
        joinedAt: 'asc'
      }
    })

    const formattedMembers = members.map(member => ({
      id: member.id,
      userId: member.user.id,
      name: member.user.name || member.user.email,
      email: member.user.email,
      role: member.role,
      joinedAt: member.joinedAt.toISOString(),
      isActive: member.user.isActive,
      lastLogin: member.user.lastLogin?.toISOString()
    }))

    return NextResponse.json(formattedMembers)
  } catch (error) {
    console.error('Error fetching workspace members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { workspaceId, email, role } = await request.json()

    if (!workspaceId || !email || !role) {
      return NextResponse.json({ error: 'Workspace ID, email, and role are required' }, { status: 400 })
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId: session.user.id,
            role: 'ADMIN'
          }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found or insufficient permissions' }, { status: 403 })
    }

    const targetUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: targetUser.id,
          workspaceId: workspaceId
        }
      }
    })

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this workspace' }, { status: 400 })
    }

    const newMember = await prisma.workspaceMember.create({
      data: {
        userId: targetUser.id,
        workspaceId: workspaceId,
        role: role
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
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'MEMBER_ADDED',
        details: {
          resourceType: 'WORKSPACE_MEMBER',
          resourceId: newMember.id,
          description: `Added ${targetUser.email} to workspace with role ${role}`
        },
        workspaceId: workspaceId
      }
    })

    const formattedMember = {
      id: newMember.id,
      userId: newMember.user.id,
      name: newMember.user.name || newMember.user.email,
      email: newMember.user.email,
      role: newMember.role,
      joinedAt: newMember.joinedAt.toISOString(),
      isActive: newMember.user.isActive,
      lastLogin: newMember.user.lastLogin?.toISOString()
    }

    return NextResponse.json(formattedMember)
  } catch (error) {
    console.error('Error adding workspace member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const workspaceId = searchParams.get('workspaceId')

    if (!memberId || !workspaceId) {
      return NextResponse.json({ error: 'Member ID and Workspace ID are required' }, { status: 400 })
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId: session.user.id,
            role: 'ADMIN'
          }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found or insufficient permissions' }, { status: 403 })
    }

    const member = await prisma.workspaceMember.findUnique({
      where: { id: memberId },
      include: {
        user: {
          select: { email: true }
        }
      }
    })

    if (!member || member.workspaceId !== workspaceId) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    if (member.userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot remove yourself from workspace' }, { status: 400 })
    }

    await prisma.workspaceMember.delete({
      where: { id: memberId }
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'MEMBER_REMOVED',
        details: {
          resourceType: 'WORKSPACE_MEMBER',
          resourceId: memberId,
          description: `Removed ${member.user.email} from workspace`
        },
        workspaceId: workspaceId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing workspace member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
