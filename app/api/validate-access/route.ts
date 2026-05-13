import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId, materialId } = await request.json()

    if (!userId || !materialId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user has access to the material
    const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
    const enrollmentsResponse = await fetch(
      `${payloadUrl}/api/enrollments?where[userId][equals]=${userId}&where[materialId][equals]=${materialId}`,
      { cache: 'no-store' }
    )

    if (!enrollmentsResponse.ok) {
      return NextResponse.json({ hasAccess: false, reason: 'No enrollment found' }, { status: 200 })
    }

    const enrollmentsData = await enrollmentsResponse.json()

    if (enrollmentsData.docs.length === 0) {
      return NextResponse.json({ hasAccess: false, reason: 'Not enrolled' }, { status: 200 })
    }

    const enrollment = enrollmentsData.docs[0]

    if (enrollment.status === 'purchased' || enrollment.status === 'completed') {
      return NextResponse.json({ hasAccess: true, enrollment }, { status: 200 })
    }

    return NextResponse.json({ hasAccess: false, reason: 'Payment not approved' }, { status: 200 })
  } catch (error) {
    console.error('Access validation error:', error)
    return NextResponse.json({ error: 'Failed to validate access' }, { status: 500 })
  }
}
