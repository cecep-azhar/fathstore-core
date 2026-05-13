import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const body = await req.json()
    const { proofOfDelivery, podSignature, deliveredToName } = body

    const assignment = await payload.update({
      collection: 'delivery-assignments',
      id,
      data: {
        proofOfDelivery,
        podSignature,
        deliveredToName,
      },
    })

    return NextResponse.json({
      success: true,
      data: assignment,
      message: 'Proof of delivery uploaded',
    })
  } catch (error: any) {
    console.error('[POST /api/v1/delivery/assignments/[id]/pod]', error)
    return NextResponse.json({ error: 'Failed to upload proof of delivery' }, { status: 500 })
  }
}