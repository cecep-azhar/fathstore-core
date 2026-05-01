import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Find wishlist item
    const wishlist = await payload.findByID({
      collection: 'wishlists',
      id,
    })

    if (!wishlist) {
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 })
    }

    // Check ownership
    if ((wishlist as any).user !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await payload.delete({
      collection: 'wishlists',
      id,
    })

    return NextResponse.json({ success: true, message: 'Removed from wishlist' })
  } catch (error: any) {
    console.error('[DELETE /api/v1/wishlist/[id]]', error)
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 })
  }
}