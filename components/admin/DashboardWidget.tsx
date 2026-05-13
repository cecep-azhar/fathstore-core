'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { DashboardWidgetClient } from './DashboardWidgetClient'

export async function DashboardWidget() {
  const payload = await getPayload({ config: configPromise })

  // Fetch semua statistik secara paralel
  const [
    usersRes,
    membersRes,
    productsRes,
    ordersRes,
    ordersPaymentReviewRes,
    ordersPaidRes,
    ordersCompletedRes,
    transactionsRes,
    transactionsPendingRes,
    transactionsApprovedRes,
    materialsRes,
    enrollmentsRes,
    reviewsPendingRes,
  ] = await Promise.allSettled([
    payload.find({ collection: 'users', limit: 0 }),
    payload.find({ collection: 'users', where: { role: { equals: 'member' } }, limit: 0 }),
    payload.find({ collection: 'products', limit: 0 }),
    payload.find({ collection: 'orders', limit: 0 }),
    payload.find({ collection: 'orders', where: { paymentStatus: { equals: 'payment_review' } }, limit: 0 }),
    payload.find({ collection: 'orders', where: { paymentStatus: { equals: 'paid' } }, limit: 0 }),
    payload.find({ collection: 'orders', where: { fulfillmentStatus: { equals: 'completed' } }, limit: 0 }),
    payload.find({ collection: 'transactions', limit: 0 }),
    payload.find({ collection: 'transactions', where: { status: { equals: 'pending' } }, limit: 0 }),
    payload.find({ collection: 'transactions', where: { status: { equals: 'approved' } }, limit: 0 }),
    payload.find({ collection: 'materials', limit: 0 }),
    payload.find({ collection: 'enrollments', limit: 0 }),
    payload.find({ collection: 'reviews', where: { approved: { equals: false } }, limit: 0 }),
  ])

  // Ambil 5 order terbaru
  const recentOrdersRes = await payload.find({
    collection: 'orders',
    limit: 5,
    sort: '-createdAt',
  }).catch(() => null)

  // Ambil 5 transaksi terbaru (pending)
  const recentTxRes = await payload.find({
    collection: 'transactions',
    limit: 5,
    sort: '-createdAt',
    where: { status: { equals: 'pending' } },
  }).catch(() => null)

  const get = (res: PromiseSettledResult<any>): number => {
    if (res.status === 'fulfilled') return res.value?.totalDocs ?? 0
    return 0
  }

  const stats = {
    users: get(usersRes),
    members: get(membersRes),
    products: get(productsRes),
    orders: get(ordersRes),
    ordersReview: get(ordersPaymentReviewRes),
    ordersPaid: get(ordersPaidRes),
    ordersCompleted: get(ordersCompletedRes),
    transactions: get(transactionsRes),
    transactionsPending: get(transactionsPendingRes),
    transactionsApproved: get(transactionsApprovedRes),
    materials: get(materialsRes),
    enrollments: get(enrollmentsRes),
    reviewsPending: get(reviewsPendingRes),
  }

  const recentOrders = recentOrdersRes?.docs ?? []
  const recentTx = recentTxRes?.docs ?? []

  return (
    <DashboardWidgetClient
      stats={stats}
      recentOrders={recentOrders}
      recentTx={recentTx}
    />
  )
}
