import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const GET = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const tenantSlug = searchParams.get('tenantSlug')
    const status = searchParams.get('status')

    const payload = await getPayload({ config })

    const where: any = {}
    if (status) {
      where.status = { equals: status }
    }
    if (tenantSlug) {
      const tenant = await payload.findFirst({
        collection: 'tenants',
        where: { slug: { equals: tenantSlug } },
      })
      if (tenant) {
        where.tenant = { equals: tenant.id }
      }
    }

    const assignments = await payload.find({
      collection: 'delivery-assignments',
      where,
      sort: '-createdAt',
      limit: 50,
      depth: 3,
    })

    return NextResponse.json({
      success: true,
      data: assignments.docs,
      total: assignments.totalDocs,
    })
  } catch (error: any) {
    console.error('[GET /api/v1/delivery/assignments]', error)
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req)
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()
    const { orderId, driverId, tenantId, pickupAddress, deliveryAddress, isCOD, codAmount } = body

    // Generate tracking token
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let trackingToken = ''
    for (let i = 0; i < 12; i++) {
      trackingToken += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    const assignment = await payload.create({
      collection: 'delivery-assignments',
      data: {
        order: orderId,
        driver: driverId,
        tenant: tenantId,
        trackingToken,
        status: 'assigned',
        assignedAt: new Date().toISOString(),
        pickupAddress,
        deliveryAddress,
        isCOD: isCOD || false,
        codAmount: codAmount || 0,
      },
    })

    // Update order with delivery assignment
    if (orderId) {
      await payload.update({
        collection: 'orders',
        id: orderId,
        data: {
          deliveryAssignment: assignment.id,
          deliveryType: 'internal',
        },
      })
    }

    return NextResponse.json({ success: true, data: assignment }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/v1/delivery/assignments]', error)
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 })
  }
}