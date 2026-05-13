import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Public endpoint - no auth required
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) => {
  try {
    const { token } = await params

    const payload = await getPayload({ config })

    const assignment = await payload.findFirst({
      collection: 'delivery-assignments',
      where: { trackingToken: { equals: token } },
      depth: 3,
    })

    if (!assignment) {
      return NextResponse.json({
        error: 'Tracking not found',
        message: 'Invalid or expired tracking token',
      }, { status: 404 })
    }

    // Return minimal public data
    const publicData = {
      trackingToken: (assignment as any).trackingToken,
      status: (assignment as any).status,
      orderNumber: (assignment as any).order?.orderNumber || 'N/A',
      pickupAddress: (assignment as any).pickupAddress,
      deliveryAddress: (assignment as any).deliveryAddress,
      assignedAt: (assignment as any).assignedAt,
      pickedUpAt: (assignment as any).pickedUpAt,
      deliveredAt: (assignment as any).deliveredAt,
      eta: (assignment as any).eta,
      driver: (assignment as any).driver ? {
        name: (assignment as any).driver?.name,
        phone: (assignment as any).driver?.phone,
        vehicleType: (assignment as any).driver?.vehicleType,
        vehiclePlate: (assignment as any).driver?.vehiclePlate,
      } : null,
      locationHistory: (assignment as any).locationHistory?.slice(-10) || [], // Last 10 locations
      isCOD: (assignment as any).isCOD,
      codAmount: (assignment as any).codAmount,
      codCollected: (assignment as any).codCollected,
    }

    return NextResponse.json({
      success: true,
      data: publicData,
    })
  } catch (error: any) {
    console.error('[GET /api/v1/delivery/track/[token]]', error)
    return NextResponse.json({ error: 'Failed to fetch tracking' }, { status: 500 })
  }
}