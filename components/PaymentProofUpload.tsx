'use client'

import { useState } from 'react'
import { Upload, Loader2, CheckCircle } from 'lucide-react'
import { uploadPaymentProof } from '@/lib/payment'

interface PaymentProofUploadProps {
  transactionId: string
  onSuccess?: () => void
}

export function PaymentProofUpload({ transactionId, onSuccess }: PaymentProofUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setSuccess(false)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploading(true)
      setError(null)
      await uploadPaymentProof(transactionId, file)
      setSuccess(true)
      if (onSuccess) onSuccess()
    } catch (err) {
      setError('Failed to upload payment proof')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Payment Proof
        </label>
        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-islamic-green dark:hover:border-islamic-gold transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {file && !success && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-islamic-green hover:bg-islamic-green/90 dark:bg-islamic-gold dark:hover:bg-islamic-gold/90 text-white dark:text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Proof'
          )}
        </button>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
          <CheckCircle className="h-5 w-5" />
          <p className="text-sm font-medium">Payment proof uploaded successfully!</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}
