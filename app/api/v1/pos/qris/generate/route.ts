import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'
import QRCode from 'qrcode'

export const POST = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()
    const { amount, orderId, tenantSlug } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Generate unique session ID
    const sessionId = `QR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Get merchant ID from config
    const merchantId = process.env.QRIS_MERCHANT_ID || 'MIDTRANS_MERCHANT_ID'

    // Generate QR payload (simplified - in production use proper QRIS format)
    const qrisPayload = `${merchantId}|${amount}|${sessionId}|${orderId || 'POS'}`

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(qrisPayload, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })

    // Calculate expiry (30 minutes)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString()

    // In production, you'd store this in QRISSessions collection
    // For now, return the data directly

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        qrDataUrl,
        amount,
        expiresAt,
        remainingSeconds: 1800,
      },
    })
  } catch (error: any) {
    console.error('[POST /api/v1/pos/qris/generate]', error)
    return NextResponse.json({ error: 'Failed to generate QRIS' }, { status: 500 })
  }
}