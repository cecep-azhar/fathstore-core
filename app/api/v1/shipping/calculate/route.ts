import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const POST = async (req: NextRequest) => {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()
    const { items, destination, tenantSlug } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 })
    }

    // Get tenant config
    let tenantConfig: any = {}
    if (tenantSlug) {
      const tenant = await payload.findFirst({
        collection: 'tenants',
        where: { slug: { equals: tenantSlug } },
      })
      if (tenant) {
        tenantConfig = tenant
      }
    }

    // Fetch shipping providers and rates
    const shippingProviders = await payload.find({
      collection: 'shipping-providers',
      where: { isActive: { equals: true } },
      limit: 20,
    })

    // Fetch shipping zones
    const shippingZones = await payload.find({
      collection: 'shipping-zones',
      where: { isActive: { equals: true } },
      limit: 20,
    })

    // Fetch shipping rates
    const shippingRates = await payload.find({
      collection: 'shipping-rates',
      where: { isActive: { equals: true } },
      limit: 100,
    })

    // Calculate total weight
    const totalWeight = items.reduce((sum: number, item: any) => {
      return sum + (item.weight || 500) * (item.quantity || 1)
    }, 0)

    // Calculate subtotal for free shipping threshold
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.price || 0) * (item.quantity || 1)
    }, 0)

    // Build shipping options
    const shippingOptions = []

    for (const provider of shippingProviders.docs) {
      const rates = shippingRates.docs.filter((rate: any) => {
        return rate.provider?.id === provider.id ||
          rate.provider === provider.id
      })

      for (const rate of rates) {
        // Calculate cost
        let cost = 0
        const method = rate.method || 'flat'

        switch (method) {
          case 'flat':
            cost = rate.price || 0
            break
          case 'per_item':
            cost = (rate.price || 0) * items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
            break
          case 'weight':
            cost = (rate.price || 0) * Math.ceil(totalWeight / 1000)
            break
          case 'price':
            cost = (rate.price || 0) * Math.ceil(subtotal / 10000)
            break
          case 'free':
            cost = 0
            break
          default:
            cost = rate.price || 0
        }

        // Check free shipping threshold
        if (rate.minOrderAmount && subtotal >= rate.minOrderAmount) {
          cost = 0
        }

        // Calculate ETD
        const etdDays = rate.deliveryDays || 3

        shippingOptions.push({
          provider: provider.slug || provider.id,
          providerName: provider.name,
          providerLogo: provider.logo,
          service: rate.name || 'Standard',
          serviceCode: rate.slug,
          cost,
          etd: etdDays > 1 ? `${etdDays - 1}-${etdDays} hari` : `${etdDays} hari`,
          isAvailable: true,
        })
      }

      // If no specific rates, add default option
      if (rates.length === 0) {
        shippingOptions.push({
          provider: provider.slug || provider.id,
          providerName: provider.name,
          providerLogo: provider.logo,
          service: 'Standard',
          serviceCode: 'standard',
          cost: provider.defaultPrice || 20000,
          etd: '3-5 hari',
          isAvailable: true,
        })
      }
    }

    // Sort by cost
    shippingOptions.sort((a, b) => a.cost - b.cost)

    return NextResponse.json({
      success: true,
      data: {
        items: shippingOptions,
        totalWeight,
        subtotal,
        destination,
      },
    })
  } catch (error: any) {
    console.error('[POST /api/v1/shipping/calculate]', error)
    return NextResponse.json({ error: 'Failed to calculate shipping' }, { status: 500 })
  }
}