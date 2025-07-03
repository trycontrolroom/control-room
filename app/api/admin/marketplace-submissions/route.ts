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

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const submissions = await prisma.marketplaceAgent.findMany({
      include: {
        seller: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedSubmissions = submissions.map(submission => ({
      id: submission.id,
      name: submission.name,
      author: submission.seller.name || submission.seller.email,
      status: submission.isApproved ? 'APPROVED' : 'PENDING',
      submittedAt: submission.createdAt.toISOString(),
      price: submission.price,
      description: submission.description,
      category: submission.category,
      capabilities: submission.capabilities
    }))

    return NextResponse.json(formattedSubmissions)
  } catch (error) {
    console.error('Error fetching marketplace submissions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
