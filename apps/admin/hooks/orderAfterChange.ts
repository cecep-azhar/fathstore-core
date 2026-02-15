import type { CollectionAfterChangeHook } from 'payload'

/**
 * Order afterChange Hook — Xendit 1% Split-Payment
 *
 * When an order transitions to "paid" status:
 * 1. Look up the tenant's license → get feePercentage (default 1%)
 * 2. Calculate platform fee = order.total × feePercentage / 100
 * 3. Call Xendit Create Disbursement API
 * 4. Log the result back to the order's paymentData
 */
export const orderAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Only trigger when status changes to "paid"
  if (operation === 'update' && doc.paymentStatus === 'paid' && previousDoc?.paymentStatus !== 'paid') {
    const payload = req.payload

    try {
      // ── 1. Get tenant's license ─────────────────────────
      const tenantId = typeof doc.tenantId === 'object' ? doc.tenantId?.id : doc.tenantId

      let feePercentage = 1 // default 1%

      if (tenantId) {
        const licenses = await payload.find({
          collection: 'licenses',
          where: {
            and: [
              { tenant: { equals: tenantId } },
              { status: { equals: 'active' } },
            ],
          },
          limit: 1,
        })

        if (licenses.docs.length > 0) {
          feePercentage = (licenses.docs[0] as any).feePercentage ?? 1
        }
      }

      // ── 2. Calculate platform fee ───────────────────────
      const orderTotal = doc.total as number
      const platformFee = Math.round(orderTotal * feePercentage / 100)

      if (platformFee <= 0) {
        payload.logger.info(`[Xendit] Order ${doc.orderNumber}: Fee is 0, skipping disbursement.`)
        return doc
      }

      // ── 3. Call Xendit Disbursement API ─────────────────
      const xenditSecretKey = process.env.XENDIT_SECRET_KEY
      if (!xenditSecretKey) {
        payload.logger.warn(`[Xendit] XENDIT_SECRET_KEY not set. Skipping disbursement for order ${doc.orderNumber}.`)
        return doc
      }

      const disbursementPayload = {
        external_id: `fee-${doc.orderNumber}-${Date.now()}`,
        amount: platformFee,
        bank_code: process.env.XENDIT_PLATFORM_BANK_CODE || 'BCA',
        account_holder_name: process.env.XENDIT_PLATFORM_ACCOUNT_NAME || 'FathStore Platform',
        account_number: process.env.XENDIT_PLATFORM_ACCOUNT_NUMBER || '',
        description: `Platform fee (${feePercentage}%) for order ${doc.orderNumber}`,
      }

      const response = await fetch('https://api.xendit.co/disbursements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(xenditSecretKey + ':').toString('base64')}`,
        },
        body: JSON.stringify(disbursementPayload),
      })

      const result = await response.json()

      // ── 4. Log result to paymentData ────────────────────
      const existingPaymentData = (doc.paymentData as Record<string, unknown>) || {}

      await payload.update({
        collection: 'orders',
        id: doc.id,
        data: {
          paymentData: {
            ...existingPaymentData,
            xenditDisbursement: {
              feePercentage,
              platformFee,
              disbursementId: result.id,
              status: result.status,
              createdAt: new Date().toISOString(),
              response: result,
            },
          },
        },
      })

      payload.logger.info(
        `[Xendit] Order ${doc.orderNumber}: Disbursed ${platformFee} (${feePercentage}%) → ${result.status}`
      )
    } catch (error) {
      payload.logger.error(`[Xendit] Order ${doc.orderNumber}: Disbursement failed — ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return doc
}
