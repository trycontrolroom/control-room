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

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    let workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id,
            role: 'ADMIN'
          }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found or insufficient permissions' }, { status: 403 })
    }

    const totalMarketplacePurchases = await prisma.purchase.aggregate({
      where: {
        workspaceId: workspace.id
      },
      _sum: {
        amount: true
      }
    })

    const monthlyMarketplacePurchases = await prisma.purchase.aggregate({
      where: {
        workspaceId: workspace.id,
        createdAt: {
          gte: firstDayOfMonth
        }
      },
      _sum: {
        amount: true
      }
    })

    const activeSubscriptions = await prisma.workspaceMember.count({
      where: {
        workspaceId: workspace.id,
        role: {
          in: ['MANAGER', 'ADMIN']
        }
      }
    })

    const subscriptionRevenue = activeSubscriptions * 99 // Assuming $99/month average
    const monthlySubscriptionRevenue = subscriptionRevenue

    const totalRevenue = (totalMarketplacePurchases._sum.amount || 0) + subscriptionRevenue
    const monthlyRevenue = (monthlyMarketplacePurchases._sum.amount || 0) + monthlySubscriptionRevenue

    return NextResponse.json({
      totalRevenue,
      monthlyRevenue,
      subscriptionRevenue,
      marketplaceRevenue: totalMarketplacePurchases._sum.amount || 0,
      activeSubscriptions
    })
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
