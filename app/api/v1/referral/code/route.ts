import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

// GET /api/v1/referral/code — Get user's referral code
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const payload = await getPayload({ config }) as any
    const userDoc = await payload.findByID({
      collection: 'users',
      id: user.id,
    }) as any

    const referralCode = userDoc?.referralCode || `REF-${user.id?.substring(0, 8).toUpperCase()}`

    return NextResponse.json({ success: true, data: { code: referralCode } })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}

// POST /api/v1/referral/code — Create/generate user's referral code
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const customCode = body.code

    const payload = await getPayload({ config }) as any

    // Check if code already exists
    if (customCode) {
      const existing = await payload.find({
        collection: 'referrals',
        where: { referralCode: { equals: customCode } },
        limit: 1,
      }) as any

      if (existing.docs?.length > 0) {
        return NextResponse.json(
          { error: 'Referral code already taken', data: null },
          { status: 409 }
        )
      }
    }

    // Generate code
    const referralCode = customCode || `REF-${user.id?.substring(0, 8).toUpperCase()}`

    // Save to user
    await payload.update({
      collection: 'users',
      id: user.id,
      data: { referralCode } as any,
    })

    return NextResponse.json({
      success: true,
      data: { code: referralCode },
      message: 'Referral code created',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}