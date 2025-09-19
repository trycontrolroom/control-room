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

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
      select: { isApproved: true }
    })

    return NextResponse.json({
      isAffiliate: !!affiliate,
      isApproved: affiliate?.isApproved || false
    })

  } catch (error) {
    console.error('Affiliate status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check affiliate status' },
      { status: 500 }
    )
  }
}
