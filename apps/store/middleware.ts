import { NextRequest, NextResponse } from 'next/server'

/**
 * License Guard Middleware
 *
 * Checks if the tenant associated with this storefront has a valid,
 * active license before allowing access. Extracts tenant from the
 * hostname (subdomain-based multi-tenancy).
 *
 * Flow:
 * 1. Extract tenant slug from hostname (e.g., "acme.fathstore.com" → "acme")
 * 2. Query Payload API for an active license for that tenant
 * 3. If no valid license → redirect to /license-expired
 * 4. If valid → proceed normally
 */

const PAYLOAD_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Paths that should bypass the license check
const PUBLIC_PATHS = ['/license-expired', '/_next', '/favicon.ico', '/api']

function getTenantSlugFromHostname(request: NextRequest): string | null {
  const hostname = request.headers.get('host') || ''

  // Development: check for ?tenant=slug query param
  const tenantParam = request.nextUrl.searchParams.get('tenant')
  if (tenantParam) return tenantParam

  // Production: extract subdomain
  // e.g. "acme.fathstore.com" → "acme"
  const parts = hostname.split('.')
  if (parts.length >= 3) {
    return parts[0]
  }

  // Localhost: check for X-Tenant-Slug header (for testing)
  const tenantHeader = request.headers.get('x-tenant-slug')
  if (tenantHeader) return tenantHeader

  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip license check for public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const tenantSlug = getTenantSlugFromHostname(request)

  // If no tenant detected, allow (single-tenant mode or direct access)
  if (!tenantSlug) {
    return NextResponse.next()
  }

  try {
    // Query Payload for active license
    const licenseUrl = `${PAYLOAD_URL}/api/licenses?` + new URLSearchParams({
      'where[tenant.slug][equals]': tenantSlug,
      'where[status][equals]': 'active',
      'limit': '1',
    })

    const response = await fetch(licenseUrl, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.error(`[LicenseGuard] Payload API error: ${response.status}`)
      // On API error, allow through (fail-open) to avoid blocking all traffic
      return NextResponse.next()
    }

    const data = await response.json()

    if (!data.docs || data.docs.length === 0) {
      // No active license found
      return NextResponse.redirect(new URL('/license-expired', request.url))
    }

    const license = data.docs[0]

    // Check if license has expired
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      return NextResponse.redirect(new URL('/license-expired', request.url))
    }

    // License is valid — inject tenant info into headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-tenant-id', license.tenant?.id || license.tenant || '')
    requestHeaders.set('x-tenant-slug', tenantSlug)
    requestHeaders.set('x-license-plan', license.plan)

    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  } catch (error) {
    console.error('[LicenseGuard] Error checking license:', error)
    // Fail-open: don't block traffic on infrastructure errors
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
