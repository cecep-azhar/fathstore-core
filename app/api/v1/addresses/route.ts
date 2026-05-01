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

    const payload = await getPayload({ config })
    const { docs, totalDocs } = await payload.find({
      collection: 'address-books',
      where: { user: { equals: user.id } },
      sort: '-createdAt',
      limit: 50,
    })

    return NextResponse.json({
      success: true,
      data: docs,
      total: totalDocs,
    })
  } catch (error: any) {
    console.error('[GET /api/v1/addresses]', error)
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()

    // If this is set as default, unset other defaults first
    if (body.isDefault) {
      await payload.updateMany({
        collection: 'address-books',
        where: { user: { equals: user.id }, isDefault: { equals: true } },
        data: { isDefault: false },
      })
    }

    const address = await payload.create({
      collection: 'address-books',
      data: {
        ...body,
        user: user.id,
      },
    })

    return NextResponse.json({ success: true, data: address }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/v1/addresses]', error)
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}