import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { days = 30 } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaceMembers: {
          include: { workspace: true }
        }
      }
    })

    if (!user || user.workspaceMembers.length === 0) {
      return NextResponse.json({ error: 'No workspace access' }, { status: 403 })
    }

    const currentWorkspace = user.workspaceMembers[0].workspace
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        workspaceId: currentWorkspace.id,
        createdAt: {
          gte: startDate
        }
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const csvHeader = 'Timestamp,User,Email,Action,Resource,Details,IP Address\n'
    const csvRows = auditLogs.map(log => {
      const timestamp = log.createdAt.toISOString()
      const userName = log.user?.name || 'System'
      const userEmail = log.user?.email || 'system@control-room.ai'
      const action = log.action
      const resource = log.resourceType
      const details = log.details || ''
      const ipAddress = log.ipAddress || ''
      
      return `"${timestamp}","${userName}","${userEmail}","${action}","${resource}","${details}","${ipAddress}"`
    }).join('\n')

    const csvContent = csvHeader + csvRows

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-logs-${currentWorkspace.name}-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Error generating audit logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
