/**
 * @deprecated Use POST /api/v1/orders/[id]/approve instead
 * This route is kept for backward compatibility only.
 * Will be removed in v2.0. Please migrate to /api/v1/orders/[id]/approve
 */

import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Proxy to new endpoint
  const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

  try {
    const { status } = await request.json()

    if (!['approved', 'failed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const response = await fetch(`${baseUrl}/api/v1/orders/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Legacy-Proxy': 'true',
      },
      body: JSON.stringify({ status }),
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'X-Deprecated': 'true',
        'X-Migrate-To': `/api/v1/orders/${id}/approve`,
      },
    })
  } catch (error) {
    console.error('[LEGACY] Approve transaction error:', error)
    return NextResponse.json({ error: 'Failed to approve transaction' }, { status: 500 })
  }
}