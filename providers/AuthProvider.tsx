'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check payload-token cookie (set by Payload CMS automatically)
        const res = await fetch(`${API_URL}/api/users/me`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user || null)
        }
      } catch {
        // Not logged in
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {}
    setUser(null)
    setToken(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, logout }}>
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
