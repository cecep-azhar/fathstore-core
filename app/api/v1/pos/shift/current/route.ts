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
    const outletId = searchParams.get('outletId')
    const cashierId = searchParams.get('cashierId') || (user.id as string)

    const payload = await getPayload({ config })

    const where: any = { status: { equals: 'open' } }
    if (outletId) where.outlet = { equals: outletId }
    if (cashierId) where.cashier = { equals: cashierId }

    const shift = await payload.findFirst({
      collection: 'pos-shifts',
      where,
      depth: 2,
    })

    if (!shift) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No open shift found',
      })
    }

    // Get today's transactions for this shift
    const transactions = await payload.find({
      collection: 'pos-transactions',
      where: {
        shift: { equals: (shift as any).id },
        status: { equals: 'completed' },
      },
      limit: 0,
    })

    return NextResponse.json({
      success: true,
      data: {
        ...shift,
        transactionCount: transactions.totalDocs,
        transactionTotal: transactions.totalDocs,
      },
    })
  } catch (error: any) {
    console.error('[GET /api/v1/pos/shift/current]', error)
    return NextResponse.json({ error: 'Failed to fetch current shift' }, { status: 500 })
  }
}