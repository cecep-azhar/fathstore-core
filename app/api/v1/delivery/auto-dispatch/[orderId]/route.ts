import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) => {
  try {
    const { orderId } = await params
    const user = getAuthUser(req)
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const payload = await getPayload({ config })

    // Get order
    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if tenant has auto-dispatch enabled
    const tenant = (order as any).vendor ? await payload.findByID({
      collection: 'tenants',
      id: (order as any).vendor,
    }) : null

    const deliveryConfig = tenant ? (tenant as any).deliveryConfig : null
    if (!deliveryConfig?.autoDispatchEnabled) {
      return NextResponse.json({
        error: 'Auto-dispatch not enabled',
        message: 'Enable auto-dispatch in tenant delivery config',
      }, { status: 400 })
    }

    if (!deliveryConfig?.internalDeliveryEnabled) {
      return NextResponse.json({
        error: 'Internal delivery not enabled',
        message: 'Enable internal delivery in tenant delivery config',
      }, { status: 400 })
    }

    // Get available drivers
    const drivers = await payload.find({
      collection: 'drivers',
      where: {
        isActive: { equals: true },
        isAvailable: { equals: true },
        tenant: { equals: (order as any).vendor },
      },
      sort: 'rating',
    })

    if (drivers.docs.length === 0) {
      return NextResponse.json({
        error: 'No available drivers',
        message: 'No drivers available for auto-dispatch',
      }, { status: 400 })
    }

    // Simple auto-dispatch: pick the nearest/highest rated driver
    // In production, this would use GPS coordinates to find the nearest driver
    const selectedDriver = drivers.docs[0]

    // Generate tracking token
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let trackingToken = ''
    for (let i = 0; i < 12; i++) {
      trackingToken += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // Create assignment
    const assignment = await payload.create({
      collection: 'delivery-assignments',
      data: {
        order: orderId,
        driver: (selectedDriver as any).id,
        tenant: (order as any).vendor,
        trackingToken,
        status: 'assigned',
        assignedAt: new Date().toISOString(),
        deliveryAddress: (order as any).shippingAddress,
      },
    })

    // Update order
    await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        deliveryAssignment: assignment.id,
        deliveryType: 'internal',
      },
    })

    // Update driver availability
    await payload.update({
      collection: 'drivers',
      id: (selectedDriver as any).id,
      data: { isAvailable: false },
    })

    // Create notification for driver
    await payload.create({
      collection: 'notifications',
      data: {
        user: (selectedDriver as any).user,
        tenant: (order as any).vendor,
        type: 'delivery',
        title: '📦 Penugasan Baru!',
        body: `Order #${(order as any).orderNumber} ditugaskan ke Anda. Segera proses.`,
        actionLabel: 'Lihat Detail',
        channels: 'in_app',
      },
    })

    return NextResponse.json({
      success: true,
      data: assignment,
      message: `Auto-assigned to driver: ${(selectedDriver as any).name}`,
    })
  } catch (error: any) {
    console.error('[POST /api/v1/delivery/auto-dispatch/[orderId]]', error)
    return NextResponse.json({ error: 'Failed to auto-dispatch' }, { status: 500 })
  }
}