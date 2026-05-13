import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import QRCode from 'qrcode'

// POST /api/v1/payments/qris — Generate QRIS payment code
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, orderId, merchantId } = body

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, orderId', data: null },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config }) as any

    // Find or create QRIS session
    let session: any = null
    try {
      session = await payload.findFirst({
        collection: 'qris-sessions',
        where: { orderId: { equals: orderId } },
      } as any)
    } catch {
      // Collection may not exist — skip session tracking
    }

    // Generate QRIS string (simplified format)
    // In production, use proper QRIS specification with MPI/ACQ codes
    const qrisString = `00020101021226${merchantId || '886205000000'}520458125303360540${String(Math.floor(amount)).padStart(12, '0')}5802ID5913FATHSTORE6018Jakarta6243${String(orderId).padStart(16, '0')}6304`

    const qrCodeDataURL = await QRCode.toDataURL(qrisString, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
    })

    // Update/create session with expiry (30 minutes)
    if (session) {
      await payload.update({
        collection: 'qris-sessions' as any,
        id: (session as any).id,
        data: {
          status: 'pending',
          amount,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        } as any,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        amount,
        orderId,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate QRIS'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}