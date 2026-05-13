import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 })
    }

    const payload = await getPayload({ config }) as any

    // Find the order
    const order = await payload.findFirst({
      collection: 'orders',
      where: { orderNumber: { equals: orderId } },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Get payment status from order
    const paymentData = (order as any).paymentData || {}

    // If Midtrans token exists, return mock status
    if (paymentData.midtransToken) {
      return NextResponse.json({
        success: true,
        data: {
          orderId: (order as any).orderNumber,
          transactionId: paymentData.transactionId || null,
          status: (order as any).paymentStatus, // pending, paid, failed
          grossAmount: (order as any).total,
          paymentType: paymentData.paymentType || null,
          vaNumbers: paymentData.vaNumbers || null,
        },
      })
    }

    // Return order's payment status
    return NextResponse.json({
      success: true,
      data: {
        orderId: (order as any).orderNumber,
        status: (order as any).paymentStatus,
        grossAmount: (order as any).total,
      },
    })
  } catch (error: any) {
    console.error('[GET /api/v1/payments/midtrans/status]', error)
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
  }
}