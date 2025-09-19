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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaceMembers: {
          include: {
            workspace: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const workspaces = user.workspaceMembers.map(member => ({
      id: member.workspace.id,
      name: member.workspace.name,
      description: '',
      memberCount: 1,
      role: member.role
    }))

    // Get current workspace from cookies
    const cookieWorkspaceId = request.cookies.get('workspace-id')?.value
    let currentWorkspace = null
    
    if (cookieWorkspaceId) {
      currentWorkspace = workspaces.find(w => w.id === cookieWorkspaceId) || workspaces[0] || null
    } else {
      currentWorkspace = workspaces[0] || null
    }

    return NextResponse.json({ 
      workspaces,
      currentWorkspace
    })
  } catch (error) {
    console.error('Error fetching workspaces:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        members: {
          create: {
            userId: user.id,
            role: 'ADMIN'
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ 
      workspace,
      workspaceId: workspace.id,
      message: 'Workspace created successfully'
    })
  } catch (error) {
    console.error('Error creating workspace:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}