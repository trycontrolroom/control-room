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
    const { status } = body
    const submissionId = params.id

    if (!status) {
      return NextResponse.json({ 
        error: 'Status is required' 
      }, { status: 400 })
    }

    const validStatuses = ['APPROVED', 'REJECTED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status' 
      }, { status: 400 })
    }

    const updatedSubmission = await prisma.marketplaceAgent.update({
      where: { id: submissionId },
      data: { 
        isApproved: status === 'APPROVED',
        approvedAt: status === 'APPROVED' ? new Date() : null
      },
      include: {
        seller: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      id: updatedSubmission.id,
      name: updatedSubmission.name,
      author: updatedSubmission.seller.name || updatedSubmission.seller.email,
      status: updatedSubmission.isApproved ? 'APPROVED' : 'REJECTED',
      submittedAt: updatedSubmission.createdAt.toISOString(),
      price: updatedSubmission.price,
      description: updatedSubmission.description,
      category: updatedSubmission.category
    })
  } catch (error) {
    console.error('Error updating marketplace submission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
