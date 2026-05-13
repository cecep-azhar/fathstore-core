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
    const available = searchParams.get('available') === 'true'

    const payload = await getPayload({ config })

    const where: any = { isActive: { equals: true } }
    if (available) {
      where.isAvailable = { equals: true }
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

    const drivers = await payload.find({
      collection: 'drivers',
      where,
      sort: 'name',
      limit: 100,
    })

    return NextResponse.json({
      success: true,
      data: drivers.docs,
      total: drivers.totalDocs,
    })
  } catch (error: any) {
    console.error('[GET /api/v1/delivery/drivers]', error)
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 })
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

    const driver = await payload.create({
      collection: 'drivers',
      data: {
        ...body,
      },
    })

    return NextResponse.json({ success: true, data: driver }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/v1/delivery/drivers]', error)
    return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 })
  }
}