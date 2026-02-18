// ============================================================
// @fathstore/shared — Shared types & utilities
// ============================================================

// ── Media Types ─────────────────────────────────────────────
export interface Media {
  id: string
  alt: string
  filename: string
  mimeType: string
  filesize: number
  width: number
  height: number
  url?: string
  sizes?: {
    thumbnail?: { url: string; width: number; height: number }
    card?: { url: string; width: number; height: number }
    tablet?: { url: string; width: number; height: number }
  }
}

// ── Product Types ───────────────────────────────────────────
export interface ProductVariant {
  id?: string
  name: string
  sku: string
  price: number
  stock: number
  attributes?: { key: string; value: string }[]
}

export interface Product {
  id: string
  title: string
  slug: string
  description: unknown // Lexical richText JSON
  thumbnail?: Media | { url: string; alt?: string } // Support both full object & simplified
  price: number
  compareAtPrice?: number
  category: Category | string
  variants?: ProductVariant[]
  stock: number
  status: 'draft' | 'active' | 'archived'
  featured: boolean
  tenantId?: Tenant | string
  createdAt: string
  updatedAt: string
}

// ── Order Types ─────────────────────────────────────────────
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed'

export interface OrderItem {
  product: Product | string
  variantName?: string
  quantity: number
  unitPrice: number
}

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  province: string
  postalCode: string
  phone: string
}

export interface Order {
  id: string
  orderNumber: string
  customer: { id: string; name: string; email: string } | string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod: 'qris' | 'bank_transfer' | 'xendit'
  paymentData?: Record<string, unknown>
  shippingAddress?: ShippingAddress
  tenantId?: Tenant | string
  createdAt: string
  updatedAt: string
}

// ── Review Types ────────────────────────────────────────────
export interface Review {
  id: string
  product: Product | string
  order: Order | string
  author: { id: string; name: string } | string
  rating: number
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

// ── License Types ───────────────────────────────────────────
export type LicensePlan = 'free' | 'starter' | 'pro' | 'enterprise'
export type LicenseStatus = 'active' | 'suspended' | 'expired'

export interface License {
  id: string
  key: string
  tenant: Tenant | string
  plan: LicensePlan
  status: LicenseStatus
  expiresAt: string
  maxProducts: number
  feePercentage: number
  createdAt: string
  updatedAt: string
}

// ── Supporting Types ────────────────────────────────────────
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  media?: Media | { url: string }
}

export interface Tenant {
  id: string
  name: string
  slug: string
  logo?: Media | { url: string }
  domain?: string
  theme?: Record<string, unknown>
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'merchant' | 'member'
  tenantId?: Tenant | string
}

// ── Layout Blocks ───────────────────────────────────────────
export interface Button {
  label: string
  url: string
  type: 'primary' | 'secondary'
}

export interface HeroBlock {
  blockType: 'hero'
  headline: string
  subHeadline?: string
  backgroundImage: Media | string
  buttons?: Button[]
}

export interface ContentBlock {
  blockType: 'content'
  richText: any // Lexical JSON
  layout: 'fullWidth' | 'splitLeft' | 'splitRight'
  sideImage?: Media | string
}

export interface StatItem {
  value: string
  label: string
}

export interface StatsBlock {
  blockType: 'stats'
  headline?: string
  statItems: StatItem[]
}

export interface FeaturedProductsBlock {
  blockType: 'featuredProducts'
  headline: string
  subHeadline?: string
  products: (Product | string)[]
}

export type PageBlock = HeroBlock | ContentBlock | StatsBlock | FeaturedProductsBlock

// ── Page Type ───────────────────────────────────────────────
export interface Page {
  id: string
  title: string
  slug: string
  layout: PageBlock[]
  createdAt: string
  updatedAt: string
}

// ── Utility Types ───────────────────────────────────────────
export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// ── Constants ───────────────────────────────────────────────
export const ORDER_STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'completed']
export const LICENSE_PLANS: LicensePlan[] = ['free', 'starter', 'pro', 'enterprise']
export const DEFAULT_FEE_PERCENTAGE = 1
