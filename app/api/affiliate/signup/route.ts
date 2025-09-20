import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const data = await request.json()
    
    const requiredFields = [
      'fullName', 'email', 'phoneNumber', 'address', 'city', 'state', 
      'zipCode', 'country', 'experience', 'audience', 'marketingChannels', 
      'agreementAccepted', 'agreementAcceptedAt'
    ]
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    if (data.paymentMethod === 'paypal' && !data.paypalEmail) {
      return NextResponse.json({ error: 'PayPal email is required' }, { status: 400 })
    }
    
    if (data.paymentMethod === 'bank' && (!data.bankAccountNumber || !data.routingNumber)) {
      return NextResponse.json({ error: 'Bank account details are required' }, { status: 400 })
    }

    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id }
    })

    if (existingAffiliate) {
      return NextResponse.json({ error: 'You already have an affiliate application' }, { status: 400 })
    }

    const affiliate = await prisma.affiliate.create({
      data: {
        userId: session.user.id,
        code: generateReferralCode(),
        payoutInfo: {
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          paymentMethod: data.paymentMethod,
          paypalEmail: data.paypalEmail || null,
          bankAccountNumber: data.bankAccountNumber || null,
          routingNumber: data.routingNumber || null,
          experience: data.experience,
          audience: data.audience,
          marketingChannels: data.marketingChannels,
          website: data.website || null,
          socialMedia: data.socialMedia || null,
          agreementAccepted: data.agreementAccepted,
          agreementAcceptedAt: new Date(data.agreementAcceptedAt).toISOString(),
          status: 'PENDING'
        }
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'AFFILIATE_APPLICATION_SUBMITTED',
        details: {
          affiliateId: affiliate.id,
          fullName: data.fullName,
          email: data.email
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ 
      success: true, 
      affiliateId: affiliate.id,
      referralCode: affiliate.code
    })

  } catch (error) {
    console.error('Affiliate signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
