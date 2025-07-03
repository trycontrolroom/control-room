import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { role } = body
    const userId = params.id

    if (!role) {
      return NextResponse.json({ 
        error: 'Role is required' 
      }, { status: 400 })
    }

    const validRoles = ['VIEWER', 'MANAGER', 'SELLER', 'ADMIN']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role' 
      }, { status: 400 })
    }

    if (userId === session.user.id) {
      return NextResponse.json({ 
        error: 'Cannot change your own role' 
      }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        isActive: true
      }
    })

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name || updatedUser.email,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt.toISOString(),
      lastLogin: updatedUser.lastLogin?.toISOString(),
      isActive: updatedUser.isActive
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
