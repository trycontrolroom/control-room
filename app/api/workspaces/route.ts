import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cookieStore = cookies()
    const currentWorkspaceId = cookieStore.get('workspace-id')?.value

    const memberships = await prisma.workspaceMember.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        workspace: {
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
        }
      }
    })

    const workspaces = memberships.map(membership => ({
      ...membership.workspace,
      userRole: membership.role,
      isActive: membership.workspaceId === currentWorkspaceId
    }))

    let currentWorkspace = null
    if (currentWorkspaceId) {
      const currentMembership = memberships.find(m => m.workspaceId === currentWorkspaceId)
      if (currentMembership) {
        currentWorkspace = {
          ...currentMembership.workspace,
          userRole: currentMembership.role
        }
      }
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
    const { name, description, timezone } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 })
    }

    const existingWorkspace = await prisma.workspace.findFirst({
      where: {
        name: name.trim(),
        members: {
          some: {
            user: {
              email: session.user.email
            }
          }
        }
      }
    })

    if (existingWorkspace) {
      return NextResponse.json({ error: 'Workspace name already exists' }, { status: 400 })
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        timezone: timezone || null,
        members: {
          create: {
            userId: session.user.id,
            role: 'ADMIN'
          }
        }
      }
    })

    return NextResponse.json({ workspaceId: workspace.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating workspace:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
