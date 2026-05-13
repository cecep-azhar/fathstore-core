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
    const date = searchParams.get('date') || new Date().toISOString().slice(0, 10)

    const payload = await getPayload({ config })

    // Get shift
    const where: any = {
      openedAt: {
        greater_than_equal: `${date}T00:00:00.000Z`,
        less_than_equal: `${date}T23:59:59.999Z`,
      },
    }
    if (outletId) where.outlet = { equals: outletId }

    const shifts = await payload.find({
      collection: 'pos-shifts',
      where,
      depth: 2,
    })

    // Get all transactions for the day
    const startOfDay = `${date}T00:00:00.000Z`
    const endOfDay = `${date}T23:59:59.999Z`

    const txWhere: any = {
      createdAt: { greater_than_equal: startOfDay, less_than_equal: endOfDay },
    }
    if (outletId) txWhere.outlet = { equals: outletId }

    const transactions = await payload.find({
      collection: 'pos-transactions',
      where: txWhere,
      limit: 500,
    })

    // Calculate stats
    const stats = {
      totalTransactions: 0,
      totalSales: 0,
      totalCash: 0,
      totalQris: 0,
      totalCard: 0,
      totalDiscount: 0,
      totalTax: 0,
      averageTransaction: 0,
    }

    const productSales: Record<string, any> = {}

    for (const tx of transactions.docs) {
      if ((tx as any).status !== 'completed' && (tx as any).status !== 'voided') continue

      if ((tx as any).status === 'completed') {
        stats.totalTransactions++
        stats.totalSales += (tx as any).total || 0
        stats.totalCash += (tx as any).paymentMethod === 'cash' ? ((tx as any).cashTendered || 0) : 0
        stats.totalQris += (tx as any).paymentMethod === 'qris' ? ((tx as any).total || 0) : 0
        stats.totalCard += (tx as any).paymentMethod === 'card' ? ((tx as any).total || 0) : 0
        stats.totalDiscount += (tx as any).discountAmount || 0
        stats.totalTax += (tx as any).taxAmount || 0
      }

      // Aggregate product sales
      for (const item of (tx as any).items || []) {
        const key = (item as any).productTitle
        if (!productSales[key]) {
          productSales[key] = { name: key, quantity: 0, revenue: 0 }
        }
        productSales[key].quantity += (item as any).quantity || 0
        productSales[key].revenue += (item as any).totalPrice || 0
      }
    }

    stats.averageTransaction = stats.totalTransactions > 0
      ? Math.round(stats.totalSales / stats.totalTransactions)
      : 0

    // Sort top products
    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 20)

    return NextResponse.json({
      success: true,
      data: {
        date,
        shifts: shifts.docs,
        transactions: transactions.totalDocs,
        stats,
        topProducts,
        hourlySales: calculateHourlySales(transactions.docs),
      },
    })
  } catch (error: any) {
    console.error('[GET /api/v1/pos/reports/daily]', error)
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 })
  }
}

function calculateHourlySales(transactions: any[]): Record<number, number> {
  const hourly: Record<number, number> = {}
  for (let i = 0; i < 24; i++) hourly[i] = 0

  for (const tx of transactions) {
    if ((tx as any).status !== 'completed') continue
    const hour = new Date((tx as any).createdAt).getHours()
    hourly[hour] += (tx as any).total || 0
  }

  return hourly
}