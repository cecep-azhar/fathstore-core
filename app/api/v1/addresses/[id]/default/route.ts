import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

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

    await payload.updateMany({
      collection: 'address-books',
      where: { user: { equals: user.id }, isDefault: { equals: true } },
      data: { isDefault: false },
    })

    const updated = await payload.update({
      collection: 'address-books',
      id,
      data: { isDefault: true },
    })

    return NextResponse.json({
      success: true,
      message: 'Address set as default',
      data: updated,
    })
  } catch (error: any) {
    console.error('[PUT /api/v1/addresses/:id/default]', error)
    return NextResponse.json({ error: 'Failed to set default address' }, { status: 500 })
  }
}