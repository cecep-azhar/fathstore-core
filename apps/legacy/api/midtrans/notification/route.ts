/**
 * @deprecated Use POST /api/v1/payments/midtrans/notification instead
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { core } from '@/lib/midtrans'

export async function POST(req: NextRequest) {
  try {
    const notificationJson = await req.json()
    const statusResponse = await core.transaction.notification(notificationJson)

    const orderId = statusResponse.order_id
    const transactionStatus = statusResponse.transaction_status
    const fraudStatus = statusResponse.fraud_status

    console.log(`[LEGACY Midtrans] Order ${orderId}: ${transactionStatus}/${fraudStatus}`)

    const payload = await getPayload({ config })

    // Proxy to new handler for orders collection
    const order = await payload.findFirst({
      collection: 'orders',
      where: { orderNumber: { equals: orderId } },
    })

    if (order) {
      // Use new v1 endpoint logic
      let paymentStatus = 'pending'

      if (transactionStatus === 'capture') {
        paymentStatus = fraudStatus === 'accept' ? 'paid' : 'payment_review'
      } else if (transactionStatus === 'settlement') {
        paymentStatus = 'paid'
      } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
        paymentStatus = 'failed'
      }

      await payload.update({
        collection: 'orders',
        id: (order as any).id,
        data: {
          paymentStatus,
          paymentData: { midtransData: statusResponse },
        },
      })
    }

    return NextResponse.json(
      { status: 'OK' },
      {
        headers: {
          'X-Deprecated': 'true',
          'X-Migrate-To': '/api/v1/payments/midtrans',
        },
      }
    )
  } catch (error) {
    console.error('[LEGACY Midtrans Notification Error]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}