import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { method, details } = await request.json()

    if (!method || !details) {
      return NextResponse.json({ 
        error: 'Payout method and details are required' 
      }, { status: 400 })
    }

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id }
    })

    if (!affiliate || !affiliate.isApproved) {
      return NextResponse.json({ error: 'Not an approved affiliate' }, { status: 403 })
    }

    await prisma.affiliate.update({
      where: { userId: session.user.id },
      data: {
        payoutInfo: {
          ...affiliate.payoutInfo,
          method,
          details,
          updatedAt: new Date().toISOString()
        }
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Payout info update error:', error)
    return NextResponse.json(
      { error: 'Failed to update payout information' },
      { status: 500 }
    )
  }
}
