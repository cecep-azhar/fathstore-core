import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params

    const payload = await getPayload({ config })

    const tenant = await payload.findFirst({
      collection: 'tenants',
      where: { slug: { equals: slug } },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Get products for this brand
    const products = await payload.find({
      collection: 'products',
      where: {
        vendor: { equals: (tenant as any).id },
        status: { equals: 'active' },
      },
      limit: 50,
      sort: '-createdAt',
    })

    // Get hero sliders
    const heroSliders = await payload.find({
      collection: 'hero-sliders',
      where: { tenant: { equals: (tenant as any).id } },
      limit: 10,
    })

    // Get categories
    const categories = await payload.find({
      collection: 'categories',
      where: {
        tenant: { equals: (tenant as any).id },
        status: { equals: 'active' },
      },
      sort: 'title',
    })

    const branding = (tenant as any).branding || {}
    const memberConfig = (tenant as any).memberConfig || {}
    const posConfig = (tenant as any).posConfig || {}
    const deliveryConfig = (tenant as any).deliveryConfig || {}

    return NextResponse.json({
      success: true,
      data: {
        id: (tenant as any).id,
        name: (tenant as any).name,
        slug: (tenant as any).slug,
        description: (tenant as any).description,
        domain: (tenant as any).domain,
        logo: (tenant as any).logo?.url || (tenant as any).logoUrl || null,
        isActive: (tenant as any).isActive,
        businessMode: (tenant as any).businessMode,
        contactEmail: (tenant as any).contactEmail,
        contactPhone: (tenant as any).contactPhone,
        whatsappUrl: (tenant as any).whatsappUrl,
        address: (tenant as any).address,
        branding: {
          primaryColor: branding.primaryColor || '#16a34a',
          secondaryColor: branding.secondaryColor || '#f59e0b',
          accentColor: branding.accentColor || '#0ea5e9',
          headingFont: branding.headingFont || 'Inter',
          bodyFont: branding.bodyFont || 'Inter',
          logoUrl: branding.logoUrl || null,
          splashImage: branding.splashImage?.url || null,
          favicon: branding.favicon?.url || null,
          receiptHeader: branding.receiptHeader || null,
          receiptFooter: branding.receiptFooter || null,
        },
        memberConfig: {
          loyaltyEnabled: memberConfig.loyaltyEnabled !== false,
          referralEnabled: memberConfig.referralEnabled !== false,
          wishlistEnabled: memberConfig.wishlistEnabled !== false,
          pointsPerRupiah: memberConfig.pointsPerRupiah || 1000,
          redeemRate: memberConfig.redeemRate || 100,
          birthdayBonusPoints: memberConfig.birthdayBonusPoints || 500,
          referralBonusPoints: memberConfig.referralBonusPoints || 100,
          tierThresholds: memberConfig.tierThresholds || { silver: 5000, gold: 20000, platinum: 50000 },
        },
        posConfig: {
          taxRate: posConfig.taxRate || 11,
          serviceCharge: posConfig.serviceCharge || 0,
          offlineSyncEnabled: posConfig.offlineSyncEnabled !== false,
          maxOfflineHours: posConfig.maxOfflineHours || 8,
          kdsEnabled: posConfig.kdsEnabled || false,
          splitBillEnabled: posConfig.splitBillEnabled || false,
        },
        deliveryConfig: {
          internalDeliveryEnabled: deliveryConfig.internalDeliveryEnabled || false,
          autoDispatchEnabled: deliveryConfig.autoDispatchEnabled || false,
          maxDeliveryRadius: deliveryConfig.maxDeliveryRadius || 10,
          codEnabled: deliveryConfig.codEnabled || false,
        },
        products: products.docs.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          thumbnail: p.thumbnail?.url || null,
          stock: p.stock,
        })),
        categories: categories.docs.map((c: any) => ({
          id: c.id,
          title: c.title,
          slug: c.slug,
        })),
        heroSliders: heroSliders.docs.map((s: any) => ({
          id: s.id,
          title: s.title,
          image: s.image?.url || null,
          link: s.link || null,
        })),
      },
    })
  } catch (error: any) {
    console.error('[GET /api/v1/brands/[slug]]', error)
    return NextResponse.json({ error: 'Failed to fetch brand config' }, { status: 500 })
  }
}