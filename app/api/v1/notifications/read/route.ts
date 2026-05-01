import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const POST = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()
    const { notificationIds, markAllRead } = body

    if (markAllRead) {
      // Mark all notifications as read
      await payload.updateMany({
        collection: 'notifications',
        where: { user: { equals: user.id }, isRead: { equals: false } },
        data: {
          isRead: true,
          readAt: new Date().toISOString(),
        },
      })
      return NextResponse.json({ success: true, message: 'All notifications marked as read' })
    }

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json({ error: 'Notification IDs required' }, { status: 400 })
    }

    // Mark specific notifications as read
    for (const id of notificationIds) {
      const notification = await payload.findByID({
        collection: 'notifications',
        id,
      })

      if (notification && (notification as any).user === user.id) {
        await payload.update({
          collection: 'notifications',
          id,
          data: {
            isRead: true,
            readAt: new Date().toISOString(),
          },
        })
      }
    }

    return NextResponse.json({ success: true, message: 'Notifications marked as read' })
  } catch (error: any) {
    console.error('[POST /api/v1/notifications/read]', error)
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 })
  }
}