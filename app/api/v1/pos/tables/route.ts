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
    const outletId = searchParams.get('outletId')
    const tenantSlug = searchParams.get('tenantSlug')

    const payload = await getPayload({ config })

    const where: any = {}
    if (outletId) where.outlet = { equals: outletId }
    if (tenantSlug) {
      const tenant = await payload.findFirst({
        collection: 'tenants',
        where: { slug: { equals: tenantSlug } },
      })
      if (tenant) where.tenant = { equals: (tenant as any).id }
    }

    const tables = await payload.find({
      collection: 'pos-tables',
      where,
      sort: 'name',
      limit: 100,
    })

    return NextResponse.json({
      success: true,
      data: tables.docs,
      total: tables.totalDocs,
    })
  } catch (error: any) {
    console.error('[GET /api/v1/pos/tables]', error)
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 })
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

    const table = await payload.create({
      collection: 'pos-tables',
      data: body,
    })

    return NextResponse.json({ success: true, data: table }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/v1/pos/tables]', error)
    return NextResponse.json({ error: 'Failed to create table' }, { status: 500 })
  }
}