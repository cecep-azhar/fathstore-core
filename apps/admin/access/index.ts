import type { CollectionConfig } from 'payload'

/**
 * Access helpers for reuse across collections
 */
export const isAdmin = ({ req: { user } }: { req: { user: any } }) =>
  user?.role === 'admin'

export const isAdminOrMerchant = ({ req: { user } }: { req: { user: any } }) =>
  user?.role === 'admin' || user?.role === 'merchant'

export const isAuthenticated = ({ req: { user } }: { req: { user: any } }) =>
  !!user

export const isAdminOrSelf = ({ req: { user } }: { req: { user: any } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return {
    id: { equals: user.id },
  }
}

export const isPublicRead = () => true
