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

    if (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    let workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id
          }
        }
      }
    })

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: `${session.user.name || session.user.email}'s Workspace`,
          members: {
            create: {
              userId: session.user.id,
              role: 'ADMIN'
            }
          }
        }
      })
    }

    const contentType = request.headers.get('content-type')
    let body: any

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData()
      body = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string) || 0,
        category: formData.get('category') as string,
        capabilities: JSON.parse(formData.get('capabilities') as string || '[]'),
        instructions: formData.get('instructions') as string,
        tags: JSON.parse(formData.get('tags') as string || '[]')
      }

      const imageFile = formData.get('image') as File
      if (imageFile && imageFile.size > 0) {
        body.image = `/uploads/agents/${Date.now()}-${imageFile.name}`
      }
    } else {
      body = await request.json()
    }

    const { name, description, price, category, capabilities, instructions, tags, image } = body

    if (!name || !description || !category || !capabilities || !instructions) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, description, category, capabilities, instructions' 
      }, { status: 400 })
    }

    if (!Array.isArray(capabilities) || capabilities.length === 0) {
      return NextResponse.json({ 
        error: 'At least one capability is required' 
      }, { status: 400 })
    }

    if (price < 0) {
      return NextResponse.json({ 
        error: 'Price cannot be negative' 
      }, { status: 400 })
    }

    await prisma.sellerAgreement.create({
      data: {
        userId: session.user.id,
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
      }
    })

    const marketplaceAgent = await prisma.marketplaceAgent.create({
      data: {
        name,
        description,
        price,
        category,
        capabilities,
        instructions,
        image: image || null,
        sellerId: session.user.id,
        workspaceId: workspace.id,
        isApproved: false
      }
    })

    return NextResponse.json({
      id: marketplaceAgent.id,
      message: 'Agent submitted successfully and is pending approval'
    })
  } catch (error) {
    console.error('Error creating marketplace agent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    const priceFilter = url.searchParams.get('price')
    const sortBy = url.searchParams.get('sort') || 'installs'

    const where: any = {
      isApproved: true
    }

    if (category && category !== 'All Categories') {
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

    let orderBy: any = { installs: 'desc' }
    
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'price_low':
        orderBy = { price: 'asc' }
        break
      case 'price_high':
        orderBy = { price: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      default:
        orderBy = { installs: 'desc' }
    }

    const agents = await prisma.marketplaceAgent.findMany({
      where,
      orderBy,
      include: {
        seller: {
          select: {
            name: true,
            email: true
          }
        },
        purchases: {
          where: {
            userId: session.user.id
          },
          select: {
            id: true
          }
        }
      }
    })

    const formattedAgents = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      price: agent.price,
      category: agent.category,
      rating: agent.rating,
      reviewCount: 0,
      installCount: agent.installs,
      image: agent.image || '/placeholder-agent.png',
      author: agent.seller.name || agent.seller.email,
      tags: [],
      isFree: agent.price === 0,
      isInstalled: agent.purchases.length > 0
    }))

    return NextResponse.json(formattedAgents)
  } catch (error) {
    console.error('Error fetching marketplace agents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
