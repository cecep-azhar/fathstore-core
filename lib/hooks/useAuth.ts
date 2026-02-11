'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'member'
  gformValidated?: boolean
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check current user on mount
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const response = await fetch('/api/users/me', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      setUser(data.user)
      return data.user
    } catch (error) {
      console.error('Login error:', error)
      return null
    }
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string): Promise<User | null> => {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email,
            password,
            name,
            role: 'member',
          }),
        })

        if (!response.ok) {
          throw new Error('Registration failed')
        }

        const data = await response.json()

        // Auto login after registration
        await login(email, password)

        return data.doc
      } catch (error) {
        console.error('Registration error:', error)
        return null
      }
    },
    [login]
  )

  const logout = useCallback(async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [router])

  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      const response = await fetch('/api/users/me', {
        credentials: 'include',
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.user
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }, [])

  return {
    user,
    loading,
    login,
    register,
    logout,
    getCurrentUser,
  }
}
