import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth-helpers'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/v1/orders/[id] — Get order detail
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
    const payload = await getPayload({ config })

    const order = await payload.findByID({
      collection: 'orders',
      id,
      depth: 3,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found', data: null }, { status: 404 })
    }

    // Member can only see own orders
    if (user.role !== 'admin' && (order as any).customer !== user.id) {
      return NextResponse.json({ error: 'Forbidden', data: null }, { status: 403 })
    }

    return NextResponse.json({ data: order })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}

// PATCH /api/v1/orders/[id] — Update order (status, tracking, etc.)
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
    const body = await req.json()
    const payload = await getPayload({ config })

    const order = await payload.findByID({
      collection: 'orders',
      id,
    }) as any

    if (!order) {
      return NextResponse.json({ error: 'Order not found', data: null }, { status: 404 })
    }

    // Member can only update own pending orders (cancel)
    if (user.role !== 'admin') {
      if (order.customer !== user.id) {
        return NextResponse.json({ error: 'Forbidden', data: null }, { status: 403 })
      }
      // Only allow cancellation of pending orders
      if (body.status === 'cancelled' && order.status !== 'pending') {
        return NextResponse.json(
          { error: 'Only pending orders can be cancelled', data: null },
          { status: 400 }
        )
      }
    }

    const updated = await payload.update({
      collection: 'orders',
      id,
      data: body,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}