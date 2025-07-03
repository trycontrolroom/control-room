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

    const settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      return NextResponse.json({
        maintenanceMode: false,
        newRegistrations: true,
        marketplaceEnabled: true,
        announcement: ''
      })
    }

    return NextResponse.json({
      maintenanceMode: settings.maintenanceMode,
      newRegistrations: settings.newRegistrations,
      marketplaceEnabled: settings.marketplaceEnabled,
      announcement: settings.announcement || ''
    })
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json({
      maintenanceMode: false,
      newRegistrations: true,
      marketplaceEnabled: true,
      announcement: ''
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { maintenanceMode, newRegistrations, marketplaceEnabled, announcement } = body

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        maintenanceMode: maintenanceMode ?? false,
        newRegistrations: newRegistrations ?? true,
        marketplaceEnabled: marketplaceEnabled ?? true,
        announcement: announcement || ''
      },
      create: {
        id: 'default',
        maintenanceMode: maintenanceMode ?? false,
        newRegistrations: newRegistrations ?? true,
        marketplaceEnabled: marketplaceEnabled ?? true,
        announcement: announcement || ''
      }
    })

    return NextResponse.json({
      maintenanceMode: settings.maintenanceMode,
      newRegistrations: settings.newRegistrations,
      marketplaceEnabled: settings.marketplaceEnabled,
      announcement: settings.announcement || ''
    })
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
