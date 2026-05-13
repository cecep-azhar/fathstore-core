import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const address = await payload.findByID({
      collection: 'address-books',
      id,
    })

    if (user.role !== 'admin' && address.user !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ success: true, data: address })
  } catch (error: any) {
    console.error('[GET /api/v1/addresses/:id]', error)
    return NextResponse.json({ error: 'Address not found' }, { status: 404 })
  }
}

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const existing = await payload.findByID({
      collection: 'address-books',
      id,
    })

    if (user.role !== 'admin' && existing.user !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()

    if (body.isDefault) {
      await payload.updateMany({
        collection: 'address-books',
        where: { user: { equals: user.id }, isDefault: { equals: true }, id: { not_in: [id] } },
        data: { isDefault: false },
      })
    }

    const updated = await payload.update({
      collection: 'address-books',
      id,
      data: body,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    console.error('[PUT /api/v1/addresses/:id]', error)
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}

export const PATCH = PUT

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const existing = await payload.findByID({
      collection: 'address-books',
      id,
    })

    if (user.role !== 'admin' && existing.user !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await payload.delete({
      collection: 'address-books',
      id,
    })

    return NextResponse.json({ success: true, message: 'Address deleted' })
  } catch (error: any) {
    console.error('[DELETE /api/v1/addresses/:id]', error)
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}