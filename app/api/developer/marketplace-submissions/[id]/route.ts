import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'admin@control-room.ai') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await request.json()
    const submissionId = params.id

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updatedSubmission = await prisma.marketplaceAgent.update({
      where: { id: submissionId },
      data: { 
        isApproved: status === 'APPROVED',
        approvedAt: status === 'APPROVED' ? new Date() : null
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: `MARKETPLACE_SUBMISSION_${status}`,
        details: {
          resourceType: 'MARKETPLACE_SUBMISSION',
          resourceId: submissionId,
          description: `Marketplace submission ${status.toLowerCase()}`
        },
        workspaceId: updatedSubmission.workspaceId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating marketplace submission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
