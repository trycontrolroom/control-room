import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membershipId = params.id
    const body = await request.json()
    const { role } = body

    if (!role || !['ADMIN', 'MANAGER', 'VIEWER'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: { id: membershipId },
      include: {
        workspace: {
          include: {
            members: true
          }
        }
      }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Membership not found' }, { status: 404 })
    }

    const userMembership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: membership.workspaceId,
        user: {
          email: session.user.email
        }
      }
    })

    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    if (membership.role === 'ADMIN' && role !== 'ADMIN') {
      const adminCount = membership.workspace.members.filter(m => m.role === 'ADMIN').length
      if (adminCount === 1) {
        return NextResponse.json({ 
          error: 'Cannot remove the last ADMIN from the workspace' 
        }, { status: 400 })
      }
    }

    const updatedMembership = await prisma.workspaceMember.update({
      where: { id: membershipId },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ 
      membership: updatedMembership,
      message: 'Role updated successfully'
    })
  } catch (error) {
    console.error('Error updating workspace member role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
