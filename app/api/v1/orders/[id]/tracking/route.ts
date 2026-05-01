import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

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

    const payload = await getPayload({ config })
    const body = await req.json()
    const { trackingNumber, shippingCarrier, shippingService } = body

    // Fetch order to check permission
    const order = await payload.findByID({
      collection: 'orders',
      id,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Only admin or the customer who owns the order can update
    if (user.role !== 'admin' && order.customer !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await payload.update({
      collection: 'orders',
      id,
      data: {
        trackingNumber,
        shippingCarrier,
        shippingService,
      },
    })

    // Create order tracking entry
    if (trackingNumber) {
      await payload.create({
        collection: 'order-tracking',
        data: {
          order: id,
          status: 'shipped',
          description: `Resi ${shippingCarrier || ''} - ${trackingNumber}`,
          trackingNumber,
          location: 'System',
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error('[PUT /api/v1/orders/[id]/tracking]', error)
    return NextResponse.json({ error: 'Failed to update tracking' }, { status: 500 })
  }
}