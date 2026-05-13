import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// No auth required for payment status check
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) => {
  try {
    const { sessionId } = await params

    // In production, you'd query the QRISSessions collection
    // For now, return mock data based on session ID pattern

    // Parse session to determine status
    // If session contains 'PAID', it's paid
    // If session contains 'EXPIRED', it's expired
    // Otherwise, assume pending

    let status: 'pending' | 'paid' | 'expired' = 'pending'
    let remainingSeconds = 1800

    if (sessionId.includes('PAID')) {
      status = 'paid'
      remainingSeconds = 0
    } else if (sessionId.includes('EXPIRED')) {
      status = 'expired'
      remainingSeconds = 0
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        status,
        expiresAt: new Date(Date.now() + remainingSeconds * 1000).toISOString(),
        remainingSeconds,
      },
    })
  } catch (error: any) {
    console.error('[GET /api/v1/pos/qris/check/[sessionId]]', error)
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
  }
}