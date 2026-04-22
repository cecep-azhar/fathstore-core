'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { useCurrency } from '@/providers/CurrencyProvider'
import { Package, MapPin, Truck, CheckCircle, Clock, ChevronLeft, ExternalLink } from 'lucide-react'

interface OrderItem {
  productTitle: string
  quantity: number
  unitPrice: number
  totalPrice: number
  image?: any
}

interface Order {
  id: string
  orderNumber: string
  total: number
  paymentStatus: string
  fulfillmentStatus: string
  paymentMethod: string
  items: OrderItem[]
  shippingAddress: any
  createdAt: string
}

interface TrackingEvent {
  id: string
  trackingNumber: string
  carrier: string
  status: string
  location: string
  description: string
  timestamp: string
}

const STATUS_STEPS = [
  { key: 'order_placed', label: 'Order Placed', icon: Package },
  { key: 'payment_confirmed', label: 'Payment Confirmed', icon: CheckCircle },
  { key: 'packed', label: 'Packed', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'in_transit', label: 'In Transit', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-50',
  payment_review: 'text-orange-600 bg-orange-50',
  paid: 'text-green-600 bg-green-50',
  failed: 'text-red-600 bg-red-50',
  refunded: 'text-gray-600 bg-gray-50',
  unfulfilled: 'text-gray-600 bg-gray-50',
  processing: 'text-blue-600 bg-blue-50',
  shipped: 'text-purple-600 bg-purple-50',
  completed: 'text-green-600 bg-green-50',
  complaint: 'text-red-600 bg-red-50',
}

export default function OrderTrackingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: authLoading } = useAuth() as { user: any, isLoading: boolean }
  const { formatPrice } = useCurrency()

  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState<Order | null>(null)
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/orders/track')
    }
  }, [user, authLoading, router])

  // Fetch order details
  useEffect(() => {
    if (!orderId || !user) return

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          credentials: 'include',
        })

        if (!res.ok) throw new Error('Order not found')

        const data = await res.json()
        setOrder(data.doc)

        // Fetch tracking events
        const trackingRes = await fetch(
          `/api/orderTracking?where[order][equals]=${orderId}&sort=timestamp`,
          { credentials: 'include' }
        )

        if (trackingRes.ok) {
          const trackingData = await trackingRes.json()
          setTrackingEvents(trackingData.docs || [])
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, user])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-500 mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Get current tracking status step
  const latestStatus = trackingEvents.length > 0
    ? trackingEvents[trackingEvents.length - 1].status
    : order.fulfillmentStatus

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === latestStatus)
  const completedSteps = currentStepIndex >= 0 ? currentStepIndex + 1 : 0

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/account/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
            <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Order Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.fulfillmentStatus] || STATUS_COLORS.unfulfilled}`}>
              {order.fulfillmentStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>

          {/* Progress Steps */}
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${(completedSteps / STATUS_STEPS.length) * 100}%` }}
              />
            </div>
            <div className="relative flex justify-between">
              {STATUS_STEPS.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index < completedSteps
                const isCurrent = index === completedSteps - 1

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`mt-2 text-xs text-center max-w-[60px] ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        {trackingEvents.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Tracking History</h2>
            <div className="space-y-4">
              {trackingEvents.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${index === trackingEvents.length - 1 ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                    {index < trackingEvents.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        {event.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <span className="text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {event.location && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    )}
                    {event.trackingNumber && (
                      <p className="text-xs text-gray-400 mt-1">
                        Tracking: {event.trackingNumber}
                        {event.carrier && ` (${event.carrier.toUpperCase()})`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  {item.image && (
                    <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={typeof item.image === 'object' ? item.image.url : item.image}
                        alt={item.productTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productTitle}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium mt-1">{formatPrice(item.unitPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            {order.shippingAddress && (
              <div className="text-gray-600">
                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {[order.shippingAddress.subdistrict, order.shippingAddress.district, order.shippingAddress.city, order.shippingAddress.province, order.shippingAddress.postalCode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number</span>
              <span className="font-medium">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">{order.paymentMethod?.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status</span>
              <span className={`font-medium ${STATUS_COLORS[order.paymentStatus]}`}>
                {order.paymentStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}