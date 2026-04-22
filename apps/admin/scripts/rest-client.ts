const API_URL = (process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002').replace(/\/$/, '')

export type JsonObject = Record<string, any>

export async function apiRequest<T = any>(
  path: string,
  options: {
    method?: string
    token?: string
    body?: JsonObject
    query?: Record<string, string | number | boolean | undefined>
  } = {},
): Promise<T> {
  const url = new URL(`${API_URL}${path}`)

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const text = await response.text()
  const payload = text ? safeJsonParse(text) : null

  if (!response.ok) {
    const message = payload?.errors?.[0]?.message || payload?.message || response.statusText
    throw new Error(`${response.status} ${message}`)
  }

  return payload as T
}

export async function findOne<T = any>(
  collection: string,
  whereField: string,
  whereValue: string,
  token?: string,
): Promise<T | null> {
  const result = await apiRequest<{ docs: T[] }>(`/api/${collection}`, {
    token,
    query: {
      [`where[${whereField}][equals]`]: whereValue,
      limit: 1,
    },
  })

  return result.docs[0] || null
}

export async function upsertByField<T = any>(
  collection: string,
  whereField: string,
  whereValue: string,
  data: JsonObject,
  token?: string,
): Promise<T> {
  const existing = await findOne<T>(collection, whereField, whereValue, token)
  if (existing) return existing

  return apiRequest<T>(`/api/${collection}`, {
    method: 'POST',
    token,
    body: data,
  })
}

export async function loginAdmin(email: string, password: string): Promise<string> {
  const response = await apiRequest<{ token?: string }>(`/api/users/login`, {
    method: 'POST',
    body: { email, password },
  })

  if (!response.token) {
    throw new Error('Login succeeded but no token was returned')
  }

  return response.token
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value)
  } catch {
    return { message: value }
  }
}
