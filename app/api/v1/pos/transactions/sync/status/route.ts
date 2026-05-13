import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth-helpers'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/v1/pos/transactions/sync/status — Monitor sync status
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const payload = await getPayload({ config }) as any

    const { searchParams } = new URL(req.url)
    const outletId = searchParams.get('outletId')
    const shiftId = searchParams.get('shiftId')
    const hours = parseInt(searchParams.get('hours') || '24', 10)
    const since = new Date(Date.now() - hours * 3600000).toISOString()

    // Build query
    const where: any = {
      isSynced: { equals: false },
      createdAt: { greater_than: since },
    }
    if (outletId) where.outlet = { equals: outletId }
    if (shiftId) where.shift = { equals: shiftId }

    const pendingOffline = await payload.find({
      collection: 'pos-transactions',
      where,
      sort: 'createdAt',
      limit: 100,
    })

    // Sync summary by source
    const syncSummary = await payload.find({
      collection: 'pos-transactions',
      where: {
        createdAt: { greater_than: since },
      } as any,
      limit: 0,
    })

    const totalToday = syncSummary.totalDocs || 0

    // Get breakdown by sync source
    const online = await payload.find({
      collection: 'pos-transactions',
      where: {
        and: [
          { syncSource: { equals: 'online' } },
          { createdAt: { greater_than: since } },
        ],
      } as any,
      limit: 0,
    })
    const offlineSynced = await payload.find({
      collection: 'pos-transactions',
      where: {
        and: [
          { syncSource: { equals: 'offline_sync' } },
          { createdAt: { greater_than: since } },
        ],
      } as any,
      limit: 0,
    })
    const batchSynced = await payload.find({
      collection: 'pos-transactions',
      where: {
        and: [
          { syncSource: { equals: 'batch_sync' } },
          { createdAt: { greater_than: since } },
        ],
      } as any,
      limit: 0,
    })

    return NextResponse.json({
      success: true,
      data: {
        pendingOfflineTransactions: pendingOffline.docs?.length || 0,
        transactions: pendingOffline.docs || [],
        summary: {
          total: totalToday,
          online: online.totalDocs || 0,
          offlineSynced: offlineSynced.totalDocs || 0,
          batchSynced: batchSynced.totalDocs || 0,
          pendingSync: pendingOffline.docs?.length || 0,
        },
        period: `Last ${hours} hours`,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}