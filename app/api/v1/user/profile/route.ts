import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

// GET /api/v1/user/profile — Get current user's profile
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
      depth: 1,
    }) as any

    if (!userDoc) {
      return NextResponse.json({ error: 'User not found', data: null }, { status: 404 })
    }

    // Strip sensitive fields
    const { password, hash, ...safeUser } = userDoc

    // Get membership summary
    let membership = null
    try {
      const memberRecord = await payload.findFirst({
        collection: 'memberships',
        where: { user: { equals: user.id } } as any,
      }) as any
      if (memberRecord) {
        membership = {
          tier: memberRecord.tier,
          activePoints: memberRecord.activePoints,
          totalPoints: memberRecord.totalPoints,
          lifetimeSpent: memberRecord.lifetimeSpent,
          totalOrders: memberRecord.totalOrders,
        }
      }
    } catch { /* no membership */ }

    return NextResponse.json({
      success: true,
      data: {
        ...safeUser,
        membership,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}

// PATCH /api/v1/user/profile — Update current user's profile
export async function PATCH(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, dateOfBirth, avatar, addresses, marketingNotes } = body

    // Fields that members can update
    const allowedFields: Record<string, unknown> = {}
    if (name !== undefined) allowedFields.name = name
    if (phone !== undefined) allowedFields.phone = phone
    if (dateOfBirth !== undefined) allowedFields.dateOfBirth = dateOfBirth
    if (avatar !== undefined) allowedFields.avatar = avatar
    if (marketingNotes !== undefined) allowedFields.marketingNotes = marketingNotes

    // Prevent role escalation
    if (body.role !== undefined && user.role !== 'admin') {
      delete body.role
    }

    const payload = await getPayload({ config }) as any

    const updated = await payload.update({
      collection: 'users',
      id: user.id,
      data: allowedFields,
    }) as any

    const { password, hash, ...safeUser } = updated

    return NextResponse.json({
      success: true,
      data: safeUser,
      message: 'Profile updated',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}