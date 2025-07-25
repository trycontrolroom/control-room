import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1) Try to read the workspace ID the user most recently switched to
  let workspaceId = request.cookies.get('workspace-id')?.value

  // 2) If no cookie, fall back to their first workspace membership
  if (!workspaceId) {
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id }
    })
    if (!membership) {
      // no workspace → return empty list
      return NextResponse.json([], { status: 200 })
    }
    workspaceId = membership.workspaceId
  }

  // 3) Fetch all agents in that workspace (with latest metric)
  const raw = await prisma.agent.findMany({
    where: { workspaceId },
    include: {
      metrics: {
        orderBy: { timestamp: 'desc' },
        take: 1
      }
    }
  })

  // 4) Shape exactly what the UI expects
  const agents = raw.map(a => ({
    id: a.id,
    name: a.name,
    status: a.status,
    uptime: a.uptime,
    errorCount: a.errorCount,
    lastSeen: a.lastSeen,
    cost: a.metrics[0]?.value ?? 0
  }))

  return NextResponse.json(agents)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Must belong to the workspace to create an agent
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspace: {
        members: { some: { userId: session.user.id } }
      }
    },
    include: { workspace: true }
  })
  if (!membership) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (membership.role === 'VIEWER') {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  // Always use the workspace they’re in (cookie or fallback membership)
  const workspaceId = request.cookies.get('workspace-id')?.value ?? membership.workspace.id

  // Parse JSON or multipart
  const contentType = request.headers.get('content-type') ?? ''
  let body: any
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    body = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      config: JSON.parse((formData.get('config') as string) || '{}')
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

  // Validate connectionType fields
  if (config?.connectionType) {
    switch (config.connectionType) {
      case 'repo':
        if (!config.repoUrl) {
          return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 })
        }
        break
      case 'api':
        if (!config.apiEndpoint) {
          return NextResponse.json({ error: 'API endpoint is required' }, { status: 400 })
        }
        break
      case 'file':
        break
      default:
        return NextResponse.json({ error: 'Invalid connection type' }, { status: 400 })
    }
  }

  // Finally, create the agent under that workspace
  const agent = await prisma.agent.create({
    data: {
      name,
      description,
      config,
      userId: session.user.id,
      workspaceId
    }
  })

  return NextResponse.json(agent)
}