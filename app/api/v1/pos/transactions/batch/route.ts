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
    const { transactions } = body

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: 'Transactions array required' }, { status: 400 })
    }

    const results = {
      success: 0,
      duplicate: 0,
      failed: 0,
      details: [] as any[],
    }

    for (const tx of transactions) {
      try {
        // Idempotency check
        if (tx.posTransactionId) {
          const existing = await payload.findFirst({
            collection: 'pos-transactions',
            where: { posTransactionId: { equals: tx.posTransactionId } },
          })

          if (existing) {
            results.duplicate++
            results.details.push({ id: tx.posTransactionId, status: 'duplicate' })
            continue
          }
        }

        await payload.create({
          collection: 'pos-transactions',
          data: {
            ...tx,
            cashier: user.id,
            isSynced: true,
            syncedAt: new Date().toISOString(),
            syncSource: 'batch_sync',
          },
        })

        results.success++
        results.details.push({ id: tx.posTransactionId || tx.transactionId, status: 'created' })
      } catch {
        results.failed++
        results.details.push({ id: tx.posTransactionId || 'unknown', status: 'failed' })
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Batch sync complete: ${results.success} created, ${results.duplicate} duplicates, ${results.failed} failed`,
    })
  } catch (error: any) {
    console.error('[POST /api/v1/pos/transactions/batch]', error)
    return NextResponse.json({ error: 'Failed to batch sync' }, { status: 500 })
  }
}