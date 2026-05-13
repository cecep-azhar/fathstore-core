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
    const {
      outletId,
      shiftId,
      items,
      customer,
      customerName,
      customerPhone,
      tableId,
      subtotal,
      discountAmount,
      taxRate,
      taxAmount,
      serviceChargeRate,
      serviceChargeAmount,
      total,
      paymentMethod,
      payments,
      cashTendered,
      changeGiven,
      orderType,
      notes,
      loyaltyPointsRedeemed,
      loyaltyPointsValue,
      tenantSlug,
    } = body

    // Get tenant
    let tenant: any = null
    if (tenantSlug) {
      tenant = await payload.findFirst({
        collection: 'tenants',
        where: { slug: { equals: tenantSlug } },
      })
    }

    // Generate transaction ID
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    const transactionId = `POS-${date}-${random}`

    // Create POS transaction
    const posTransaction = await payload.create({
      collection: 'pos-transactions',
      data: {
        transactionId,
        outlet: outletId,
        shift: shiftId,
        cashier: user.id,
        tenant: tenant?.id,
        customer: customer,
        customerName,
        customerPhone,
        table: tableId,
        items,
        subtotal,
        discountAmount: discountAmount || 0,
        taxRate: taxRate || 11,
        taxAmount: taxAmount || 0,
        serviceChargeRate: serviceChargeRate || 0,
        serviceChargeAmount: serviceChargeAmount || 0,
        total,
        paymentMethod,
        payments,
        cashTendered,
        changeGiven,
        orderType: orderType || 'dine_in',
        loyaltyPointsEarned: 0,
        loyaltyPointsRedeemed: loyaltyPointsRedeemed || 0,
        loyaltyPointsValue: loyaltyPointsValue || 0,
        isSynced: true,
        syncSource: 'online',
        syncedAt: new Date().toISOString(),
        notes,
      },
    })

    // If loyalty points redeemed, deduct from membership
    if (loyaltyPointsRedeemed && customer && tenant) {
      const membership = await payload.findFirst({
        collection: 'memberships',
        where: { user: { equals: customer }, tenant: { equals: tenant.id } },
      })

      if (membership) {
        await payload.update({
          collection: 'memberships',
          id: (membership as any).id,
          data: {
            activePoints: (membership as any).activePoints - loyaltyPointsRedeemed,
          },
        })

        await payload.create({
          collection: 'loyalty-points',
          data: {
            user: customer,
            tenant: tenant.id,
            points: -loyaltyPointsRedeemed,
            type: 'redeem',
            description: `Redeem di POS Outlet ${outletId}`,
          },
        })
      }
    }

    // Calculate and add loyalty points earned
    if (tenant && customer && total > 0) {
      const memberConfig = (tenant as any).memberConfig
      const pointsPerRupiah = memberConfig?.pointsPerRupiah || 1000
      const earnedPoints = Math.floor(total / pointsPerRupiah)

      if (earnedPoints > 0) {
        await payload.update({
          collection: 'pos-transactions',
          id: posTransaction.id,
          data: { loyaltyPointsEarned: earnedPoints },
        })
      }
    }

    // Update shift stats
    if (shiftId) {
      const shift = await payload.findByID({
        collection: 'pos-shifts',
        id: shiftId,
      })

      if (shift) {
        const updateData: any = {
          totalTransactions: ((shift as any).totalTransactions || 0) + 1,
          totalSales: ((shift as any).totalSales || 0) + total,
        }

        if (paymentMethod === 'cash') {
          updateData.totalCash = ((shift as any).totalCash || 0) + (cashTendered || total)
        } else if (paymentMethod === 'qris') {
          updateData.totalQris = ((shift as any).totalQris || 0) + total
        } else if (paymentMethod === 'card') {
          updateData.totalCard = ((shift as any).totalCard || 0) + total
        }

        updateData.totalDiscount = ((shift as any).totalDiscount || 0) + (discountAmount || 0)
        updateData.totalTax = ((shift as any).totalTax || 0) + (taxAmount || 0)

        await payload.update({
          collection: 'pos-shifts',
          id: shiftId,
          data: updateData,
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: posTransaction,
      message: 'Transaction created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/v1/pos/transactions]', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}