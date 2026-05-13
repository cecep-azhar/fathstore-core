import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const POST = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()
    const { outletId, openingCash, notes } = body

    // Check if there's already an open shift
    const existingShift = await payload.findFirst({
      collection: 'pos-shifts',
      where: {
        outlet: { equals: outletId },
        status: { equals: 'open' },
      },
    })

    if (existingShift) {
      return NextResponse.json({
        error: 'Shift already open',
        data: existingShift,
        message: 'Close the current shift before opening a new one',
      }, { status: 400 })
    }

    // Generate shift ID
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')

    const shift = await payload.create({
      collection: 'pos-shifts',
      data: {
        shiftId: `SHIFT-${date}-${random}`,
        outlet: outletId,
        cashier: user.id,
        status: 'open',
        openedAt: new Date().toISOString(),
        openingCash: openingCash || 0,
        openingNotes: notes,
        totalTransactions: 0,
        totalSales: 0,
        totalCash: 0,
        totalQris: 0,
        totalCard: 0,
        totalDiscount: 0,
        totalTax: 0,
        totalServiceCharge: 0,
      },
    })

    return NextResponse.json({
      success: true,
      data: shift,
      message: 'Shift opened successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/v1/pos/shift/open]', error)
    return NextResponse.json({ error: 'Failed to open shift' }, { status: 500 })
  }
}