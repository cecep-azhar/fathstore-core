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
    const { latitude, longitude, address } = body

    // Update driver location
    const driver = await payload.update({
      collection: 'drivers',
      id,
      data: {
        currentLocation: {
          latitude,
          longitude,
          address: address || '',
          updatedAt: new Date().toISOString(),
        },
      },
    })

    // Also log to driver-locations if collection exists
    try {
      await payload.create({
        collection: 'driver-locations',
        data: {
          driver: id,
          latitude,
          longitude,
          accuracy: body.accuracy || null,
        },
      })
    } catch {
      // Collection might not exist yet, ignore
    }

    return NextResponse.json({
      success: true,
      data: driver.currentLocation,
      message: 'Location updated',
    })
  } catch (error: any) {
    console.error('[PUT /api/v1/delivery/drivers/[id]/location]', error)
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 })
  }
}