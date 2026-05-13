import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
    }

    const payload = await getPayload({ config }) as any

    // Try to find in QRISSessions collection
    let session: any = null
    try {
      session = await payload.findFirst({
        collection: 'qris-sessions' as any,
        where: { sessionId: { equals: sessionId } } as any,
      })
    } catch {
      // Collection might not exist yet
    }

    if (!session) {
      // Mock response for demo
      return NextResponse.json({
        success: true,
        data: {
          sessionId,
          status: 'pending',
          expiresAt: new Date(Date.now() + 1800 * 1000).toISOString(),
          remainingSeconds: 1800,
        },
      })
    }

    const remainingMs = new Date((session as any).expiresAt).getTime() - Date.now()
    const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000))

    return NextResponse.json({
      success: true,
      data: {
        sessionId: (session as any).sessionId,
        status: (session as any).status,
        amount: (session as any).amount,
        expiresAt: (session as any).expiresAt,
        remainingSeconds,
      },
    })
  } catch (error: any) {
    console.error('[GET /api/v1/payments/qris/status]', error)
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
  }
}