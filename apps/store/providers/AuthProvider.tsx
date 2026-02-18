'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import type { User } from '@fathstore/shared'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
const MEMBER_URL = process.env.NEXT_PUBLIC_MEMBER_URL || 'http://localhost:3002'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
        // Check initial user from cookie
        const storedToken = Cookies.get('fathstore-member-token')
        if (storedToken) {
          setToken(storedToken)
          await fetchUser(storedToken)
        } else {
          setIsLoading(false)
        }
    }
    
    checkAuth()
    
    // Listen for storage events (doesn't work for cookies directly, but good practice if using localstorage)
    // For cookies, we might need an interval or just rely on page nav.
    // Since Member and Store are different ports (same domain), they share cookies.
    // If I logout in Member (Tab A), and switch to Store (Tab B), 
    // Store won't know until I refresh or make a request.
    // That is acceptable standard behavior.
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
        if (res.status === 401) {
            logout(false)
        }
      }
    } catch (error) {
      console.error('Failed to fetch user', error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = (redirect = true) => {
    Cookies.remove('fathstore-member-token')
    setToken(null)
    setUser(null)
    if (redirect) {
        window.location.href = `${MEMBER_URL}/login`
    }
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
