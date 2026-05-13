import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) => {
  try {
    const { productId } = await params
    const { searchParams } = new URL(req.url)
    const outletId = searchParams.get('outletId')

    const payload = await getPayload({ config })

    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        productId,
        productTitle: (product as any).title,
        baseStock: (product as any).stock || 0,
        trackInventory: (product as any).trackInventory,
        // In a real app, you'd have outlet-specific stock here
        outletStock: (product as any).stock || 0,
      },
    })
  } catch (error: any) {
    console.error('[GET /api/v1/pos/stock/[productId]]', error)
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 })
  }
}

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) => {
  try {
    const { productId } = await params
    const user = getAuthUser(req)
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'merchant')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()
    const { quantity, type, reason, outletId } = body

    // Get current stock
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const currentStock = (product as any).stock || 0
    let newStock = currentStock

    if (type === 'restock') {
      newStock = currentStock + quantity
    } else if (type === 'sale') {
      newStock = Math.max(0, currentStock - quantity)
    } else if (type === 'adjustment') {
      newStock = quantity
    }

    // Update product stock
    await payload.update({
      collection: 'products',
      id: productId,
      data: { stock: newStock },
    })

    // Create stock adjustment record
    await payload.create({
      collection: 'stock-adjustments',
      data: {
        product: productId,
        outlet: outletId,
        tenant: body.tenantId,
        type,
        quantity: type === 'adjustment' ? newStock - currentStock : quantity,
        stockBefore: currentStock,
        stockAfter: newStock,
        reason: reason || `POS ${type}`,
        createdBy: user.id,
        status: 'approved',
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        productId,
        previousStock: currentStock,
        newStock,
        adjustment: newStock - currentStock,
      },
    })
  } catch (error: any) {
    console.error('[PUT /api/v1/pos/stock/[productId]]', error)
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 })
  }
}