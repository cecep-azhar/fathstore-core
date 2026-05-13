import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

// GET /api/v1/referral/stats — Get user's referral statistics
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const payload = await getPayload({ config }) as any

    // Get all referrals by this user
    const referrals = await payload.find({
      collection: 'referrals',
      where: { referrer: { equals: user.id } },
      limit: 100,
      sort: '-createdAt',
    }) as any

    const referralsList = referrals.docs || []

    // Calculate stats
    const totalReferrals = referralsList.length
    const completedReferrals = referralsList.filter((r: any) => r.status === 'completed').length
    const pendingReferrals = referralsList.filter((r: any) => r.status === 'pending' || r.status === 'registered').length
    const totalEarnedPoints = referralsList.reduce((sum: number, r: any) => sum + (r.referrerBonusPoints || 0), 0)
    const totalRefereePoints = referralsList.reduce((sum: number, r: any) => sum + (r.refereeBonusPoints || 0), 0)

    // Get user's referral code
    const userDoc = await payload.findByID({
      collection: 'users',
      id: user.id,
    }) as any
    const referralCode = userDoc?.referralCode || `REF-${user.id?.substring(0, 8).toUpperCase()}`

    // Recent referrals
    const recent = referralsList.slice(0, 5).map((r: any) => ({
      refereeEmail: r.referee?.email || r.refereeEmail || 'Anonymous',
      status: r.status,
      referrerBonus: r.referrerBonusPoints,
      createdAt: r.createdAt,
    }))

    return NextResponse.json({
      success: true,
      data: {
        referralCode,
        totalReferrals,
        completedReferrals,
        pendingReferrals,
        totalEarnedPoints,
        totalRefereePoints,
        conversionRate: totalReferrals > 0 ? Math.round((completedReferrals / totalReferrals) * 100) : 0,
        recentReferrals: recent,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}

// POST /api/v1/referral/stats — Validate a referral code (check if valid)
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const body = await req.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ error: 'Referral code required', data: null }, { status: 400 })
    }

    const payload = await getPayload({ config }) as any

    // Find the referral code
    const referrals = await payload.find({
      collection: 'referrals',
      where: { referralCode: { equals: code.toUpperCase() } },
      limit: 1,
    }) as any

    if (!referrals.docs || referrals.docs.length === 0) {
      return NextResponse.json({ error: 'Invalid referral code', data: null }, { status: 404 })
    }

    const referral = referrals.docs[0] as any

    // Don't allow self-referral
    if (referral.codeGeneratedBy === user.id || referral.referrer === user.id) {
      return NextResponse.json({ error: 'Cannot use your own referral code', data: null }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        referrerId: referral.codeGeneratedBy || referral.referrer,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}