import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status } = await request.json()

    if (!['approved', 'failed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

    // Update transaction status
    const transactionResponse = await fetch(`${payloadUrl}/api/transactions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        approvalDate: status === 'approved' ? new Date().toISOString() : undefined,
      }),
    })

    if (!transactionResponse.ok) {
      throw new Error('Failed to update transaction')
    }

    const transaction = await transactionResponse.json()

    // If approved, update enrollment status
    if (status === 'approved') {
      const enrollmentsResponse = await fetch(
        `${payloadUrl}/api/enrollments?where[userId][equals]=${transaction.userId}&where[materialId][equals]=${transaction.materialId}`,
        { cache: 'no-store' }
      )

      if (enrollmentsResponse.ok) {
        const enrollmentsData = await enrollmentsResponse.json()

        if (enrollmentsData.docs.length > 0) {
          const enrollment = enrollmentsData.docs[0]

          await fetch(`${payloadUrl}/api/enrollments/${enrollment.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'purchased',
            }),
          })
        }
      }
    }

    return NextResponse.json({ success: true, transaction })
  } catch (error) {
    console.error('Approve transaction error:', error)
    return NextResponse.json({ error: 'Failed to approve transaction' }, { status: 500 })
  }
}
