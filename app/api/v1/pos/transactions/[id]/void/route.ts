import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin or manager can void
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Admin access required for void' }, { status: 403 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()
    const { reason, supervisorId } = body

    const transaction = await payload.findByID({
      collection: 'pos-transactions',
      id,
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    if ((transaction as any).status === 'voided') {
      return NextResponse.json({ error: 'Transaction already voided' }, { status: 400 })
    }

    // Void the transaction
    await payload.update({
      collection: 'pos-transactions',
      id,
      data: {
        status: 'voided',
        voidedAt: new Date().toISOString(),
        voidedBy: user.id,
        voidReason: reason || 'No reason provided',
      },
    })

    // If linked order exists, update it too
    if ((transaction as any).linkedOrder) {
      await payload.update({
        collection: 'orders',
        id: (transaction as any).linkedOrder,
        data: { paymentStatus: 'failed', fulfillmentStatus: 'cancelled' },
      })
    }

    // Update shift stats
    if ((transaction as any).shift) {
      const shift = await payload.findByID({
        collection: 'pos-shifts',
        id: (transaction as any).shift,
      })

      if (shift) {
        const updateData: any = {
          totalTransactions: Math.max(0, ((shift as any).totalTransactions || 1) - 1),
          totalSales: Math.max(0, ((shift as any).totalSales || 0) - ((transaction as any).total || 0)),
        }

        const paymentMethod = (transaction as any).paymentMethod
        if (paymentMethod === 'cash') {
          updateData.totalCash = Math.max(0, ((shift as any).totalCash || 0) - ((transaction as any).cashTendered || 0))
        }

        await payload.update({
          collection: 'pos-shifts',
          id: (transaction as any).shift,
          data: updateData,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction voided successfully',
    })
  } catch (error: any) {
    console.error('[POST /api/v1/pos/transactions/[id]/void]', error)
    return NextResponse.json({ error: 'Failed to void transaction' }, { status: 500 })
  }
}