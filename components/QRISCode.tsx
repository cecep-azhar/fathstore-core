'use client'

import { useState, useEffect } from 'react'
import { generateQRISCode, QRISPaymentData } from '@/lib/payment'
import { Loader2 } from 'lucide-react'

interface QRISCodeProps {
  data: QRISPaymentData
}

export function QRISCode({ data }: QRISCodeProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function generateCode() {
      try {
        setLoading(true)
        const code = await generateQRISCode(data)
        setQrCode(code)
      } catch (err) {
        setError('Failed to generate QR code')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    generateCode()
  }, [data])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-islamic-green dark:text-islamic-gold" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-center">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        {qrCode && (
          <img
            src={qrCode}
            alt="QRIS Payment Code"
            className="rounded-lg border-4 border-gray-200 dark:border-gray-700"
          />
        )}
      </div>
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Scan this QR code with any QRIS-compatible app</p>
        <p className="mt-2 font-semibold text-gray-900 dark:text-white">
          Amount:{' '}
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
            data.amount
          )}
        </p>
      </div>
    </div>
  )
}
