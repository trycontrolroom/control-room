import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkSubscriptionLimit } from '@/lib/subscription'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type } = await request.json()

    if (!type || !['agents', 'policies', 'metrics', 'aiHelper'].includes(type)) {
      return NextResponse.json({ error: 'Invalid usage type' }, { status: 400 })
    }

    const result = await checkSubscriptionLimit(session.user.id, type)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Usage check error:', error)
    return NextResponse.json(
      { error: 'Failed to check usage limits' },
      { status: 500 }
    )
  }
}
