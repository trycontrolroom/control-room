import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function trackReferral(request: NextRequest, response: NextResponse) {
  const url = new URL(request.url)
  const refCode = url.searchParams.get('ref')
  
  if (refCode) {
    const affiliate = await prisma.affiliate.findUnique({
      where: { code: refCode, isApproved: true }
    })
    
    if (affiliate) {
      response.cookies.set('ref_code', refCode, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      await prisma.affiliate.update({
        where: { id: affiliate.id },
        data: {
          clicks: { increment: 1 }
        }
      })
    }
  }
  
  return response
}

export async function attributeSignup(userId: string, refCode?: string) {
  if (!refCode) return
  
  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { code: refCode, isApproved: true }
    })
    
    if (affiliate) {
      await prisma.affiliate.update({
        where: { id: affiliate.id },
        data: {
          conversions: { increment: 1 }
        }
      })
      
      
      console.log(`Conversion tracked for affiliate ${affiliate.code}`)
    }
  } catch (error) {
    console.error('Failed to attribute signup:', error)
  }
}
