import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// POST /api/v1/access/validate — Validate user access to material/course
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, materialId } = body

    if (!userId || !materialId) {
      return NextResponse.json(
        { hasAccess: false, reason: 'Missing userId or materialId' },
        { status: 200 }
      )
    }

    const payload = await getPayload({ config }) as any

    // Check enrollment
    const enrollment = await payload.findFirst({
      collection: 'enrollments',
      where: { and: [{ userId: { equals: userId } }, { materialId: { equals: materialId } }] },
    } as any) as any

    if (!enrollment) {
      return NextResponse.json(
        { hasAccess: false, reason: 'Not enrolled' },
        { status: 200 }
      )
    }

    const enrollmentAny = enrollment as any

    if (enrollmentAny.status === 'purchased' || enrollmentAny.status === 'completed') {
      return NextResponse.json({
        hasAccess: true,
        enrollment: {
          id: enrollmentAny.id,
          status: enrollmentAny.status,
          progress: enrollmentAny.progress,
          enrolledAt: enrollmentAny.enrolledAt,
        },
      }, { status: 200 })
    }

    return NextResponse.json(
      { hasAccess: false, reason: 'Payment not approved' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[POST /api/v1/access/validate]', error)
    return NextResponse.json(
      { hasAccess: false, reason: 'Validation error' },
      { status: 500 }
    )
  }
}