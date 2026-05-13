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

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Admin access required for refund' }, { status: 403 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()
    const { amount, reason } = body

    const transaction = await payload.findByID({
      collection: 'pos-transactions',
      id,
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    if ((transaction as any).status === 'refunded') {
      return NextResponse.json({ error: 'Transaction already refunded' }, { status: 400 })
    }

    const refundAmount = amount || (transaction as any).total

    // Update transaction as refunded
    await payload.update({
      collection: 'pos-transactions',
      id,
      data: {
        status: 'refunded',
        refundedAt: new Date().toISOString(),
        refundedBy: user.id,
        refundReason: reason || 'No reason provided',
        refundAmount,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Refund of Rp ${refundAmount.toLocaleString('id-ID')} processed`,
    })
  } catch (error: any) {
    console.error('[POST /api/v1/pos/transactions/[id]/refund]', error)
    return NextResponse.json({ error: 'Failed to refund transaction' }, { status: 500 })
  }
}