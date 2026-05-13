/**
 * @deprecated Use POST /api/v1/access/validate instead
 * This route is kept for backward compatibility only.
 * Will be removed in v2.0. Please migrate to /api/v1/access/validate
 */

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

  try {
    const { userId, materialId } = await request.json()

    if (!userId || !materialId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Proxy to new endpoint
    const response = await fetch(`${baseUrl}/api/v1/access/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Legacy-Proxy': 'true',
      },
      body: JSON.stringify({ userId, materialId }),
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'X-Deprecated': 'true',
        'X-Migrate-To': '/api/v1/access/validate',
      },
    })
  } catch (error) {
    console.error('[LEGACY] Access validation error:', error)
    return NextResponse.json({ error: 'Failed to validate access' }, { status: 500 })
  }
}