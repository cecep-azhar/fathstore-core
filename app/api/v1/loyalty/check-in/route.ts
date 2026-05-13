import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth-helpers'
import { awardCheckInPoints } from '@/lib/loyalty-engine'
import { resolveTenant } from '@/lib/tenant-resolver'
import { getPayload } from 'payload'
import config from '@payload-config'

// POST /api/v1/loyalty/check-in — Daily check-in with deduplication
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const body = await req.json()
    const tenantSlug = body.tenantSlug || 'default'

    // Resolve tenant slug → tenant ID
    const tenant = await resolveTenant(tenantSlug)
    const tenantId = tenant?.id || tenantSlug || 'default'

    // ── Daily deduplication check ─────────────────────────────────
    const payload = await getPayload({ config }) as any
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

    const existingCheckIn = await payload.find({
      collection: 'loyalty-points',
      where: {
        and: [
          { user: { equals: user.id } },
          { type: { equals: 'earn_bonus' } },
          { createdAt: { greater_than: today } },
          { createdAt: { less_than: tomorrow } },
          tenantId !== 'default' ? { tenant: { equals: tenantId } } : {},
        ].filter(Boolean),
      } as any,
      limit: 1,
    })

    if (existingCheckIn.docs && existingCheckIn.docs.length > 0) {
      return NextResponse.json(
        { error: 'Already checked in today', data: null },
        { status: 409 }
      )
    }

    // ── Award points ───────────────────────────────────────────
    const result = await awardCheckInPoints(user.id, tenantId)

    return NextResponse.json({
      success: true,
      data: {
        pointsEarned: result.pointsAwarded,
        expiresAt: result.expiresAt,
        tenant: tenant?.name || tenantSlug,
        message: result.pointsAwarded > 0
          ? `Check-in successful! You earned ${result.pointsAwarded} points.`
          : 'No points earned — check your loyalty program config.',
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}

// GET /api/v1/loyalty/check-in — Check-in status (streak, last check-in)
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const tenantSlug = searchParams.get('tenantSlug') || 'default'

    const tenant = await resolveTenant(tenantSlug)
    const tenantId = tenant?.id || tenantSlug || 'default'
    const payload = await getPayload({ config }) as any

    // Get today's check-in
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

    const todayCheckIn = await payload.find({
      collection: 'loyalty-points',
      where: {
        and: [
          { user: { equals: user.id } },
          { type: { equals: 'earn_bonus' } },
          { createdAt: { greater_than: today } },
          { createdAt: { less_than: tomorrow } },
        ].filter(Boolean),
      } as any,
      limit: 1,
    })

    const checkedInToday = (todayCheckIn.docs?.length || 0) > 0

    // Calculate streak (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()
    const recentCheckIns = await payload.find({
      collection: 'loyalty-points',
      where: {
        and: [
          { user: { equals: user.id } },
          { type: { equals: 'earn_bonus' } },
          { createdAt: { greater_than: thirtyDaysAgo } },
        ].filter(Boolean),
      } as any,
      sort: '-createdAt',
      limit: 30,
    })

    // Calculate consecutive streak
    let streak = 0
    if (recentCheckIns.docs && recentCheckIns.docs.length > 0) {
      const checkInDates = new Set(
        recentCheckIns.docs.map((d: any) =>
          new Date(d.createdAt).toISOString().split('T')[0]
        )
      )

      let currentDate = new Date()
      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0]
        if (checkInDates.has(dateStr)) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        } else if (streak === 0 && dateStr === today) {
          // Today not checked in yet — don't break streak calculation
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          break
        }
        // Safety: max 365 days
        if (streak > 365) break
      }
    }

    // Get total active points
    let activePoints = 0
    try {
      const membership = await payload.findFirst({
        collection: 'memberships',
        where: { user: { equals: user.id } } as any,
      }) as any
      activePoints = membership?.activePoints || 0
    } catch { /* no membership yet */ }

    return NextResponse.json({
      success: true,
      data: {
        checkedInToday,
        streak,
        activePoints,
        tenant: tenant?.name || tenantSlug,
        nextCheckIn: checkedInToday ? null : `Tomorrow at 00:00`,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}