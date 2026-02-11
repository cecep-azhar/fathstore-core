// Helper to get the base URL for API calls
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return ''
  }
  // Server-side
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export interface Material {
  id: string
  title: string
  description: any
  type: 'video' | 'pdf' | 'article'
  url: string
  thumbnail?: {
    url: string
    alt?: string
  }
  previewAllowed: boolean
  requiresPurchase: boolean
  price?: number
  gformLink?: string
  category: {
    id: string
    name: string
    slug: string
  }
  featured: boolean
  publishedAt?: string
}

export interface Enrollment {
  id: string
  userId: string
  materialId: string | Material
  status: 'preview' | 'purchased' | 'completed'
  progress: number
  enrolledAt: string
}

export interface Transaction {
  id: string
  userId: string
  materialId: string | Material
  amount: number
  method: 'qris' | 'bank_transfer'
  status: 'pending' | 'approved' | 'failed'
  proofUrl?: {
    url: string
  }
  bankId?: {
    id: string
    name: string
    accountNumber: string
    accountHolder: string
  }
  qrisData?: string
  approvalDate?: string
  createdAt: string
}

export interface Bank {
  id: string
  name: string
  accountNumber: string
  accountHolder: string
  active: boolean
}

export interface Settings {
  appName: string
  appDescription?: string
  logoUrl?: {
    url: string
  }
  primaryColor?: string
  secondaryColor?: string
  enableRegistration: boolean
  maintenanceMode: boolean
  contactEmail?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
}

export async function fetchMaterials(params?: {
  category?: string
  featured?: boolean
  limit?: number
}): Promise<Material[]> {
  const queryParams = new URLSearchParams()

  if (params?.category) queryParams.set('where[category][equals]', params.category)
  if (params?.featured) queryParams.set('where[featured][equals]', 'true')
  if (params?.limit) queryParams.set('limit', params.limit.toString())

  const response = await fetch(`${getBaseUrl()}/api/materials?${queryParams.toString()}`, {
    cache: 'no-store',
  })

  if (!response.ok) throw new Error('Failed to fetch materials')

  const data = await response.json()
  return data.docs
}

export async function fetchMaterial(id: string): Promise<Material | null> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/materials/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) return null

    return await response.json()
  } catch (error) {
    console.error('Error fetching material:', error)
    return null
  }
}

export async function fetchEnrollments(userId: string): Promise<Enrollment[]> {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/enrollments?where[userId][equals]=${userId}`,
      {
        credentials: 'include',
        cache: 'no-store',
      }
    )

    if (!response.ok) return []

    const data = await response.json()
    return data.docs
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return []
  }
}

export async function fetchTransactions(userId: string): Promise<Transaction[]> {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/transactions?where[userId][equals]=${userId}&sort=-createdAt`,
      {
        credentials: 'include',
        cache: 'no-store',
      }
    )

    if (!response.ok) return []

    const data = await response.json()
    return data.docs
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

export async function fetchBanks(): Promise<Bank[]> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/banks?where[active][equals]=true`, {
      cache: 'no-store',
    })

    if (!response.ok) return []

    const data = await response.json()
    return data.docs
  } catch (error) {
    console.error('Error fetching banks:', error)
    return []
  }
}

export async function fetchSettings(): Promise<Settings | null> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/globals/settings`, {
      cache: 'no-store',
    })

    if (!response.ok) return null

    return await response.json()
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}
