import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.workspaceRole === 'VIEWER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 })
    }

    const metricId = params.id

    const metric = await prisma.customMetric.findFirst({
      where: {
        id: metricId,
        workspaceId
      }
    })

    if (!metric) {
      return NextResponse.json({ error: 'Custom metric not found' }, { status: 404 })
    }

    await prisma.customMetric.delete({
      where: { id: metricId }
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        workspaceId,
        action: 'DELETE_CUSTOM_METRIC',
        details: {
          metricName: metric.name,
          metricId: metricId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete custom metric:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
