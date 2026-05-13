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
    const driver = await payload.findByID({
      collection: 'drivers',
      id,
      depth: 2,
    })

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: driver })
  } catch (error: any) {
    console.error('[GET /api/v1/delivery/drivers/[id]]', error)
    return NextResponse.json({ error: 'Failed to fetch driver' }, { status: 500 })
  }
}

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const user = getAuthUser(req)
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()

    const driver = await payload.update({
      collection: 'drivers',
      id,
      data: body,
    })

    return NextResponse.json({ success: true, data: driver })
  } catch (error: any) {
    console.error('[PUT /api/v1/delivery/drivers/[id]]', error)
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 })
  }
}

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const user = getAuthUser(req)
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const payload = await getPayload({ config })

    // Soft delete by setting isActive to false
    await payload.update({
      collection: 'drivers',
      id,
      data: { isActive: false },
    })

    return NextResponse.json({ success: true, message: 'Driver deactivated' })
  } catch (error: any) {
    console.error('[DELETE /api/v1/delivery/drivers/[id]]', error)
    return NextResponse.json({ error: 'Failed to delete driver' }, { status: 500 })
  }
}