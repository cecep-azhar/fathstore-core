import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const PUT = async (
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
    const body = await req.json()

    const table = await payload.update({
      collection: 'pos-tables',
      id,
      data: body,
    })

    return NextResponse.json({ success: true, data: table })
  } catch (error: any) {
    console.error('[PUT /api/v1/pos/tables/[id]]', error)
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 })
  }
}

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const user = getAuthUser(req)
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const payload = await getPayload({ config })
    await payload.delete({
      collection: 'pos-tables',
      id,
    })

    return NextResponse.json({ success: true, message: 'Table deleted' })
  } catch (error: any) {
    console.error('[DELETE /api/v1/pos/tables/[id]]', error)
    return NextResponse.json({ error: 'Failed to delete table' }, { status: 500 })
  }
}