import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'admin@control-room.ai') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const submissions = await prisma.marketplaceAgent.findMany({
      where: {
        isApproved: false
      },
      include: {
        seller: {
          select: { name: true, email: true }
        },
        workspace: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedSubmissions = submissions.map((submission: any) => ({
      id: submission.id,
      name: submission.name,
      author: submission.seller?.name || 'Unknown',
      status: submission.isApproved ? 'APPROVED' : 'PENDING',
      submittedAt: submission.createdAt.toISOString(),
      price: submission.price,
      workspaceId: submission.workspaceId,
      workspaceName: submission.workspace?.name || 'Unknown Workspace'
    }))

    return NextResponse.json(formattedSubmissions)
  } catch (error) {
    console.error('Error fetching marketplace submissions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
