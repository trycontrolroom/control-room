import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { workspaceId, email, role } = body

    if (!workspaceId || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        user: { email: session.user.email },
        workspaceId,
        role: 'ADMIN'
      }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Unauthorized to invite to this workspace' }, { status: 403 })
    }

    const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        user: { email },
        workspaceId
      }
    })

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this workspace' }, { status: 400 })
    }

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const invitation = await prisma.workspaceInvitation.create({
      data: {
        email,
        token,
        role,
        workspaceId,
        expiresAt
      },
      include: {
        workspace: true
      }
    })

    return NextResponse.json({ 
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        token: invitation.token,
        workspaceId: invitation.workspaceId
      }
    })
  } catch (error) {
    console.error('Error creating invitation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
