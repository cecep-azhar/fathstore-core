import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const POST = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()
    const { points, tenantSlug, orderId } = body

    if (!points || points <= 0) {
      return NextResponse.json({ error: 'Points must be greater than 0' }, { status: 400 })
    }

    // Get tenant
    const tenant = tenantSlug ? await payload.findFirst({
      collection: 'tenants',
      where: { slug: { equals: tenantSlug } },
    }) : null

    if (!tenant && tenantSlug) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Get membership
    const membership = tenant ? await payload.findFirst({
      collection: 'memberships',
      where: {
        user: { equals: user.id },
        tenant: { equals: (tenant as any).id },
      },
    }) : null

    if (!membership) {
      return NextResponse.json({ error: 'Membership not found' }, { status: 404 })
    }

    // Check if user has enough points
    if ((membership as any).activePoints < points) {
      return NextResponse.json({
        error: 'Insufficient points',
        available: (membership as any).activePoints,
      }, { status: 400 })
    }

    // Check max points per order
    const maxPointsPerOrder = (tenant as any).memberConfig?.maxPointsPerOrder || 0
    if (maxPointsPerOrder > 0 && points > maxPointsPerOrder) {
      return NextResponse.json({
        error: `Maximum ${maxPointsPerOrder} points can be redeemed per order`,
      }, { status: 400 })
    }

    // Calculate redemption value
    const redeemRate = (tenant as any).memberConfig?.redeemRate || 100
    const value = Math.floor(points / redeemRate)

    // Create loyalty points transaction
    await payload.create({
      collection: 'loyalty-points',
      data: {
        user: user.id,
        tenant: (tenant as any).id,
        points: -points, // Negative for redemption
        type: 'redeem',
        description: `Redeem ${points} points for Rp ${value.toLocaleString('id-ID')}`,
        order: orderId || null,
      },
    })

    // Update membership active points
    await payload.update({
      collection: 'memberships',
      id: (membership as any).id,
      data: {
        activePoints: (membership as any).activePoints - points,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        pointsRedeemed: points,
        value,
        remainingPoints: (membership as any).activePoints - points,
      },
    })
  } catch (error: any) {
    console.error('[POST /api/v1/loyalty/redeem]', error)
    return NextResponse.json({ error: 'Failed to redeem points' }, { status: 500 })
  }
}