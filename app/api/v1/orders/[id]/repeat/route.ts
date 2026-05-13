import { NextResponse } from 'next/server'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const { id } = await params
    const token = authHeader.replace('Bearer ', '')

    const orderRes = await fetch(`${PAYLOAD_URL}/api/orders/${id}`, {
      headers: { Authorization: `JWT ${token}` },
    })

    if (!orderRes.ok) {
      return NextResponse.json({ error: 'Order not found', data: null }, { status: orderRes.status })
    }

    const order = await orderRes.json()

    const items = (order.items || []).map((item: Record<string, unknown>) => ({
      product: typeof item.product === 'object' ? item.product.id : item.product,
      quantity: item.quantity,
      price: item.price,
    }))

    const newOrderRes = await fetch(`${PAYLOAD_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({
        items,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        notes: `Repeat of order #${id}`,
      }),
    })

    if (!newOrderRes.ok) {
      const errData = await newOrderRes.json()
      return NextResponse.json(
        { error: errData.errors?.[0]?.message || 'Failed to repeat order', data: null },
        { status: newOrderRes.status }
      )
    }

    const newOrder = await newOrderRes.json()
    return NextResponse.json({ data: newOrder.doc || newOrder })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}