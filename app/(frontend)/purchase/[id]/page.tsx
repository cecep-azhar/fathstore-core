'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { CreditCard, Building2, Loader2, QrCode } from 'lucide-react'
import { QRISCode } from '@/components/QRISCode'
import { PaymentProofUpload } from '@/components/PaymentProofUpload'

export default function PurchasePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [material, setMaterial] = useState<any>(null)
  const [banks, setBanks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [method, setMethod] = useState<'qris' | 'bank_transfer' | 'midtrans'>('qris')
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [transaction, setTransaction] = useState<any>(null)
  const [processing, setProcessing] = useState(false)
  const [gformChecked, setGformChecked] = useState(false)

  // Load Midtrans Snap Script
  useEffect(() => {
    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js'
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''

    if (!document.querySelector(`script[src="${snapScript}"]`)) {
      const script = document.createElement('script')
      script.src = snapScript
      script.setAttribute('data-client-key', clientKey)
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  useEffect(() => {
    async function loadData() {
      const { id } = await params
      const [materialRes, banksRes] = await Promise.all([
        fetch(`/api/materials/${id}`),
        fetch('/api/banks'),
      ])
      if (materialRes.ok) {
        const matData = await materialRes.json()
        setMaterial(matData)
      }
      if (banksRes.ok) {
        const banksData = await banksRes.json()
        setBanks(banksData.docs || [])
        if (banksData.docs?.length > 0) setSelectedBank(banksData.docs[0].id)
      }
      setLoading(false)
    }
    loadData()
  }, [params])

  const handlePurchase = async () => {
    if (!material) return

    setProcessing(true)

    try {
      // Get current user
      const userResponse = await fetch('/api/users/me', {
        credentials: 'include',
      })
      const userData = await userResponse.json()
      const user = userData.user
      const userId = user.id

      // Create transaction
      const transactionRes = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          materialId: material.id,
          amount: material.price || 0,
          method,
          status: 'pending',
          bankId: method === 'bank_transfer' ? selectedBank : undefined,
        }),
      })

      if (!transactionRes.ok) {
        throw new Error('Failed to create transaction')
      }

      const transactionData = await transactionRes.json()
      setTransaction(transactionData.doc)

      // If Midtrans, get Snap Token
      if (method === 'midtrans') {
        const tokenRes = await fetch('/api/midtrans/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId: transactionData.doc.id,
            amount: material.price || 0,
            customer: {
              first_name: user.name,
              email: user.email,
            },
          }),
        })

        if (tokenRes.ok) {
          const snapData = await tokenRes.json()
          if (window.snap) {
            window.snap.pay(snapData.token, {
              onSuccess: function (result: any) {
                alert('Pembayaran berhasil!')
                router.push('/history')
              },
              onPending: function (result: any) {
                alert('Menunggu pembayaran...')
              },
              onError: function (result: any) {
                alert('Pembayaran gagal!')
              },
              onClose: function () {
                alert('Anda menutup popup tanpa menyelesaikan pembayaran')
              },
            })
          }
        }
      }

      // Create enrollment with 'preview' status
      await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          materialId: material.id,
          status: 'preview',
        }),
      })
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Gagal membuat transaksi. Silakan coba lagi.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-mobile-max px-4 py-16 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-islamic-green dark:text-islamic-gold" />
      </div>
    )
  }

  if (!material) {
    return (
      <div className="mx-auto max-w-mobile-max px-4 py-16 text-center">
        <p className="text-gray-600 dark:text-gray-400">Materi tidak ditemukan</p>
      </div>
    )
  }

  const requiresGForm = material.gformLink && material.gformLink.length > 0

  return (
    <div className="mx-auto max-w-mobile-max px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Selesaikan Pembelian
      </h1>

      {requiresGForm && (
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Persyaratan Validasi
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
            Sebelum melanjutkan pembayaran, Anda diwajibkan untuk mengisi formulir validasi data
            berikut ini.
          </p>
          <a
            href={material.gformLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors mb-4"
          >
            Isi Formulir Validasi
          </a>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={gformChecked}
              onChange={(e) => setGformChecked(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Saya menyatakan bahwa saya sudah mengisi formulir di atas dengan benar.
            </span>
          </label>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ... Order Summary ... */}

        {/* Payment Method */}
        {!transaction ? (
          <div className="card p-6 relative">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Metode Pembayaran
            </h2>

            {/* Disable options if GForm not checked */}
            {requiresGForm && !gformChecked && (
              <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-900/50 z-10 cursor-not-allowed flex items-center justify-center rounded-lg">
                <p className="text-gray-900 dark:text-white font-bold bg-white dark:bg-gray-800 px-4 py-2 rounded shadow-lg">
                  Silakan centang validasi di atas
                </p>
              </div>
            )}

            <div
              className={`space-y-4 ${requiresGForm && !gformChecked ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${method === 'qris' ? 'border-islamic-green bg-islamic-green/5 dark:border-islamic-gold dark:bg-islamic-gold/5' : 'border-gray-200 dark:border-gray-700 hover:border-islamic-green dark:hover:border-islamic-gold'}`}
              >
                <input
                  type="radio"
                  name="method"
                  value="qris"
                  checked={method === 'qris'}
                  onChange={(e) => setMethod(e.target.value as 'qris')}
                  className="text-islamic-green dark:text-islamic-gold"
                />
                <QrCode className="h-5 w-5" />
                <span className="font-medium">QRIS (Cek Manual)</span>
              </label>

              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${method === 'bank_transfer' ? 'border-islamic-green bg-islamic-green/5 dark:border-islamic-gold dark:bg-islamic-gold/5' : 'border-gray-200 dark:border-gray-700 hover:border-islamic-green dark:hover:border-islamic-gold'}`}
              >
                <input
                  type="radio"
                  name="method"
                  value="bank_transfer"
                  checked={method === 'bank_transfer'}
                  onChange={(e) => setMethod(e.target.value as 'bank_transfer')}
                  className="text-islamic-green dark:text-islamic-gold"
                />
                <Building2 className="h-5 w-5" />
                <span className="font-medium">Transfer Bank (Cek Manual)</span>
              </label>

              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${method === 'midtrans' ? 'border-islamic-green bg-islamic-green/5 dark:border-islamic-gold dark:bg-islamic-gold/5' : 'border-gray-200 dark:border-gray-700 hover:border-islamic-green dark:hover:border-islamic-gold'}`}
              >
                <input
                  type="radio"
                  name="method"
                  value="midtrans"
                  checked={method === 'midtrans'}
                  onChange={(e) => setMethod(e.target.value as 'midtrans')}
                  className="text-islamic-green dark:text-islamic-gold"
                />
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Bayar Otomatis (Midtrans)</span>
              </label>

              {method === 'bank_transfer' && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pilih Bank Tujuan
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="input-field"
                    aria-label="Select bank for transfer"
                  >
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name} - {bank.accountNumber} ({bank.accountHolder})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handlePurchase}
                disabled={processing}
                className="w-full btn-primary mt-6"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  'Lanjutkan Pembayaran'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Instruksi Pembayaran
            </h2>

            {method === 'midtrans' && (
              <div className="space-y-4 text-center">
                <p>Silakan selesaikan pembayaran di popup yang muncul.</p>
                <button
                  onClick={() => window.snap.pay(transaction.midtransData?.token)}
                  className="btn-primary"
                >
                  Bayar Sekarang
                </button>
              </div>
            )}

            {method === 'qris' && (
              <div className="space-y-4">
                <QRISCode
                  data={{
                    merchantId: process.env.NEXT_PUBLIC_QRIS_MERCHANT_ID || 'MERCHANT123',
                    amount: material.price || 0,
                    transactionId: transaction.id,
                  }}
                />
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Setelah pembayaran, transaksi Anda akan diverifikasi secara otomatis. Mohon
                    tunggu konfirmasi.
                  </p>
                </div>
              </div>
            )}

            {method === 'bank_transfer' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Transfer ke:</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {banks.find((b) => b.id === selectedBank)?.name}
                  </p>
                  <p className="font-mono text-lg text-gray-900 dark:text-white">
                    {banks.find((b) => b.id === selectedBank)?.accountNumber}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {banks.find((b) => b.id === selectedBank)?.accountHolder}
                  </p>
                </div>

                <PaymentProofUpload
                  transactionId={transaction.id}
                  onSuccess={() => {
                    alert('Bukti pembayaran berhasil diunggah! Menunggu persetujuan admin.')
                    router.push('/history')
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
