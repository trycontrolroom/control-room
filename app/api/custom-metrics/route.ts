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

    const customMetrics = await prisma.customMetric.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(customMetrics)
  } catch (error) {
    console.error('Error fetching custom metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, unit, formula, color, grouping, order } = body

    const customMetric = await prisma.customMetric.create({
      data: {
        name,
        unit,
        formula,
        color,
        grouping,
        order: order || 0,
        userId: session.user.id
      }
    })

    return NextResponse.json(customMetric)
  } catch (error) {
    console.error('Error creating custom metric:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
