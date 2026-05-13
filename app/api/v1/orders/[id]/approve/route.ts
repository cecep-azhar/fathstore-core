import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

// POST /api/v1/orders/[id]/approve — Approve/reject order (admin only)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required', data: null }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { status } = body

    if (!['approved', 'failed', 'paid', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Use: approved, failed, paid, or cancelled', data: null },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config }) as any

    const order = await payload.findByID({
      collection: 'orders',
      id,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found', data: null }, { status: 404 })
    }

    const orderAny = order as any

    // Map to paymentStatus
    let paymentStatus = orderAny.paymentStatus
    let fulfillmentStatus = orderAny.fulfillmentStatus

    if (status === 'paid' || status === 'approved') {
      paymentStatus = 'paid'
      if (fulfillmentStatus === 'unfulfilled') {
        fulfillmentStatus = 'processing'
      }
    } else if (status === 'failed') {
      paymentStatus = 'failed'
    } else if (status === 'cancelled') {
      // Restore stock if cancelling
      fulfillmentStatus = 'cancelled'
      // Return stock to products
      for (const item of orderAny.items || []) {
        if (item.product) {
          const productId = typeof item.product === 'object' ? item.product.id : item.product
          const product = await payload.findByID({
            collection: 'products',
            id: productId,
          }) as any

          if (product?.trackInventory) {
            await payload.update({
              collection: 'products',
              id: productId,
              data: { stock: (product.stock || 0) + item.quantity },
            })
          }
        }
      }
    }

    const updated = await payload.update({
      collection: 'orders',
      id,
      data: {
        paymentStatus,
        fulfillmentStatus,
        status: paymentStatus === 'paid' ? 'paid' : orderAny.status,
        approvedAt: status === 'paid' ? new Date().toISOString() : undefined,
      },
    })

    // Create order tracking entry
    await payload.create({
      collection: 'order-tracking' as any,
      data: {
        order: id,
        status: status === 'paid' ? 'paid' : status,
        description: `Order ${status} by admin ${user.id}`,
        updatedBy: user.id,
      } as any,
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Order ${id} marked as ${status}`,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}