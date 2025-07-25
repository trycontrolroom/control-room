import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, inviteToken } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    if (inviteToken) {
      const invitation = await prisma.workspaceInvitation.findUnique({
        where: { token: inviteToken },
        include: { workspace: true }
      })

      if (!invitation || invitation.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 400 })
      }

      if (invitation.email !== email) {
        return NextResponse.json({ error: 'Email does not match invitation' }, { status: 400 })
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'VIEWER'
        }
      })

      await prisma.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: invitation.workspaceId,
          role: invitation.role
        }
      })

      await prisma.workspaceInvitation.delete({
        where: { id: invitation.id }
      })

      return NextResponse.json({ 
        message: 'User created successfully and added to workspace',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        workspace: invitation.workspace
      })
    } else {
      // Create user without auto-workspace
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'VIEWER'
        }
      })

      return NextResponse.json({ 
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    }
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}