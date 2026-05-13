import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const payload = await getPayload({ config }) as any

    const result = await payload.updateMany({
      collection: 'notifications',
      where: { user: { equals: user.id }, isRead: { equals: false } } as any,
      data: {
        isRead: true,
        readAt: new Date().toISOString(),
      } as any,
    })

    return NextResponse.json({
      success: true,
      data: { matchedCount: result.matched, modifiedCount: result.modified },
      message: `${result.modified} notifications marked as read`,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to mark all as read'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}

export const PATCH = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config }) as any

    const result = await payload.updateMany({
      collection: 'notifications',
      where: { user: { equals: user.id }, isRead: { equals: false } } as any,
      data: {
        isRead: true,
        readAt: new Date().toISOString(),
      } as any,
    })

    return NextResponse.json({
      success: true,
      message: `${result.modified} notifications marked as read`,
    })
  } catch (error: any) {
    console.error('[PATCH /api/v1/notifications/read-all]', error)
    return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 })
  }
}