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
    const tenantSlug = searchParams.get('tenantSlug') || 'default'
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const type = searchParams.get('type') // earn, redeem, bonus, referral, expire, adjust

    const payload = await getPayload({ config })

    // Get tenant
    const tenant = await payload.findFirst({
      collection: 'tenants',
      where: { slug: { equals: tenantSlug } },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Build where clause
    const where: any = {
      user: { equals: user.id },
      tenant: { equals: tenant.id },
    }
    if (type) {
      where.type = { equals: type }
    }

    const results = await payload.find({
      collection: 'loyalty-points',
      where,
      sort: '-createdAt',
      limit,
      page,
    })

    return NextResponse.json({
      success: true,
      data: results.docs,
      total: results.totalDocs,
      page: results.page,
      totalPages: results.totalPages,
    })
  } catch (error: any) {
    console.error('[GET /api/v1/loyalty/history]', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}