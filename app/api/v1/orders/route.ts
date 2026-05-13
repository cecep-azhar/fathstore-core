import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth-helpers'
import { rateLimit, getClientIP } from '@/lib/auth'
import { RATE_LIMIT } from '@/lib/config'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/v1/orders — List orders for authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    // Rate limit general queries
    const ip = getClientIP(req)
    if (!rateLimit(`${ip}:/api/v1/orders`, RATE_LIMIT.general.limit, RATE_LIMIT.general.windowMs)) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later', data: null },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 100)
    const status = searchParams.get('status')

    const payload = await getPayload({ config })

    // Build where — admin sees all, member sees own
    const where: any = user.role === 'admin'
      ? (status ? { fulfillmentStatus: { equals: status } } : {})
      : { customer: { equals: user.id } }

    if (status) {
      where.fulfillmentStatus = { equals: status }
    }

    const results = await payload.find({
      collection: 'orders',
      where,
      page,
      limit,
      sort: '-createdAt',
      depth: 2,
    })

    return NextResponse.json({
      data: results.docs,
      totalDocs: results.totalDocs,
      totalPages: results.totalPages,
      page: results.page,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}

// POST /api/v1/orders — Create order
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const body = await req.json()

    // Validate items
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must have at least one item', data: null },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Generate order number
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    const orderNumber = `ORD-${date}-${random}`

    // Validate stock for each item
    for (const item of body.items) {
      if (item.product) {
        const product = await payload.findByID({
          collection: 'products',
          id: item.product,
        }) as any

        if (product?.trackInventory && !product.continueSellingWhenOutOfStock) {
          if ((product.stock || 0) < item.quantity) {
            return NextResponse.json({
              error: `Insufficient stock for "${item.productTitle}" — only ${product.stock} available`,
              data: null,
            }, { status: 400 })
          }
        }
      }
    }

    // Create order
    const order = await payload.create({
      collection: 'orders',
      data: {
        ...body,
        orderNumber,
        customer: body.customer || user.id,
        status: 'pending',
        paymentStatus: 'pending',
        fulfillmentStatus: 'unfulfilled',
      },
    })

    // Deduct stock for each item
    for (const item of body.items) {
      if (item.product) {
        const product = await payload.findByID({
          collection: 'products',
          id: item.product,
        }) as any

        if (product?.trackInventory && (product.stock || 0) >= item.quantity) {
          await payload.update({
            collection: 'products',
            id: item.product,
            data: { stock: product.stock - item.quantity },
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully',
    }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}