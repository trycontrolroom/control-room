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
      where: { userId: session.user.id }
    })

    if (!affiliate || !affiliate.isApproved) {
      return NextResponse.json({ error: 'Not an approved affiliate' }, { status: 403 })
    }

    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const currentMonthEarnings = affiliate.earnings * 0.3 // Mock: 30% of total earnings this month

    const conversionRate = affiliate.clicks > 0 ? (affiliate.conversions / affiliate.clicks) * 100 : 0

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const referralLink = `${baseUrl}/signup?ref=${affiliate.code}`

    return NextResponse.json({
      totalClicks: affiliate.clicks,
      totalConversions: affiliate.conversions,
      totalEarnings: affiliate.earnings,
      currentMonthEarnings,
      conversionRate,
      referralCode: affiliate.code,
      referralLink,
      payoutInfo: affiliate.payoutInfo
    })

  } catch (error) {
    console.error('Affiliate stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch affiliate stats' },
      { status: 500 }
    )
  }
}
