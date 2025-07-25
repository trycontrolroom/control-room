import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { attributeSignup } from '@/lib/referral-tracking'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, inviteToken, affiliateApply } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const refCode = request.cookies.get('ref_code')?.value

    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 7)

    if (inviteToken) {
      const invitation = await prisma.workspaceInvitation.findUnique({
        where: { token: inviteToken },
        include: { workspace: true }
      })

      if (!invitation || invitation.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 400 })
      }

      if (invitation.email !== email) {
        return NextResponse.json({ error: 'Email does not match invitation' }, { status: 400 })
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'VIEWER',
          subscriptionPlan: 'TRIAL',
          trialEndsAt
        }
      })

      // Create initial subscription usage record
      await prisma.subscriptionUsage.create({
        data: {
          userId: user.id,
          agentsCount: 0,
          policiesCount: 0,
          metricsCount: 0,
          helperExecutionsToday: 0,
        }
      })

      await prisma.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: invitation.workspaceId,
          role: invitation.role
        }
      })

      await prisma.workspaceInvitation.delete({
        where: { id: invitation.id }
      })

      if (refCode) {
        await attributeSignup(user.id, refCode)
      }

      return NextResponse.json({ 
        message: 'User created successfully and added to workspace',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        workspace: invitation.workspace
      })
    } else {
      // Create user without auto-workspace
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'VIEWER',
          subscriptionPlan: 'TRIAL',
          trialEndsAt
        }
      })

      // Create initial subscription usage record
      await prisma.subscriptionUsage.create({
        data: {
          userId: user.id,
          agentsCount: 0,
          policiesCount: 0,
          metricsCount: 0,
          helperExecutionsToday: 0,
        }
      })

      if (refCode) {
        await attributeSignup(user.id, refCode)
      }

      if (affiliateApply) {
        const generateCode = () => {
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

        // Create affiliate application (pending approval)
        await prisma.affiliate.create({
          data: {
            userId: user.id,
            code: affiliateCode,
            isApproved: false,
            payoutInfo: {
              application: {
                appliedAt: new Date().toISOString(),
                source: 'signup_flow'
              }
            }
          }
        })
      }

      return NextResponse.json({ 
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        affiliateApplied: !!affiliateApply
      })
    }
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
