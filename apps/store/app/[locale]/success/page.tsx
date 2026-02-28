'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg mx-auto">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
        <CheckCircle className="h-10 w-10 text-emerald-600" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order has been recorded.
      </p>

      {orderId && (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-mono font-medium text-gray-900 text-lg">{orderId}</p>
        </div>
      )}

      <div className="space-y-4 text-left border-t border-gray-100 pt-6 mb-8">
        <h3 className="font-medium text-gray-900">Next Steps:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
           <li>Make your payment (if using Bank Transfer).</li>
           <li>Go to your <strong>Member Dashboard</strong>.</li>
           <li>Upload your payment proof in the Order Details page.</li>
           <li>Wait for admin confirmation.</li>
        </ol>
      </div>

      <div className="flex flex-col gap-3">
        <a 
          href={`${process.env.NEXT_PUBLIC_MEMBER_URL}/orders/${orderId}`}
          className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
        >
          Upload Payment Proof
          <ArrowRight className="ml-2 w-4 h-4" />
        </a>
        <Link 
          href="/" 
          className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
