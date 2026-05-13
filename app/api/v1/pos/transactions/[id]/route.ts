import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const GET = async (
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
    const transaction = await payload.findByID({
      collection: 'pos-transactions',
      id,
      depth: 3,
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: transaction })
  } catch (error: any) {
    console.error('[GET /api/v1/pos/transactions/[id]]', error)
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 })
  }
}