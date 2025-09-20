import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'admin@control-room.ai') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.siteSettings.findFirst()
    
    if (!settings) {
      const defaultSettings = {
        maintenanceMode: false,
        newRegistrations: true,
        marketplaceEnabled: true,
        announcement: ''
      }
      
      const createdSettings = await prisma.siteSettings.create({
        data: defaultSettings
      })
      
      return NextResponse.json(createdSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'admin@control-room.ai') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { maintenanceMode, newRegistrations, marketplaceEnabled, announcement } = await request.json()

    const existingSettings = await prisma.siteSettings.findFirst()
    
    let updatedSettings
    if (existingSettings) {
      updatedSettings = await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          maintenanceMode,
          newRegistrations,
          marketplaceEnabled,
          announcement
        }
      })
    } else {
      updatedSettings = await prisma.siteSettings.create({
        data: {
          maintenanceMode,
          newRegistrations,
          marketplaceEnabled,
          announcement
        }
      })
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'SITE_SETTINGS_UPDATED',
        details: {
          resourceType: 'SITE_SETTINGS',
          resourceId: updatedSettings.id,
          description: 'Global site settings updated'
        },
        workspaceId: null
      }
    })

    return NextResponse.json({ success: true, settings: updatedSettings })
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
