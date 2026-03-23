'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, Building2, CreditCard, QrCode } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const method = searchParams.get('method') || ''

  const isBankTransfer = method.toLowerCase().includes('bank') || method.toLowerCase().includes('transfer')
  const isQris = method.toLowerCase().includes('qris')
  const isCard = method.toLowerCase().includes('card') || method.toLowerCase().includes('credit')

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md text-center max-w-lg mx-auto">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
        <CheckCircle className="h-10 w-10 text-emerald-600" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Thank you for your purchase. Your order has been recorded.
      </p>

      {orderId && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
          <p className="font-mono font-medium text-gray-900 dark:text-white text-lg break-all">{orderId}</p>
        </div>
      )}

      {method && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-md p-4 mb-6 text-left">
          <div className="flex items-center gap-2 mb-1">
            {isBankTransfer && <Building2 className="w-4 h-4 text-emerald-600" />}
            {isQris && <QrCode className="w-4 h-4 text-emerald-600" />}
            {isCard && <CreditCard className="w-4 h-4 text-emerald-600" />}
            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Payment Method: {method}</span>
          </div>
          {isBankTransfer && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Please transfer the exact amount to our bank account and upload your payment proof in the Member Dashboard.
            </p>
          )}
          {isQris && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Scan the QRIS code from your Member Dashboard to complete payment.
            </p>
          )}
          {isCard && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Your payment will be processed automatically. You will receive a confirmation email shortly.
            </p>
          )}
        </div>
      )}

      <div className="space-y-4 text-left border-t border-gray-100 dark:border-gray-700 pt-6 mb-8">
        <h3 className="font-medium text-gray-900 dark:text-white">Next Steps:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
           <li>Complete your payment using the method you selected.</li>
           <li>Go to your <strong>Member Dashboard</strong> to view order details.</li>
           <li>Upload payment proof (if using Bank Transfer).</li>
           <li>Wait for admin confirmation — you will be notified.</li>
        </ol>
      </div>

      <div className="flex flex-col gap-3">
        <a 
          href={orderId ? `${process.env.NEXT_PUBLIC_MEMBER_URL}/orders/${orderId}` : `${process.env.NEXT_PUBLIC_MEMBER_URL}/orders`}
          className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
        >
          View Order Details
          <ArrowRight className="ml-2 w-4 h-4" />
        </a>
        <Link 
          href="/" 
          className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
