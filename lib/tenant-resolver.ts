/**
 * Tenant resolver — converts tenant slug to tenant ID
 * Uses admin Payload instance since tenants are in admin config
 */

import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Resolve tenant slug → tenant ID
 * Falls back to default if not found
 */
export async function resolveTenant(
  tenantSlug: string | null | undefined,
  fallbackSlug = 'default'
): Promise<{ id: string; slug: string; name: string } | null> {
  const slug = tenantSlug || fallbackSlug

  try {
    const payload = await getPayload({ config }) as any

    // Try to find by slug
    const result = await payload.find({
      collection: 'tenants',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    if (result.docs && result.docs.length > 0) {
      const tenant = result.docs[0] as any
      return {
        id: String(tenant.id),
        slug: tenant.slug,
        name: tenant.name,
      }
    }

    // Try to find by name as fallback
    const byName = await payload.find({
      collection: 'tenants',
      where: { name: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    if (byName.docs && byName.docs.length > 0) {
      const tenant = byName.docs[0] as any
      return {
        id: String(tenant.id),
        slug: tenant.slug,
        name: tenant.name,
      }
    }

    return null
  } catch {
    // If tenants collection doesn't exist, return null
    return null
  }
}

/**
 * Get default tenant ID
 */
export async function getDefaultTenant(): Promise<string> {
  const defaultTenant = await resolveTenant('default')
  return defaultTenant?.id || 'default'
}
