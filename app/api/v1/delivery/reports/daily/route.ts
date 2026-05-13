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
    const tenantSlug = searchParams.get('tenantSlug')
    const date = searchParams.get('date') || new Date().toISOString().slice(0, 10)

    const payload = await getPayload({ config })

    // Get tenant
    let tenantId = null
    if (tenantSlug) {
      const tenant = await payload.findFirst({
        collection: 'tenants',
        where: { slug: { equals: tenantSlug } },
      })
      if (tenant) tenantId = (tenant as any).id
    }

    // Get today's assignments
    const startOfDay = `${date}T00:00:00.000Z`
    const endOfDay = `${date}T23:59:59.999Z`

    const assignments = await payload.find({
      collection: 'delivery-assignments',
      where: {
        tenant: tenantId ? { equals: tenantId } : undefined,
        createdAt: { greater_than_equal: startOfDay, less_than_equal: endOfDay },
      },
      depth: 2,
      limit: 200,
    })

    // Calculate stats
    const stats = {
      total: assignments.totalDocs,
      pending: 0,
      assigned: 0,
      inTransit: 0,
      delivered: 0,
      failed: 0,
      totalCOD: 0,
      codCollected: 0,
    }

    for (const a of assignments.docs) {
      const status = (a as any).status
      if (status === 'pending') stats.pending++
      else if (status === 'assigned' || status === 'accepted') stats.assigned++
      else if (status === 'picked_up' || status === 'in_transit') stats.inTransit++
      else if (status === 'delivered') stats.delivered++
      else if (status === 'failed' || status === 'cancelled') stats.failed++

      if ((a as any).isCOD && (a as any).codAmount) {
        stats.totalCOD += (a as any).codAmount
        if ((a as any).codCollected) {
          stats.codCollected += (a as any).codAmount
        }
      }
    }

    // Per-driver stats
    const driverStats: Record<string, any> = {}
    for (const a of assignments.docs) {
      const driverId = (a as any).driver?.id
      if (!driverId) continue

      if (!driverStats[driverId]) {
        driverStats[driverId] = {
          driver: (a as any).driver,
          total: 0,
          delivered: 0,
          failed: 0,
        }
      }
      driverStats[driverId].total++
      if ((a as any).status === 'delivered') driverStats[driverId].delivered++
      else if ((a as any).status === 'failed') driverStats[driverId].failed++
    }

    return NextResponse.json({
      success: true,
      data: {
        date,
        stats,
        drivers: Object.values(driverStats),
        recentAssignments: assignments.docs.slice(0, 20),
      },
    })
  } catch (error: any) {
    console.error('[GET /api/v1/delivery/reports/daily]', error)
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 })
  }
}