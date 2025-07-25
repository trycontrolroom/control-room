import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const priceFilter = searchParams.get('price') // 'free' or 'paid'

    const where: any = {
      isApproved: true
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (priceFilter === 'free') {
      where.price = 0
    } else if (priceFilter === 'paid') {
      where.price = { gt: 0 }
    }

    const agents = await prisma.marketplaceAgent.findMany({
      where,
      include: {
        seller: {
          select: { name: true, email: true }
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: { rating: 'desc' }
    })

    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching marketplace agents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, price, category, capabilities, instructions, image } = body

    const agent = await prisma.marketplaceAgent.create({
      data: {
        name,
        description,
        price: parseFloat(price) || 0,
        category,
        capabilities,
        instructions,
        image,
        sellerId: session.user.id
      }
    })

    return NextResponse.json(agent)
  } catch (error) {
    console.error('Error creating marketplace agent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
