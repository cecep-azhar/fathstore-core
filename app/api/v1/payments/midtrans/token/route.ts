import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth-helpers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createSnapTransaction } from '@/lib/midtrans'

// POST /api/v1/payments/midtrans/token — Create Midtrans Snap token
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const body = await req.json()
    const { orderId, amount, customer, items } = body

    if (!orderId || !amount || !customer) {
      return NextResponse.json(
        { error: 'Missing required parameters: orderId, amount, customer', data: null },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config }) as any

    // Verify order exists and belongs to user
    const order = await payload.findFirst({
      collection: 'orders',
      where: { orderNumber: { equals: orderId } },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found', data: null }, { status: 404 })
    }

    const orderAny = order as any
    if (orderAny.customer !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden', data: null }, { status: 403 })
    }

    const snapResponse = await createSnapTransaction(
      {
        order_id: orderId,
        gross_amount: amount,
      },
      customer,
      items
    )

    // Store token in order paymentData
    await payload.update({
      collection: 'orders',
      id: orderAny.id,
      data: {
        paymentData: {
          ...(orderAny.paymentData || {}),
          midtransToken: snapResponse.token,
          midtransRedirectUrl: snapResponse.redirect_url,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        token: snapResponse.token,
        redirectUrl: snapResponse.redirect_url,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create transaction'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}