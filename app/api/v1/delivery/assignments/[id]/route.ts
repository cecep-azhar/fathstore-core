import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const GET = async (
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
    const assignment = await payload.findByID({
      collection: 'delivery-assignments',
      id,
      depth: 3,
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: assignment })
  } catch (error: any) {
    console.error('[GET /api/v1/delivery/assignments/[id]]', error)
    return NextResponse.json({ error: 'Failed to fetch assignment' }, { status: 500 })
  }
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

    const payload = await getPayload({ config })
    const body = await req.json()
    const { status, locationHistory, customerRating, customerFeedback, failureReason } = body

    const updateData: any = {}

    if (status) {
      updateData.status = status

      // Update timestamps based on status
      switch (status) {
        case 'accepted':
          updateData.acceptedAt = new Date().toISOString()
          break
        case 'picked_up':
          updateData.pickedUpAt = new Date().toISOString()
          break
        case 'delivered':
          updateData.deliveredAt = new Date().toISOString()
          break
        case 'cancelled':
          updateData.cancelledAt = new Date().toISOString()
          break
      }
    }

    if (locationHistory) {
      updateData.locationHistory = locationHistory
    }

    if (customerRating !== undefined) {
      updateData.customerRating = customerRating
    }

    if (customerFeedback !== undefined) {
      updateData.customerFeedback = customerFeedback
    }

    if (failureReason) {
      updateData.failureReason = failureReason
    }

    const assignment = await payload.update({
      collection: 'delivery-assignments',
      id,
      data: updateData,
    })

    // If delivered, update order fulfillment status
    if (status === 'delivered' && assignment.order) {
      await payload.update({
        collection: 'orders',
        id: (assignment as any).order,
        data: { fulfillmentStatus: 'completed' },
      })

      // If COD, mark as collected
      if ((assignment as any).isCOD) {
        await payload.update({
          collection: 'delivery-assignments',
          id,
          data: { codCollected: true, codCollectedAt: new Date().toISOString() },
        })
      }
    }

    // If picked up, update order status to shipped
    if (status === 'picked_up' && assignment.order) {
      await payload.update({
        collection: 'orders',
        id: (assignment as any).order,
        data: { fulfillmentStatus: 'shipped' },
      })
    }

    return NextResponse.json({ success: true, data: assignment })
  } catch (error: any) {
    console.error('[PUT /api/v1/delivery/assignments/[id]]', error)
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 })
  }
}