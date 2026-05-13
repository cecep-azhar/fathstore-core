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
    const query = searchParams.get('q') || searchParams.get('phone') || searchParams.get('email')

    if (!query || query.length < 3) {
      return NextResponse.json({ error: 'Search query too short (min 3 characters)' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Try to find by phone first
    let member = await payload.findFirst({
      collection: 'users',
      where: {
        phone: { equals: query },
        role: { equals: 'member' },
      },
    })

    // If not found, try email
    if (!member) {
      member = await payload.findFirst({
        collection: 'users',
        where: {
          email: { equals: query },
          role: { equals: 'member' },
        },
      })
    }

    if (!member) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Member not found',
      })
    }

    // Get membership
    const membership = await payload.findFirst({
      collection: 'memberships',
      where: { user: { equals: (member as any).id } },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: (member as any).id,
        name: (member as any).name,
        email: (member as any).email,
        phone: (member as any).phone,
        membership: membership ? {
          tier: (membership as any).tier,
          activePoints: (membership as any).activePoints,
          totalPoints: (membership as any).totalPoints,
        } : null,
      },
    })
  } catch (error: any) {
    console.error('[GET /api/v1/pos/member/lookup]', error)
    return NextResponse.json({ error: 'Failed to lookup member' }, { status: 500 })
  }
}