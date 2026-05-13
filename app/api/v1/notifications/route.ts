import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const GET = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const payload = await getPayload({ config }) as any

    const where: any = { user: { equals: user.id } }
    if (unreadOnly) {
      where.isRead = { equals: false }
    }

    const notifications = await payload.find({
      collection: 'notifications',
      where,
      sort: '-createdAt',
      limit,
      page,
    })

    return NextResponse.json({
      success: true,
      data: notifications.docs,
      total: notifications.totalDocs,
      unreadCount: unreadOnly ? notifications.totalDocs : await getUnreadCount(payload, user.id),
    })
  } catch (error: any) {
    console.error('[GET /api/v1/notifications]', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

async function getUnreadCount(payload: any, userId: string | number): Promise<number> {
  const result = await payload.find({
    collection: 'notifications',
    where: { user: { equals: userId }, isRead: { equals: false } },
    limit: 0,
    select: ['id'],
  })
  return result.totalDocs
}