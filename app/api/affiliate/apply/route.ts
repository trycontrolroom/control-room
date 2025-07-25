import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cuid } from '@paralleldrive/cuid2'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      experience, 
      audience, 
      marketingChannels, 
      website, 
      socialMedia 
    } = await request.json()

    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id }
    })

    if (existingAffiliate) {
      return NextResponse.json({ 
        error: 'You already have an affiliate application' 
      }, { status: 400 })
    }

    const generateCode = () => {
      const name = session.user.name || session.user.email || 'user'
      const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      const randomSuffix = Math.random().toString(36).substring(2, 6)
      return `${cleanName}${randomSuffix}`
    }

    let affiliateCode = generateCode()
    
    let codeExists = await prisma.affiliate.findUnique({
      where: { code: affiliateCode }
    })
    
    while (codeExists) {
      affiliateCode = generateCode()
      codeExists = await prisma.affiliate.findUnique({
        where: { code: affiliateCode }
      })
    }

    const affiliate = await prisma.affiliate.create({
      data: {
        id: cuid(),
        userId: session.user.id,
        code: affiliateCode,
        isApproved: false, // Requires manual approval
        payoutInfo: {
          application: {
            experience,
            audience,
            marketingChannels,
            website,
            socialMedia,
            appliedAt: new Date().toISOString()
          }
        }
      }
    })


    return NextResponse.json({
      success: true,
      message: 'Affiliate application submitted successfully',
      code: affiliateCode,
      status: 'pending_approval'
    })

  } catch (error) {
    console.error('Affiliate application error:', error)
    return NextResponse.json(
      { error: 'Failed to submit affiliate application' },
      { status: 500 }
    )
  }
}
