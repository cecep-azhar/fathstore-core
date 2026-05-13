import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    const notification = await payload.findByID({
      collection: 'notifications',
      id,
    })

    if (!notification || (notification as any).user !== user.id) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    const updated = await payload.update({
      collection: 'notifications',
      id,
      data: {
        isRead: true,
        readAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    console.error('[PATCH /api/v1/notifications/:id/read]', error)
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 })
  }
}