import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth-helpers'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/v1/notifications/[id] — Get single notification
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const { id } = await params
    const payload = await getPayload({ config }) as any

    const notification = await payload.findByID({
      collection: 'notifications',
      id,
      depth: 1,
    }) as any

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found', data: null }, { status: 404 })
    }

    // Check ownership (admin can see all)
    if (user.role !== 'admin' && notification.user !== user.id && notification.user?.id !== user.id) {
      return NextResponse.json({ error: 'Forbidden', data: null }, { status: 403 })
    }

    return NextResponse.json({ success: true, data: notification })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}

// PATCH /api/v1/notifications/[id] — Mark as read
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const { id } = await params
    const payload = await getPayload({ config }) as any

    const notification = await payload.findByID({
      collection: 'notifications',
      id,
    }) as any

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found', data: null }, { status: 404 })
    }

    // Check ownership
    if (user.role !== 'admin' && notification.user !== user.id && notification.user?.id !== user.id) {
      return NextResponse.json({ error: 'Forbidden', data: null }, { status: 403 })
    }

    const updated = await payload.update({
      collection: 'notifications',
      id,
      data: { isRead: true, readAt: new Date().toISOString() } as any,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}

// DELETE /api/v1/notifications/[id] — Delete notification
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const { id } = await params
    const payload = await getPayload({ config }) as any

    const notification = await payload.findByID({
      collection: 'notifications',
      id,
    }) as any

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found', data: null }, { status: 404 })
    }

    if (user.role !== 'admin' && notification.user !== user.id && notification.user?.id !== user.id) {
      return NextResponse.json({ error: 'Forbidden', data: null }, { status: 403 })
    }

    await payload.delete({
      collection: 'notifications',
      id,
    })

    return NextResponse.json({ success: true, message: 'Notification deleted' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}