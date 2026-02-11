import QRCode from 'qrcode'

export interface QRISPaymentData {
  merchantId: string
  amount: number
  transactionId: string
}

export async function generateQRISCode(data: QRISPaymentData): Promise<string> {
  // QRIS format: https://qris.id/
  // Simplified QRIS data string (in production, use proper QRIS specification)
  const qrisString = `00020101021226${data.merchantId}52045812530336054${String(
    data.amount
  ).padStart(10, '0')}5802ID5913${data.transactionId}6304`

  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrisString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QRIS code:', error)
    throw new Error('Failed to generate QRIS code')
  }
}

export async function createTransaction(data: {
  userId: string
  materialId: string
  amount: number
  method: 'qris' | 'bank_transfer'
  bankId?: string
}): Promise<any> {
  try {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId: data.userId,
        materialId: data.materialId,
        amount: data.amount,
        method: data.method,
        status: 'pending',
        bankId: data.bankId,
        createdAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create transaction')
    }

    return await response.json()
  } catch (error) {
    console.error('Create transaction error:', error)
    throw error
  }
}

export async function uploadPaymentProof(transactionId: string, file: File): Promise<any> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    // First upload the file to media collection
    const uploadResponse = await fetch('/api/media', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file')
    }

    const uploadData = await uploadResponse.json()

    // Then update the transaction with the proof URL
    const updateResponse = await fetch(`/api/transactions/${transactionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        proofUrl: uploadData.doc.id,
      }),
    })

    if (!updateResponse.ok) {
      throw new Error('Failed to update transaction')
    }

    return await updateResponse.json()
  } catch (error) {
    console.error('Upload payment proof error:', error)
    throw error
  }
}

export async function checkEnrollmentStatus(
  userId: string,
  materialId: string
): Promise<'none' | 'preview' | 'purchased' | 'completed'> {
  try {
    const response = await fetch(
      `/api/enrollments?where[userId][equals]=${userId}&where[materialId][equals]=${materialId}`,
      { credentials: 'include', cache: 'no-store' }
    )

    if (!response.ok) return 'none'

    const data = await response.json()

    if (data.docs.length === 0) return 'none'

    return data.docs[0].status
  } catch (error) {
    console.error('Check enrollment status error:', error)
    return 'none'
  }
}

export async function createEnrollment(data: {
  userId: string
  materialId: string
  status: 'preview' | 'purchased'
}): Promise<any> {
  try {
    const response = await fetch('/api/enrollments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId: data.userId,
        materialId: data.materialId,
        status: data.status,
        progress: 0,
        enrolledAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create enrollment')
    }

    return await response.json()
  } catch (error) {
    console.error('Create enrollment error:', error)
    throw error
  }
}
