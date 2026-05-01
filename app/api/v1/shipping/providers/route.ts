import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const GET = async (req: NextRequest) => {
  try {
    const payload = await getPayload({ config })

    const providers = await payload.find({
      collection: 'shipping-providers',
      where: { isActive: { equals: true } },
      sort: 'name',
      limit: 50,
    })

    const formatted = providers.docs.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      logo: p.logo,
      description: p.description,
      trackingUrl: p.trackingUrl,
      defaultPrice: p.defaultPrice,
      services: p.services || [],
      estimatedDays: p.estimatedDays,
    }))

    return NextResponse.json({
      success: true,
      data: formatted,
    })
  } catch (error: any) {
    console.error('[GET /api/v1/shipping/providers]', error)
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
  }
}