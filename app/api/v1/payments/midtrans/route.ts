import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { core } from '@/lib/midtrans'
import { getAuthUser } from '@/lib/auth-helpers'

// POST /api/v1/payments/midtrans/notification — Midtrans webhook handler
export async function POST(req: NextRequest) {
  try {
    const notificationJson = await req.json()
    const statusResponse = await core.transaction.notification(notificationJson)

    const orderId = statusResponse.order_id
    const transactionStatus = statusResponse.transaction_status
    const fraudStatus = statusResponse.fraud_status

    console.log(
      `[Midtrans Webhook] Order ${orderId}: status=${transactionStatus}, fraud=${fraudStatus}`
    )

    const payload = await getPayload({ config }) as any

    // Find order by orderNumber (Midtrans order_id matches orderNumber)
    const order = await payload.findFirst({
      collection: 'orders',
      where: { orderNumber: { equals: orderId } },
    })

    if (!order) {
      console.warn(`[Midtrans Webhook] Order not found: ${orderId}`)
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    const orderAny = order as any
    let paymentStatus = 'pending'

    if (transactionStatus === 'capture') {
      paymentStatus = fraudStatus === 'accept' ? 'paid' : 'payment_review'
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'paid'
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      paymentStatus = 'failed'
    } else if (transactionStatus === 'pending') {
      paymentStatus = 'pending'
    }

    // Only update if status changed
    if (paymentStatus !== orderAny.paymentStatus) {
      const updateData: any = {
        paymentStatus,
        paymentData: {
          ...(orderAny.paymentData || {}),
          midtransData: statusResponse,
          transactionId: statusResponse.transaction_id,
          paymentType: statusResponse.payment_type,
          vaNumbers: statusResponse.va_numbers,
          bcaVaNumber: statusResponse.bca_va_number,
          permataVaNumber: statusResponse.permata_va_number,
        },
      }

      // Trigger fulfillment status update on payment success
      if (paymentStatus === 'paid' && orderAny.fulfillmentStatus === 'unfulfilled') {
        updateData.fulfillmentStatus = 'processing'
      }

      await payload.update({
        collection: 'orders',
        id: orderAny.id,
        data: updateData,
      })

      // Award loyalty points on successful payment
      if (paymentStatus === 'paid' && orderAny.customer && orderAny.total > 0) {
        try {
          const { awardPurchasePoints } = await import('@/lib/loyalty-engine')
          const customerId = typeof orderAny.customer === 'object' ? orderAny.customer.id : orderAny.customer
          const tenantId = orderAny.tenant
            ? (typeof orderAny.tenant === 'object' ? orderAny.tenant.id : orderAny.tenant)
            : 'default'

          if (customerId) {
            await awardPurchasePoints(customerId, tenantId, orderAny.id, orderAny.total)
          }
        } catch (e) {
          // Non-critical — don't fail webhook
          console.error('[Midtrans Webhook] Failed to award loyalty points:', e)
        }
      }

      console.log(`[Midtrans Webhook] Order ${orderId} updated to ${paymentStatus}`)
    }

    return NextResponse.json({ status: 'OK' })
  } catch (error) {
    console.error('[Midtrans Webhook Error]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}