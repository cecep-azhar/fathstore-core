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
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    const payload = await getPayload({ config })

    const where: any = { status: { equals: 'active' } }

    if (outletId) {
      // Filter by outlet-specific stock if needed
    }

    if (categoryId) {
      where.category = { equals: categoryId }
    }

    if (search) {
      where.title = { like: search }
    }

    const products = await payload.find({
      collection: 'products',
      where,
      sort: 'title',
      limit,
      depth: 1,
    })

    // Return simplified product data for POS offline cache
    const syncData = products.docs.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      sku: p.sku,
      barcode: p.barcode,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      stock: p.stock || 0,
      trackInventory: p.trackInventory,
      continueSellingWhenOutOfStock: p.continueSellingWhenOutOfStock,
      hasVariants: p.hasVariants,
      variants: p.variants?.map((v: any) => ({
        id: v.id,
        variantTitle: v.variantTitle,
        sku: v.sku,
        barcode: v.barcode,
        price: v.price,
        stock: v.stock || 0,
        options: v.options,
      })) || [],
      category: p.category,
      images: p.images?.map((img: any) => img.image?.url || null).filter(Boolean) || [],
    }))

    return NextResponse.json({
      success: true,
      data: syncData,
      total: products.totalDocs,
      syncedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[GET /api/v1/pos/products/sync]', error)
    return NextResponse.json({ error: 'Failed to sync products' }, { status: 500 })
  }
}