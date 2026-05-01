import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const awb = searchParams.get('awb')
    const provider = searchParams.get('provider')

    if (!awb || !provider) {
      return NextResponse.json({
        error: 'AWB and provider are required',
      }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find shipping provider
    const shippingProvider = await payload.findFirst({
      collection: 'shipping-providers',
      where: {
        slug: { equals: provider },
      },
    })

    if (!shippingProvider) {
      return NextResponse.json({
        error: 'Provider not found',
      }, { status: 404 })
    }

    // Return mock tracking data
    // In production, this would call the actual shipping API (BitShip, JNE, etc.)
    const mockHistory = [
      {
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'received',
        location: 'Jakarta',
        description: 'Paket diterima di gudang pengirim',
      },
      {
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'picked_up',
        location: 'Jakarta',
        description: 'Paket telah diambil oleh kurir',
      },
      {
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in_transit',
        location: 'Surabaya',
        description: 'Paket dalam perjalanan ke tujuan',
      },
      {
        timestamp: new Date().toISOString(),
        status: 'on_transit',
        location: 'Surabaya',
        description: 'Paket menuju alamat tujuan',
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        awb,
        provider,
        providerName: shippingProvider.name,
        currentStatus: 'on_transit',
        history: mockHistory,
      },
    })
  } catch (error: any) {
    console.error('[GET /api/v1/courier/track]', error)
    return NextResponse.json({ error: 'Failed to track shipment' }, { status: 500 })
  }
}