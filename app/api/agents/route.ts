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

    if (!workspace) {
      workspace = await prisma.workspace.create({
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
    }

    const agents = await prisma.agent.findMany({
      where: {
        userId: session.user.id,
        workspaceId: workspace.id
      },
      include: {
        metrics: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    })

    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role === 'VIEWER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
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

    if (!workspace) {
      workspace = await prisma.workspace.create({
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
    }

    const contentType = request.headers.get('content-type')
    let body: any

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData()
      body = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        config: JSON.parse(formData.get('config') as string || '{}')
      }

      const file = formData.get('file') as File
      if (file) {
        body.config.file = {
          name: file.name,
          size: file.size,
          type: file.type,
          uploaded: true
        }
      }
    } else {
      body = await request.json()
    }

    const { name, description, config } = body

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 })
    }

    if (config?.connectionType) {
      switch (config.connectionType) {
        case 'repo':
          if (!config.repoUrl) {
            return NextResponse.json({ error: 'Repository URL is required for repo connection' }, { status: 400 })
          }
          break
        case 'api':
          if (!config.apiEndpoint) {
            return NextResponse.json({ error: 'API endpoint is required for API connection' }, { status: 400 })
          }
          break
        case 'file':
          break
        default:
          return NextResponse.json({ error: 'Invalid connection type' }, { status: 400 })
      }
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        description,
        config,
        userId: session.user.id,
        workspaceId: workspace.id
      }
    })

    return NextResponse.json(agent)
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
