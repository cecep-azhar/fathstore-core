'use client'

import Link from 'next/link'
import { ArrowLeft, CreditCard } from 'lucide-react'

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
          <CreditCard className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          To make a payment, please proceed through checkout first.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/products"
            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Browse Products
          </Link>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
