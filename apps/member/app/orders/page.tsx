import type { Order, PaginatedResponse } from '@fathstore/shared'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
}

async function getMyOrders(token?: string): Promise<PaginatedResponse<Order>> {
  const res = await fetch(`${PAYLOAD_URL}/api/orders?sort=-createdAt&limit=20`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    cache: 'no-store',
  })
  return res.json()
}

export default async function OrdersPage() {
  // In production, get the token from cookies/session
  const ordersData = await getMyOrders()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-gray-500 mb-8">Track your order status and history.</p>

      {ordersData.docs.length > 0 ? (
        <div className="space-y-4">
          {ordersData.docs.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="font-bold text-emerald-700">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-100 pt-4">
                <ul className="space-y-2">
                  {order.items.map((item, idx) => {
                    const productName = typeof item.product === 'object'
                      ? (item.product as any).title
                      : `Product #${item.product}`
                    return (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {productName}
                          {item.variantName && (
                            <span className="text-gray-400 ml-1">({item.variantName})</span>
                          )}
                          <span className="text-gray-400 ml-1">× {item.quantity}</span>
                        </span>
                        <span className="text-gray-600 font-medium">
                          {formatRupiah(item.unitPrice * item.quantity)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Review CTA for completed orders */}
              {order.status === 'completed' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={`/reviews/new?orderId=${order.id}`}
                    className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    ★ Write a Review
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <a
            href={process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3001'}
            className="inline-block px-6 py-3 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 transition-colors"
          >
            Browse Products
          </a>
        </div>
      )}
    </div>
  )
}
