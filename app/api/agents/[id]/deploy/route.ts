import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createId } from '@paralleldrive/cuid2'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentIdParam = params.id
    const { name, description, files, config, workspaceId } = await request.json()

    const userRole = session.user.workspaceRole
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 })
    }

    let agentId = agentIdParam

    await prisma.$transaction(async (tx) => {
      if (agentIdParam === 'new') {
        agentId = createId()
        
        await tx.agent.create({
          data: {
            id: agentId,
            name: name || 'Untitled Agent',
            description: description || '',
            status: 'ACTIVE',
            config: config || {},
            userId: session.user.id,
            workspaceId: workspaceId
          }
        })
      } else {
        const existingAgent = await tx.agent.findFirst({
          where: {
            id: agentIdParam,
            workspaceId: session.user.workspaceId
          }
        })

        if (!existingAgent) {
          throw new Error('Agent not found')
        }

        await tx.agent.update({
          where: { id: agentIdParam },
          data: {
            name: name || existingAgent.name,
            description: description || existingAgent.description,
            status: 'ACTIVE',
            config: config || existingAgent.config,
            updatedAt: new Date()
          }
        })
      }

      if (files && files.length > 0) {
        await tx.agentFile.deleteMany({
          where: { agentId }
        })

        await tx.agentFile.createMany({
          data: files.map((file: any) => ({
            agentId,
            path: file.path,
            content: file.content
          }))
        })
      }

      if (files) {
        const configFile = files.find((f: any) => f.path === 'config.json')
        if (configFile) {
          try {
            const configContent = JSON.parse(configFile.content)
            configContent.agentId = agentId
            
            await tx.agentFile.updateMany({
              where: {
                agentId,
                path: 'config.json'
              },
              data: {
                content: JSON.stringify(configContent, null, 2)
              }
            })
          } catch (e) {
          }
        }
      }
    })

    console.log(`Agent ${agentId} deployed and marked as ACTIVE`)

    return NextResponse.json({ 
      success: true, 
      agentId,
      message: 'Agent deployed successfully'
    })

  } catch (error) {
    console.error('Deploy agent error:', error)
    return NextResponse.json(
      { error: 'Failed to deploy agent' },
      { status: 500 }
    )
  }
}
