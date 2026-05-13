/**
 * FathStore Loyalty Engine
 * Reads program config from database, respects tier multipliers,
 * handles points calculation, expiry, and earning rules.
 */

import { getPayload } from 'payload'
import config from '@payload-config'

// ── Types ────────────────────────────────────────────────────

interface LoyaltyProgram {
  id: string
  name: string
  isActive: boolean
  pointsPerCurrency: number   // e.g., 1 point per 1 SGD
  redemptionRate: number     // e.g., 100 points = 1 SGD
  minimumRedemption: number
  maxPointsPerOrder: number
  pointsExpiryMonths: number
  tiers?: LoyaltyTier[]
}

interface LoyaltyTier {
  name: string
  slug: string
  minimumPoints: number
  multiplier: number
  discount: number
  benefits: string
  color: string
}

interface MembershipRecord {
  id: string
  user: string
  tenant: string
  tier: string
  totalPoints: number
  activePoints: number
}

// ── Core Engine Functions ───────────────────────────────────

/** Get active loyalty program for a tenant */
export async function getActiveProgram(tenantId: string): Promise<LoyaltyProgram | null> {
  const payload = await getPayload({ config })
  const program = await payload.findFirst({
    collection: 'loyaltyPrograms',
    where: {
      isActive: { equals: true },
    },
  })
  return program as LoyaltyProgram | null
}

/** Get user's membership record */
export async function getMembership(userId: string, tenantId: string): Promise<MembershipRecord | null> {
  const payload = await getPayload({ config })
  const membership = await payload.findFirst({
    collection: 'memberships',
    where: {
      user: { equals: userId },
      tenant: { equals: tenantId },
    },
  })
  return membership as MembershipRecord | null
}

/** Get user's tier from membership */
export async function getUserTier(membership: MembershipRecord | null): Promise<LoyaltyTier | null> {
  if (!membership?.tier) return null

  // Try to get tier from program
  const program = await getActiveProgram(membership.tenant)
  if (!program?.tiers) return null

  return program.tiers.find(t => t.slug === membership.tier.toLowerCase()) || null
}

// ── Points Calculation ──────────────────────────────────────

/**
 * Calculate check-in points based on program config + tier multiplier
 */
export async function calculateCheckInPoints(
  userId: string,
  tenantId: string
): Promise<{ points: number; multiplier: number; expiresAt: string | null }> {
  const program = await getActiveProgram(tenantId)
  const membership = await getMembership(userId, tenantId)
  const tier = await getUserTier(membership)

  const basePoints = program?.pointsPerCurrency || 10  // Default 10 if no program
  const multiplier = tier?.multiplier || 1
  const earnedPoints = Math.floor(basePoints * multiplier)

  // Calculate expiry
  let expiresAt: string | null = null
  if (program && program.pointsExpiryMonths > 0) {
    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + program.pointsExpiryMonths)
    expiresAt = expiryDate.toISOString()
  }

  return { points: earnedPoints, multiplier, expiresAt }
}

/**
 * Calculate points earned from a purchase/order
 */
export async function calculatePurchasePoints(
  amount: number,
  currency: string,
  tenantId: string,
  userId: string
): Promise<{ earnedPoints: number; multiplier: number; tierName: string }> {
  const program = await getActiveProgram(tenantId)
  const membership = await getMembership(userId, tenantId)
  const tier = await getUserTier(membership)

  if (!program) {
    return { earnedPoints: 0, multiplier: 1, tierName: 'none' }
  }

  // Points per currency unit
  const pointsPerUnit = program.pointsPerCurrency

  // Normalize amount based on currency (assume 1 currency = 1 unit)
  // Could add exchange rate logic here
  const rawPoints = (amount / 1) * pointsPerUnit
  const multiplier = tier?.multiplier || 1
  const earnedPoints = Math.floor(rawPoints * multiplier)

  return {
    earnedPoints,
    multiplier,
    tierName: tier?.name || membership?.tier || 'bronze',
  }
}

