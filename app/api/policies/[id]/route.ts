import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function resolveWorkspaceId(request: NextRequest, body?: any) {
  if (body?.workspaceId) return body.workspaceId as string
  const url = new URL(request.url)
  if (url.searchParams.get('workspaceId')) return url.searchParams.get('workspaceId')!
  return request.cookies.get('workspaceId')?.value ?? ''
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ws = await resolveWorkspaceId(request)
    if (!ws) {
      return NextResponse.json({ error: 'No workspace selected' }, { status: 400 })
    }
    const policy = await prisma.policy.findUnique({
      where: { id: params.id },
      include: { agent: true },
    })
    if (!policy || policy.userId !== session.user.id || policy.workspaceId !== ws) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(policy)
  } catch (err) {
    console.error('GET /api/policies/[id]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const ws = await resolveWorkspaceId(request, body)
    if (!ws) {
      return NextResponse.json({ error: 'No workspace selected' }, { status: 400 })
    }
    const existing = await prisma.policy.findUnique({ where: { id: params.id } })
    if (!existing || existing.userId !== session.user.id || existing.workspaceId !== ws) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const updated = await prisma.policy.update({
      where: { id: params.id },
      data: { ...body, workspaceId: ws },
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('PATCH /api/policies/[id]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ws = await resolveWorkspaceId(request)
    if (!ws) {
      return NextResponse.json({ error: 'No workspace selected' }, { status: 400 })
    }
    const existing = await prisma.policy.findUnique({ where: { id: params.id } })
    if (!existing || existing.userId !== session.user.id || existing.workspaceId !== ws) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    await prisma.policy.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/policies/[id]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}