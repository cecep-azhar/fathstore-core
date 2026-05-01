import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const GET = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const tenantSlug = searchParams.get('tenantSlug') || 'default'

    const payload = await getPayload({ config })

    // Get tenant
    const tenant = await payload.findFirst({
      collection: 'tenants',
      where: { slug: { equals: tenantSlug } },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Get membership
    const membership = await payload.findFirst({
      collection: 'memberships',
      where: {
        user: { equals: user.id },
        tenant: { equals: tenant.id },
      },
    })

    if (!membership) {
      return NextResponse.json({
        success: true,
        data: {
          tier: 'bronze',
          totalPoints: 0,
          activePoints: 0,
          lifetimeSpent: 0,
          totalOrders: 0,
          nextTierAt: 5000,
          nextTier: 'silver',
        },
      })
    }

    // Get tenant tier thresholds
    const tierThresholds = (tenant as any).memberConfig?.tierThresholds || {
      silver: 5000,
      gold: 20000,
      platinum: 50000,
    }

    // Calculate next tier
    const tiers = ['bronze', 'silver', 'gold', 'platinum']
    const currentTierIndex = tiers.indexOf(membership.tier)
    let nextTier = null
    let pointsToNext = 0

    if (currentTierIndex < tiers.length - 1) {
      const nextTierName = tiers[currentTierIndex + 1]
      nextTier = nextTierName
      const nextThreshold = tierThresholds[nextTierName] || 0
      pointsToNext = Math.max(0, nextThreshold - membership.totalPoints)
    }

    return NextResponse.json({
      success: true,
      data: {
        tier: membership.tier,
        totalPoints: membership.totalPoints,
        activePoints: membership.activePoints,
        lifetimeSpent: membership.lifetimeSpent || 0,
        totalOrders: membership.totalOrders || 0,
        totalReferrals: membership.totalReferrals || 0,
        joinedAt: membership.joinedAt,
        tierAchievedAt: membership.tierAchievedAt,
        nextTier,
        pointsToNext,
        benefits: membership.benefits || {},
      },
    })
  } catch (error: any) {
    console.error('[GET /api/v1/loyalty/points]', error)
    return NextResponse.json({ error: 'Failed to fetch loyalty points' }, { status: 500 })
  }
}