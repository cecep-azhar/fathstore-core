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
    const { transaction } = body

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction data required' }, { status: 400 })
    }

    // Check for idempotency - if posTransactionId exists, return existing
    if (transaction.posTransactionId) {
      const existing = await payload.findFirst({
        collection: 'pos-transactions',
        where: { posTransactionId: { equals: transaction.posTransactionId } },
      })

      if (existing) {
        return NextResponse.json({
          success: true,
          data: existing,
          message: 'Transaction already synced',
          duplicate: true,
        })
      }
    }

    // Create the transaction
    const result = await payload.create({
      collection: 'pos-transactions',
      data: {
        ...transaction,
        cashier: user.id,
        isSynced: true,
        syncedAt: new Date().toISOString(),
        syncSource: 'offline_sync',
      },
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Transaction synced successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/v1/pos/transactions/sync]', error)
    return NextResponse.json({ error: 'Failed to sync transaction' }, { status: 500 })
  }
}