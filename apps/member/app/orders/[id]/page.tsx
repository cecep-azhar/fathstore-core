'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { useLanguage } from '@/context/LanguageContext'
import { ChevronLeft, Package, Clock, CheckCircle, AlertCircle, Upload, Truck } from 'lucide-react'

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const { user, token, isLoading: authLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Upload State
  const [uploading, setUploading] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) {
           if (res.status === 404) throw new Error('Order not found')
           throw new Error('Failed to fetch order')
        }
        const data = await res.json()
        setOrder(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id && token) {
      fetchOrder()
    }
  }, [id, user, token, authLoading, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProofFile(file)
      setProofPreview(URL.createObjectURL(file))
    }
  }

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!proofFile || !order) return

    setUploading(true)
    setError(null)

    try {
      // 1. Upload Media
      const formData = new FormData()
      formData.append('file', proofFile)
      formData.append('alt', `Payment Proof Order ${order.orderNumber}`)

      const mediaRes = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/media`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!mediaRes.ok) throw new Error('Failed to upload image')
      const mediaData = await mediaRes.json()

      // 2. Update Order
      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          proofUrl: mediaData.doc.id,
          paymentStatus: 'payment_review',
        }),
      })

      if (!updateRes.ok) throw new Error('Failed to update order status')
      
      const updatedOrder = await updateRes.json()
      setOrder(updatedOrder.doc)
      setProofFile(null)
      setProofPreview(null)
      alert('Payment proof uploaded successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to upload proof')
    } finally {
      setUploading(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Error Loading Order</h3>
        <p className="mt-2 text-gray-500">{error || 'Order not found'}</p>
        <Link href="/orders" className="mt-6 inline-flex items-center text-emerald-600 hover:text-emerald-700">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
        </Link>
      </div>
    )
  }

  const isPending = order.paymentStatus === 'pending'
  const isReviewing = order.paymentStatus === 'payment_review'
  const isPaid = order.paymentStatus === 'paid'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/orders" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
             Order #{order.orderNumber}
          </h1>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 
              order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : 
              order.paymentStatus === 'refunded' ? 'bg-gray-100 text-gray-800' : 
              'bg-yellow-100 text-yellow-800'}`} // pending, payment_review
          >
            {order.paymentStatus.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Details */}
        <div className="lg:col-span-2 space-y-6">
           {/* Items */}
           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
             <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
               <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
                 <Package className="w-5 h-5 text-gray-400" /> Items
               </h3>
             </div>
             <ul className="divide-y divide-gray-200">
               {order.items.map((item: any, i: number) => (
                 <li key={i} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.productTitle}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} x {formatCurrency(item.unitPrice)}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(item.totalPrice)}</p>
                 </li>
               ))}
             </ul>
             <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                   <span>Subtotal</span>
                   <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                   <span>Shipping ({order.shippingCarrier || 'Standard'})</span>
                   <span>{formatCurrency(order.shippingCost || 0)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                   <span>Total</span>
                   <span>{formatCurrency(order.total)}</span>
                </div>
             </div>
           </div>

           {/* Shipment Tracking */}
           {order.trackingNumber && (
             <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-emerald-700 flex items-center gap-2">
                    <Truck className="w-5 h-5" /> Tracking Information
                  </h3>
                </div>
                <div className="px-4 py-5 sm:px-6">
                   <p className="text-sm text-gray-500">Carrier: <span className="font-medium text-gray-900">{order.shippingCarrier}</span></p>
                   <p className="text-sm text-gray-500 mt-1">Tracking Number:</p>
                   <p className="text-xl font-mono font-bold text-gray-900 mt-1 select-all">{order.trackingNumber}</p>
                   <p className="text-xs text-gray-400 mt-2">You can track this number on the carrier's website.</p>
                </div>
             </div>
           )}
        </div>

        {/* Right Column: Payment & Address */}
        <div className="space-y-6">
           {/* Payment Instructions / Proof */}
           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Payment</h3>
              </div>
              <div className="px-4 py-5 sm:px-6 space-y-4">
                 <p className="text-sm text-gray-600">Method: <span className="font-medium capitalize">{order.paymentMethod?.replace('_', ' ')}</span></p>
                 
                 {/* Proof Upload Logic */}
                 {(isPending || isReviewing) && order.paymentMethod === 'bank_transfer' && (
                    <div className="border rounded-md p-4 bg-gray-50">
                       <h4 className="font-medium text-gray-900 text-sm mb-2">Transfer to:</h4>
                       <p className="font-mono text-sm bg-white p-2 border rounded mb-4">BCA 1234567890<br/>a/n PT FathStore</p>
                       
                       <h4 className="font-medium text-gray-900 text-sm mb-2">Upload Proof</h4>
                       {isReviewing && <p className="text-xs text-yellow-600 mb-2 flex items-center"><Clock className="w-3 h-3 mr-1"/> Under Review</p>}
                       
                       <form onSubmit={handleUploadProof} className="space-y-3">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                          />
                          {proofPreview && (
                             <img src={proofPreview} alt="Preview" className="w-full h-32 object-cover rounded-md border" />
                          )}
                          <button 
                             type="submit"
                             disabled={!proofFile || uploading}
                             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                          >
                             {uploading ? 'Uploading...' : 'Submit Proof'}
                          </button>
                       </form>
                    </div>
                 )}
                 {isPaid && (
                    <div className="text-center py-4 text-emerald-600">
                       <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                       <p className="font-medium">Payment Verified</p>
                    </div>
                 )}
              </div>
           </div>

           {/* Shipping Address */}
           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Shipping Address</h3>
              </div>
              <div className="px-4 py-5 sm:px-6 text-sm text-gray-600">
                 {order.shippingAddress ? (
                    <>
                       <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                       <p>{order.shippingAddress.street}</p>
                       <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                       <p>{order.shippingAddress.postalCode}</p>
                       <p>{order.shippingAddress.phone}</p>
                    </>
                 ) : (
                    <p className="italic text-gray-400">No shipping address provided</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
