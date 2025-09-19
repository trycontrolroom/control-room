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

    const userRole = session.user.workspaceRole
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const action = searchParams.get('action')
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const days = searchParams.get('days')

    const where: any = {}
    
    if (action) {
      where.action = { contains: action, mode: 'insensitive' }
    }
    
    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }
    
    if (dateFrom || dateTo || days) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo + 'T23:59:59.999Z')
      }
      if (days && !dateFrom && !dateTo) {
        const daysAgo = new Date()
        daysAgo.setDate(daysAgo.getDate() - parseInt(days))
        where.createdAt.gte = daysAgo
      }
    }

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10000 // Limit export to 10k records for performance
    })

    if (format === 'csv') {
      const csvHeaders = [
        'Timestamp',
        'User Name',
        'User Email',
        'Action',
        'Details',
        'IP Address',
        'User Agent',
        'Workspace ID'
      ]

      const csvRows = logs.map(log => [
        new Date(log.createdAt).toISOString(),
        log.user.name || '',
        log.user.email || '',
        log.action,
        typeof log.details === 'object' ? JSON.stringify(log.details) : (log.details || ''),
        log.ipAddress || '',
        log.userAgent || '',
        log.workspaceId || ''
      ])

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => 
          row.map(field => 
            typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))
              ? `"${field.replace(/"/g, '""')}"` 
              : field
          ).join(',')
        )
      ].join('\n')

      const response = new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          workspaceId: null,
          action: 'EXPORT_AUDIT_LOGS',
          details: {
            format,
            recordCount: logs.length,
            filters: { action, search, dateFrom, dateTo }
          },
          ipAddress: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })

      return response
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })

  } catch (error) {
    console.error('Audit logs export error:', error)
    return NextResponse.json(
      { error: 'Failed to export audit logs' },
      { status: 500 }
    )
  }
}
