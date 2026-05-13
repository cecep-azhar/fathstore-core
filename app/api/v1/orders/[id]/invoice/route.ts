import { NextResponse } from 'next/server'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const { id } = await params
    const token = authHeader.replace('Bearer ', '')

    const res = await fetch(`${PAYLOAD_URL}/api/orders/${id}`, {
      headers: { Authorization: `JWT ${token}` },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Order not found', data: null }, { status: res.status })
    }

    const order = await res.json()

    return NextResponse.json({
      data: {
        orderNumber: order.orderNumber || order.id,
        date: order.createdAt,
        items: order.items || [],
        totalAmount: order.totalAmount,
        status: order.fulfillmentStatus,
        paymentStatus: order.paymentStatus,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}