'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import type { User } from '@fathstore/shared'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (credentials: any) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check initial user from cookie
    const storedToken = Cookies.get('fathstore-member-token')
    if (storedToken) {
      setToken(storedToken)
      fetchUser(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUser = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        // Only logout if token is explicitly invalid (401)
        if (res.status === 401) {
            logout(false)
        }
      }
    } catch (error) {
      console.error('Failed to fetch user', error)
      // Do not logout on network error (CORS/Server Down) to avoid login loop
    } finally {
      setIsLoading(false)
    }
  }

  const login = async ({ email, password }: any) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        let errorMessage = 'Gagal masuk'
        try {
            const error = await res.json()
            errorMessage = error.errors?.[0]?.message || errorMessage
        } catch (e) {
            errorMessage = `Kesalahan Server (${res.status})`
        }
        throw new Error(errorMessage)
      }

      const data = await res.json()
      if (data.token) {
        // Simpan token ke cookie
        // Menggunakan opsi standar agar kompatibel dengan localhost dan production
        Cookies.set('fathstore-member-token', data.token, { 
            expires: 7,
            path: '/' 
        })
        
        setToken(data.token)
        setUser(data.user)
        
        console.log('Login berhasil, token disimpan', data.user)
        
        router.push('/')
        router.refresh()
      }
    } catch (error) {
        console.error('Login error:', error)
        throw error
    } finally {
      setIsLoading(false) 
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)
    // Prepare data
    const payload = {
        ...userData,
        role: 'member', // Enforce member role
        password: userData.password,
    }

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let errorMessage = 'Gagal mendaftar'
        try {
             const error = await res.json()
             errorMessage = error.errors?.[0]?.message || errorMessage
        } catch (e) {
             errorMessage = `Kesalahan Server (${res.status})`
        }
        throw new Error(errorMessage)
      }

      // Auto login after register
      await login({ email: userData.email, password: userData.password })
      
    } catch (error) {
        throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = (redirect = true) => {
    Cookies.remove('fathstore-member-token')
    setToken(null)
    setUser(null)
    if (redirect) router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
