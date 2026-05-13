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
    const { shiftId, closingCash, notes, closePhoto } = body

    const shift = await payload.findByID({
      collection: 'pos-shifts',
      id: shiftId,
    })

    if (!shift) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 })
    }

    if ((shift as any).status !== 'open') {
      return NextResponse.json({ error: 'Shift already closed' }, { status: 400 })
    }

    // Calculate expected cash
    const expectedCash = ((shift as any).openingCash || 0) + ((shift as any).totalCash || 0)
    const cashDifference = (closingCash || 0) - expectedCash

    // Get top selling products today
    const todayStart = ((shift as any).openedAt as string).slice(0, 10)
    const transactions = await payload.find({
      collection: 'pos-transactions',
      where: {
        shift: { equals: shiftId },
        status: { equals: 'completed' },
      },
      limit: 500,
    })

    // Aggregate product sales
    const productSales: Record<string, any> = {}
    for (const tx of transactions.docs) {
      for (const item of (tx as any).items || []) {
        const key = (item as any).productTitle
        if (!productSales[key]) {
          productSales[key] = { name: key, quantity: 0, revenue: 0 }
        }
        productSales[key].quantity += (item as any).quantity
        productSales[key].revenue += (item as any).totalPrice
      }
    }

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.quantity - a.quantity)
      .slice(0, 10)

    // Close the shift
    await payload.update({
      collection: 'pos-shifts',
      id: shiftId,
      data: {
        status: 'closed',
        closedAt: new Date().toISOString(),
        closedBy: user.id,
        closingNotes: notes,
        closePhoto,
        actualCash: closingCash,
        cashDifference,
        expectedCash,
        topProducts,
        paymentBreakdown: {
          cash: (shift as any).totalCash,
          qris: (shift as any).totalQris,
          card: (shift as any).totalCard,
        },
      },
    })

    // Free up the driver availability if any were used
    // (In a real app, you'd have POS-specific logic here)

    return NextResponse.json({
      success: true,
      data: {
        shiftId,
        totalTransactions: (shift as any).totalTransactions,
        totalSales: (shift as any).totalSales,
        expectedCash,
        actualCash: closingCash,
        cashDifference,
      },
      message: 'Shift closed successfully',
    })
  } catch (error: any) {
    console.error('[POST /api/v1/pos/shift/close]', error)
    return NextResponse.json({ error: 'Failed to close shift' }, { status: 500 })
  }
}