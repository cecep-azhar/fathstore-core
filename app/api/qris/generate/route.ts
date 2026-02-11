import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(request: Request) {
  try {
    const { merchantId, amount, transactionId } = await request.json()

    if (!merchantId || !amount || !transactionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // QRIS format: https://qris.id/
    // Simplified QRIS data string (in production, use proper QRIS specification)
    const qrisString = `00020101021226${merchantId}52045812530336054${String(amount).padStart(
      10,
      '0'
    )}5802ID5913${transactionId}6304`

    const qrCodeDataURL = await QRCode.toDataURL(qrisString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return NextResponse.json({ qrCode: qrCodeDataURL })
  } catch (error) {
    console.error('QRIS generation error:', error)
    return NextResponse.json({ error: 'Failed to generate QRIS code' }, { status: 500 })
  }
}
