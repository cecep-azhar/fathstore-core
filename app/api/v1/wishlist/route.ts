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

    const payload = await getPayload({ config })

    const wishlists = await payload.find({
      collection: 'wishlists',
      where: { user: { equals: user.id } },
      sort: '-createdAt',
      limit: 50,
      depth: 2,
    })

    return NextResponse.json({
      success: true,
      data: wishlists.docs,
      total: wishlists.totalDocs,
    })
  } catch (error: any) {
    console.error('[GET /api/v1/wishlist]', error)
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if already in wishlist
    const existing = await payload.findFirst({
      collection: 'wishlists',
      where: {
        user: { equals: user.id },
        product: { equals: productId },
      },
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        data: existing,
        message: 'Product already in wishlist',
      })
    }

    const wishlist = await payload.create({
      collection: 'wishlists',
      data: {
        user: user.id,
        product: productId,
      },
    })

    return NextResponse.json({ success: true, data: wishlist }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/v1/wishlist]', error)
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 })
  }
}