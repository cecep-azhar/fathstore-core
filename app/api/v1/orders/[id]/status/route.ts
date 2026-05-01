import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

// Valid fulfillment status transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  unfulfilled: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['completed', 'complaint'],
  completed: ['returned'],
  complaint: ['completed', 'refunded'],
}

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin can update fulfillment status
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()
    const { fulfillmentStatus, paymentStatus } = body

    // Fetch current order
    const order = await payload.findByID({
      collection: 'orders',
      id,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Validate status transition
    if (fulfillmentStatus && order.fulfillmentStatus) {
      const allowed = VALID_TRANSITIONS[order.fulfillmentStatus] || []
      if (!allowed.includes(fulfillmentStatus)) {
        return NextResponse.json({
          error: `Invalid status transition from '${order.fulfillmentStatus}' to '${fulfillmentStatus}'`,
        }, { status: 400 })
      }
    }

    const updateData: any = {}
    if (fulfillmentStatus) updateData.fulfillmentStatus = fulfillmentStatus
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const updated = await payload.update({
      collection: 'orders',
      id,
      data: updateData,
    })

    // Create tracking entry
    if (fulfillmentStatus) {
      const statusDescriptions: Record<string, string> = {
        unfulfilled: 'Order pending',
        processing: 'Order being processed',
        shipped: 'Order shipped',
        completed: 'Order completed',
        cancelled: 'Order cancelled',
        complaint: 'Order complaint',
        refunded: 'Order refunded',
        returned: 'Order returned',
      }

      await payload.create({
        collection: 'order-tracking',
        data: {
          order: id,
          status: fulfillmentStatus,
          description: statusDescriptions[fulfillmentStatus] || fulfillmentStatus,
          location: 'Admin Panel',
          updatedBy: typeof user.id === 'string' ? user.id : String(user.id),
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error('[PUT /api/v1/orders/[id]/status]', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}