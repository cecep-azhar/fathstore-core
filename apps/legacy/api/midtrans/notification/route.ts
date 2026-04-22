import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { core } from '@/lib/midtrans'

export async function POST(req: NextRequest) {
    try {
        const notificationJson = await req.json()
        const statusResponse = await core.transaction.notification(notificationJson)

        const orderId = statusResponse.order_id
        const transactionStatus = statusResponse.transaction_status
        const fraudStatus = statusResponse.fraud_status

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction Status: ${transactionStatus}. Fraud Status: ${fraudStatus}`)

        const payload = await getPayload({ config })

        // Find transaction by ID (orderId)
        const transaction = await payload.findByID({
            collection: 'transactions',
            id: orderId,
        })

        if (!transaction) {
            return NextResponse.json({ message: 'Transaction not found' }, { status: 404 })
        }

        let localStatus = 'pending'

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                // TODO: set transaction status on your database to 'challenge'
                // do not update enrollment yet
                localStatus = 'pending'
            } else if (fraudStatus == 'accept') {
                localStatus = 'approved'
            }
        } else if (transactionStatus == 'settlement') {
            localStatus = 'approved'
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            localStatus = 'failed'
        } else if (transactionStatus == 'pending') {
            localStatus = 'pending'
        }

        // Update Transaction Status
        if (localStatus !== transaction.status) {
            await payload.update({
                collection: 'transactions',
                id: orderId,
                data: {
                    status: localStatus as 'pending' | 'approved' | 'failed',
                    midtransData: statusResponse
                }
            })

            // If Approved, Update Enrollment
            if (localStatus === 'approved') {
                // Find enrollment
                const enrollments = await payload.find({
                    collection: 'enrollments',
                    where: {
                        and: [
                            { userId: { equals: typeof transaction.userId === 'object' ? transaction.userId.id : transaction.userId } },
                            { materialId: { equals: typeof transaction.materialId === 'object' ? transaction.materialId.id : transaction.materialId } }
                        ]
                    }
                })

                if (enrollments.docs.length > 0) {
                    await payload.update({
                        collection: 'enrollments',
                        id: enrollments.docs[0].id,
                        data: {
                            status: 'purchased'
                        }
                    })
                } else {
                    // Create if not exists (defensive)
                    await payload.create({
                        collection: 'enrollments',
                        data: {
                            userId: typeof transaction.userId === 'object' ? transaction.userId.id : transaction.userId,
                            materialId: typeof transaction.materialId === 'object' ? transaction.materialId.id : transaction.materialId,
                            status: 'purchased',
                            progress: 0,
                            enrolledAt: new Date().toISOString()
                        }
                    })
                }
            }
        }

        return NextResponse.json({ status: 'OK' })

    } catch (error) {
        console.error('Midtrans Notification Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