/**
 * Calculate redemption value
 */
export async function calculateRedemptionValue(
  points: number,
  tenantId: string
): Promise<{ value: number; withinMinimum: boolean; withinMaxOrder: boolean }> {
  const program = await getActiveProgram(tenantId)
  if (!program) {
    return { value: 0, withinMinimum: false, withinMaxOrder: false }
  }

  const value = Math.floor(points / program.redemptionRate)
  const withinMinimum = points >= program.minimumRedemption
  const withinMaxOrder =
    program.maxPointsPerOrder === 0 || points <= program.maxPointsPerOrder

  return { value, withinMinimum, withinMaxOrder }
}

// ── Points Operations ────────────────────────────────────────

/**
 * Award check-in points to user
 */
export async function awardCheckInPoints(
  userId: string,
  tenantId: string,
  description?: string
): Promise<{ pointsAwarded: number; expiresAt: string | null }> {
  const payload = await getPayload({ config })

  const { points, multiplier, expiresAt } = await calculateCheckInPoints(userId, tenantId)

  // Create loyalty points transaction
  await payload.create({
    collection: 'loyalty-points',
    data: {
      user: userId,
      tenant: tenantId,
      points,
      type: 'earn_bonus',  // check-in is a bonus earn type
      description: description || `Daily check-in reward (${multiplier}x multiplier)`,
      expiresAt,
    },
  })

  // Update membership total and active points
  const membership = await getMembership(userId, tenantId)
  if (membership) {
    await payload.update({
      collection: 'memberships',
      id: membership.id,
      data: {
        totalPoints: membership.totalPoints + points,
        activePoints: membership.activePoints + points,
      },
    })
  }

  return { pointsAwarded: points, expiresAt }
}

/**
 * Award purchase points to user
 */
export async function awardPurchasePoints(
  userId: string,
  tenantId: string,
  orderId: string,
  amount: number
): Promise<{ pointsAwarded: number; tierName: string }> {
  const payload = await getPayload({ config })

  const { earnedPoints, multiplier, tierName } = await calculatePurchasePoints(
    amount,
    'IDR',
    tenantId,
    userId
  )

  if (earnedPoints <= 0) {
    return { pointsAwarded: 0, tierName }
  }

  // Create loyalty points transaction
  await payload.create({
    collection: 'loyalty-points',
    data: {
      user: userId,
      tenant: tenantId,
      points: earnedPoints,
      type: 'earn_purchase',
      description: `Purchase reward (${multiplier}x ${tierName} tier)`,
      order: orderId,
    },
  })

  // Update membership
  const membership = await getMembership(userId, tenantId)
  if (membership) {
    await payload.update({
      collection: 'memberships',
      id: membership.id,
      data: {
        totalPoints: membership.totalPoints + earnedPoints,
        activePoints: membership.activePoints + earnedPoints,
        lifetimeSpent: ((membership as any).lifetimeSpent || 0) + amount,
        totalOrders: ((membership as any).totalOrders || 0) + 1,
      },
    })

    // Check for tier upgrade
    await checkAndUpgradeTier(membership.id, tenantId)
  }

  return { pointsAwarded: earnedPoints, tierName }
}

/**
 * Redeem points from user
 */
