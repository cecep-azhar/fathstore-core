import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createSnapTransaction } from '@/lib/midtrans'

export async function POST(req: NextRequest) {
    try {
        const { transactionId, amount, customer, items } = await req.json()

        if (!transactionId || !amount || !customer) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
        }

        const payload = await getPayload({ config })

        // Create Snap Token
        const snapResponse = await createSnapTransaction(
            {
                order_id: transactionId,
                gross_amount: amount,
            },
            customer,
            items
        )

        // Update Transaction with Snap Token/URL (Optional, mostly handled by frontend)
        // But good to log or store if needed.

        return NextResponse.json(snapResponse)
    } catch (error) {
        console.error('Snap Token Error:', error)
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
    }
}
