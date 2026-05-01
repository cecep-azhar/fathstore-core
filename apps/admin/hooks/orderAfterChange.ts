import type { CollectionAfterChangeHook } from 'payload'

/**
 * Order afterChange Hook
 *
 * Triggers:
 * 1. Xendit 1% Split-Payment — when order becomes "paid"
 * 2. Auto-Earn Loyalty Points — when fulfillmentStatus becomes "completed"
 */
export const orderAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const payload = req.payload

  // ── 1. Xendit Disbursement on Payment ────────────────────
  if (operation === 'update' && doc.paymentStatus === 'paid' && previousDoc?.paymentStatus !== 'paid') {
    await handleXenditDisbursement(doc, payload)
  }

  // ── 2. Auto-Earn Loyalty Points on Delivery ─────────────
  if (
    operation === 'update' &&
    doc.fulfillmentStatus === 'completed' &&
    previousDoc?.fulfillmentStatus !== 'completed'
  ) {
    await handleLoyaltyEarn(doc, payload)
  }

  return doc
}

async function handleXenditDisbursement(doc: any, payload: any) {
  try {
    let feePercentage = 1
    const orderTotal = doc.total as number
    const platformFee = Math.round(orderTotal * feePercentage / 100)

    if (platformFee <= 0) {
      payload.logger.info(`[Xendit] Order ${doc.orderNumber}: Fee is 0, skipping.`)
      return
    }

    const xenditSecretKey = process.env.XENDIT_SECRET_KEY
    if (!xenditSecretKey) {
      payload.logger.warn(`[Xendit] XENDIT_SECRET_KEY not set. Skipping for order ${doc.orderNumber}.`)
      return
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
          },
        },
      },
    })

    payload.logger.info(`[Xendit] Order ${doc.orderNumber}: Disbursed ${platformFee} → ${result.status}`)
  } catch (error) {
    payload.logger.error(`[Xendit] Order ${doc.orderNumber}: Failed — ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function handleLoyaltyEarn(doc: any, payload: any) {
  try {
    // Get tenant from the order or first tenant
    let tenant: any = null

    // Try to find tenant from vendor/product if available
    if (doc.vendor) {
      tenant = await payload.findByID({
        collection: 'tenants',
        id: doc.vendor,
      })
    }

    // Fallback to first tenant if not found
    if (!tenant) {
      const tenants = await payload.find({
        collection: 'tenants',
        limit: 1,
      })
      tenant = tenants.docs[0]
    }

    if (!tenant) {
      payload.logger.warn(`[Loyalty] Order ${doc.orderNumber}: No tenant found, skipping.`)
      return
    }

    // Check if loyalty is enabled
    const memberConfig = (tenant as any).memberConfig
    if (!memberConfig?.loyaltyEnabled) {
      payload.logger.info(`[Loyalty] Order ${doc.orderNumber}: Loyalty disabled for tenant ${tenant.slug}`)
      return
    }

    // Calculate points: total / pointsPerRupiah
    const pointsPerRupiah = memberConfig.pointsPerRupiah || 1000
    const points = Math.floor((doc.total as number) / pointsPerRupiah)

    if (points <= 0) {
      payload.logger.info(`[Loyalty] Order ${doc.orderNumber}: Order total too low for points (${points} points)`)
      return
    }

    // Get customer
    const customerId = doc.customer
    if (!customerId) {
      payload.logger.warn(`[Loyalty] Order ${doc.orderNumber}: No customer, skipping.`)
      return
    }

    // Get or create membership
    let membership = await payload.findFirst({
      collection: 'memberships',
      where: {
        user: { equals: customerId },
        tenant: { equals: tenant.id },
      },
    })

    if (!membership) {
      // Create membership
      membership = await payload.create({
        collection: 'memberships',
        data: {
          user: customerId,
          tenant: tenant.id,
          tier: 'bronze',
          totalPoints: 0,
          activePoints: 0,
          joinedAt: new Date().toISOString(),
        },
      })
    }

    // Create loyalty points transaction
    const description = `Pembelian Order #${doc.orderNumber}`
    await payload.create({
      collection: 'loyalty-points',
      data: {
        user: customerId,
        tenant: tenant.id,
        points,
        type: 'earn',
        description,
        order: doc.id,
      },
    })

    // Update membership
    const newTotalPoints = (membership as any).totalPoints + points
    const newActivePoints = (membership as any).activePoints + points

    // Check tier upgrade
    const tierThresholds = memberConfig.tierThresholds || { silver: 5000, gold: 20000, platinum: 50000 }
    let newTier = (membership as any).tier

    if (newTotalPoints >= (tierThresholds.platinum as number)) {
      newTier = 'platinum'
    } else if (newTotalPoints >= (tierThresholds.gold as number)) {
      newTier = 'gold'
    } else if (newTotalPoints >= (tierThresholds.silver as number)) {
      newTier = 'silver'
    }

    await payload.update({
      collection: 'memberships',
      id: (membership as any).id,
      data: {
        totalPoints: newTotalPoints,
        activePoints: newActivePoints,
        tier: newTier,
        tierAchievedAt: newTier !== (membership as any).tier ? new Date().toISOString() : (membership as any).tierAchievedAt,
        lifetimeSpent: ((membership as any).lifetimeSpent || 0) + (doc.total as number),
        totalOrders: ((membership as any).totalOrders || 0) + 1,
      },
    })

    // Update order with loyalty points earned
    await payload.update({
      collection: 'orders',
      id: doc.id,
      data: {
        loyaltyPointsEarned: points,
      },
    })

    // Create notification for customer
    await payload.create({
      collection: 'notifications',
      data: {
        user: customerId,
        tenant: tenant.id,
        type: 'loyalty',
        title: '🎉 Poin Loyalitas Diperoleh!',
        body: `Selamat! Anda mendapat ${points} poin dari pembelian Order #${doc.orderNumber}. Total poin: ${newTotalPoints}`,
        actionLabel: 'Lihat Detail',
        channels: 'in_app',
      },
    })

    payload.logger.info(
      `[Loyalty] Order ${doc.orderNumber}: +${points} points to user ${customerId}. Total: ${newTotalPoints}, Tier: ${newTier}`
    )
  } catch (error) {
    payload.logger.error(`[Loyalty] Order ${doc.orderNumber}: Failed — ${error instanceof Error ? error.message : String(error)}`)
  }
}