export async function redeemPoints(
  userId: string,
  tenantId: string,
  points: number,
  orderId?: string
): Promise<{ success: boolean; value: number; remainingPoints: number; error?: string }> {
  const payload = await getPayload({ config })
  const program = await getActiveProgram(tenantId)
  const membership = await getMembership(userId, tenantId)

  if (!membership) {
    return { success: false, value: 0, remainingPoints: 0, error: 'No membership found' }
  }

  if (membership.activePoints < points) {
    return {
      success: false,
      value: 0,
      remainingPoints: membership.activePoints,
      error: `Insufficient points. You have ${membership.activePoints} points available.`
    }
  }

  // Check minimum redemption
  if (program && points < program.minimumRedemption) {
    return {
      success: false,
      value: 0,
      remainingPoints: membership.activePoints,
      error: `Minimum ${program.minimumRedemption} points required to redeem.`
    }
  }

  // Check max per order
  if (program && program.maxPointsPerOrder > 0 && points > program.maxPointsPerOrder) {
    return {
      success: false,
      value: 0,
      remainingPoints: membership.activePoints,
      error: `Maximum ${program.maxPointsPerOrder} points per order.`
    }
  }

  const { value } = await calculateRedemptionValue(points, tenantId)

  // Create redemption transaction
  await payload.create({
    collection: 'loyalty-points',
    data: {
      user: userId,
      tenant: tenantId,
      points: -points,
      type: 'redeem',
      description: `Redeem ${points} points for Rp ${value.toLocaleString('id-ID')}`,
      order: orderId || null,
    },
  })

  // Update membership
  await payload.update({
    collection: 'memberships',
    id: membership.id,
    data: {
      activePoints: membership.activePoints - points,
    },
  })

  return {
    success: true,
    value,
    remainingPoints: membership.activePoints - points
  }
}

// ── Tier Management ──────────────────────────────────────────

/**
 * Check and upgrade tier if threshold reached
 */
export async function checkAndUpgradeTier(
  membershipId: string,
  tenantId: string
): Promise<{ upgraded: boolean; newTier?: string }> {
  const payload = await getPayload({ config })
  const program = await getActiveProgram(tenantId)

  if (!program?.tiers || program.tiers.length === 0) {
    return { upgraded: false }
  }

  const membership = await payload.findByID({
    collection: 'memberships',
    id: membershipId,
  }) as MembershipRecord

  const currentTierIndex = program.tiers.findIndex(
    t => t.slug === membership.tier.toLowerCase()
  )

  for (let i = program.tiers.length - 1; i > currentTierIndex; i--) {
    const nextTier = program.tiers[i]
    if (membership.totalPoints >= nextTier.minimumPoints) {
      await payload.update({
        collection: 'memberships',
        id: membershipId,
        data: {
          tier: nextTier.slug,
          tierAchievedAt: new Date().toISOString(),
        },
      })
      return { upgraded: true, newTier: nextTier.name }
    }
  }

  return { upgraded: false }
}

// ── Expiry Handler ───────────────────────────────────────────

/**
 * Process expired points (run via cron/scheduled task)
 */
export async function processExpiredPoints(): Promise<{
  processed: number;
  expiredPoints: number;
}> {
  const payload = await getPayload({ config })
  const now = new Date().toISOString()

  // Find all expired loyalty points records
  const expiredRecords = await payload.find({
    collection: 'loyalty-points',
    where: {
      and: [
        { expiresAt: { less_than: now } },
        { isExpired: { equals: false } },
        { points: { greater_than: 0 } },
      ],
    },
    limit: 100,
  })

  let totalExpired = 0

  for (const record of expiredRecords.docs) {
    const typedRecord = record as any

    // Create expiry record
    await payload.create({
      collection: 'loyalty-points',
      data: {
        user: typedRecord.user,
        tenant: typedRecord.tenant,
        points: -typedRecord.points,
        type: 'expire',
        description: `Points expired (${typedRecord.points} pts)`,
      },
    })

    // Update membership active points
    const membership = await payload.findFirst({
      collection: 'memberships',
      where: {
        user: { equals: typedRecord.user },
        tenant: { equals: typedRecord.tenant },
      },
    })

    if (membership) {
      await payload.update({
        collection: 'memberships',
        id: (membership as any).id,
        data: {
          activePoints: Math.max(0, (membership as any).activePoints - typedRecord.points),
        },
      })
    }

    // Mark original as expired
    await payload.update({
      collection: 'loyalty-points',
      id: typedRecord.id,
      data: { isExpired: true },
    })

    totalExpired += typedRecord.points
  }

  return { processed: expiredRecords.docs.length, expiredPoints: totalExpired }
}