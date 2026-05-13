/**
 * @deprecated Use POST /api/v1/payments/midtrans/token instead
 */

import { NextRequest, NextResponse } from 'next/server'
import { createSnapTransaction } from '@/lib/midtrans'

export async function POST(req: NextRequest) {
  try {
    const { transactionId, amount, customer, items } = await req.json()

    if (!transactionId || !amount || !customer) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const snapResponse = await createSnapTransaction(
      { order_id: transactionId, gross_amount: amount },
      customer,
      items
    )

    return NextResponse.json(
      snapResponse,
      {
        headers: {
          'X-Deprecated': 'true',
          'X-Migrate-To': '/api/v1/payments/midtrans/token',
        },
      }
    )
  } catch (error) {
    console.error('[LEGACY Snap Token Error]', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}