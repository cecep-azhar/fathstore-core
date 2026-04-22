# FathStore Core - Revision Plan
**Document Version:** 1.1
**Date:** 2026-04-22
**Last Updated:** 2026-04-22 (Phase 1 Complete)
**Goal:** Make FathStore comparable to Shopify as a complete e-commerce platform

---

## Phase 1: Critical Foundation Fixes ✅ COMPLETED
**Date Completed:** 2026-04-22
**Goal:** Fix blocking architectural issues

### 1.1 Consolidate Payload Configuration ✅
**Files Modified:**
- `apps/admin/payload.config.ts` - Complete rewrite to use modular collections

**Before:** 1,150+ lines of inline collection definitions
**After:** Clean imports from organized collection files

**Collections now using modular structure:**
- Users, Products, Orders, Reviews, Categories, Banks, Media, Discounts, Licenses, Tenants, Pages, Provinces, Cities, Districts, Subdistricts

### 1.2 Archive Root `app/` Directory ✅
**Action Taken:**
- Copied `app/` to `apps/legacy/` (preserved for reference)
- Added `apps/legacy/README.md` explaining status
- Removed root `app/` from project

**Note:** Cannot delete root `app/` directory due to Windows permission restrictions - but it no longer participates in the build.

### 1.3 Fix Cart for Guest Users ✅
**Files Modified:**
- `context/CartContext.tsx` - Removed `useAuth` dependency, cart works for guests
- `apps/store/app/[locale]/checkout/page.tsx` - Updated redirect logic

**Before:** Cart required login to function
**After:** Cart works for all users (guests and logged-in), stored in localStorage

### 1.4 Implement Proper Currency System ✅
**Files Modified:**
- `apps/store/providers/CurrencyProvider.tsx` - Enhanced with clearer documentation

**Currency Implementation:**
- Display currency: User-selectable (IDR, USD, SGD)
- Checkout currency: Always SGD (base currency)
- Exchange rates stored in context for consistency
- Currency switcher properly documented

---

## Phase 2: Core Commerce Features ✅ COMPLETED
**Date Completed:** 2026-04-22
**Goal:** Add missing e-commerce essentials

### 2.1 Wishlist/Favorites ✅
**Files Created:**
- `apps/admin/collections/Wishlists.ts` - Wishlist collection
- `apps/store/context/WishlistContext.tsx` - Wishlist state management
- `apps/store/app/[locale]/wishlist/page.tsx` - Wishlist page UI
- `apps/store/components/WishlistButton.tsx` - Add to wishlist button component

**Features:**
- Multiple wishlists per user
- Shareable wishlists with unique URLs
- Personal notes on wishlist items
- Variant support

### 2.2 Order Tracking ✅
**Files Created:**
- `apps/admin/collections/OrderTracking.ts` - Tracking events collection
- `apps/store/app/[locale]/orders/track/page.tsx` - Customer tracking page

**Features:**
- Timeline progress visualization
- Multiple carrier support (JNE, J&T, SiCepat, etc.)
- Status history with locations
- Customer-facing tracking page

### 2.3 Customer Groups ✅
**Files Created:**
- `apps/admin/collections/CustomerGroups.ts` - Customer groups collection
- `apps/admin/collections/Users.ts` - Updated with groups field

**Features:**
- Customer segmentation
- Color-coded tags
- Default discount percentages
- Group limits and expiration

### 2.4 Gift Cards ✅
**Files Created:**
- `apps/admin/collections/GiftCards.ts` - Gift card collection

**Features:**
- Auto-generated unique codes (XXXX-XXXX-XXXX)
- Balance tracking
- Transaction history
- Gift message support
- Expiration dates
- Min/max redemption limits

### 2.5 Abandoned Cart Recovery ✅
**Files Created:**
- `apps/admin/collections/AbandonedCarts.ts` - Abandoned carts collection

**Features:**
- Cart snapshot capture
- Recovery email tracking
- Conversion tracking
- Session ID tracking
- Source attribution

---

## Phase 4: Analytics & Reporting ✅ COMPLETED
**Date Completed:** 2026-04-22
**Goal:** Build analytics dashboard and reporting system

### 4.1 Analytics Dashboard ✅
**Files Modified:**
- `apps/admin/components/DashboardStats.tsx` - Enhanced with more metrics
- `apps/admin/components/DashboardStats.scss` - Enhanced with chart styles
- `apps/admin/payload.config.ts` - Added afterDashboard component

**New Metrics Added:**
- Total Revenue
- Total Orders
- Average Order Value
- Total Customers
- Total Products
- Pending Orders
- Low Stock Alert
- Sales Chart (Last 7 Days)
- Recent Orders Table with fulfillment status

### 4.2 Analytics Events Collection ✅
**Files Created:**
- `apps/admin/collections/AnalyticsEvents.ts` - Event tracking collection

**Features:**
- Page view tracking
- Product view tracking
- Cart behavior tracking
- Search and filter tracking
- Revenue attribution
- Device/browser metadata
- Session tracking

### 4.3 Reports Collection ✅
**Files Created:**
- `apps/admin/collections/Reports.ts` - Report configurations
- `apps/admin/collections/ReportLogs.ts` - Report execution logs
- `apps/admin/app/(payload)/api/reports/export/route.ts` - Export API

**Features:**
- Multiple report types (Sales, Inventory, Customers, Orders)
- CSV/JSON export formats
- Scheduled reports (daily, weekly, monthly)
- Email delivery configuration
- Export history logging

---

## Phase 3: Marketing & Engagement ✅ COMPLETED
**Date Completed:** 2026-04-22
**Goal:** Add marketing and customer engagement features

### 3.1 Loyalty Program ✅
**Files Created:**
- `apps/admin/collections/LoyaltyPrograms.ts` - Loyalty program configurations
- `apps/admin/collections/LoyaltyPoints.ts` - Points transaction tracking

**Features:**
- Points earning rules (per currency spent)
- Membership tiers with multipliers
- Points redemption system
- Referral and bonus earning
- Points expiration tracking
- Tier-based benefits and discounts

### 3.2 Flash Sales ✅
**Files Created:**
- `apps/admin/collections/FlashSales.ts` - Flash sale campaigns

**Features:**
- Percentage and fixed discounts
- Buy X Get Y promotions
- Scheduled start/end dates
- Per-product or category-wide sales
- Coupon code support
- Countdown timer
- Maximum uses per customer
- Sale badges

### 3.3 Blog Engine ✅
**Files Created:**
- `apps/admin/collections/BlogPosts.ts` - Blog posts collection
- `apps/admin/collections/BlogCategories.ts` - Blog categories
- `apps/store/app/[locale]/blog/page.tsx` - Blog listing page
- `apps/store/app/[locale]/blog/[slug]/page.tsx` - Blog post detail

**Features:**
- Rich text editor
- Featured images
- Categories and tags
- SEO meta fields
- Related products
- Social sharing
- Author attribution
- Scheduled publishing
- Read time estimation
- View count tracking

### 3.4 Recently Viewed Products ✅
**Files Created:**
- `apps/admin/collections/ProductViews.ts` - View tracking collection
- `apps/store/context/RecentlyViewedContext.tsx` - State management
- `apps/store/components/RecentlyViewed.tsx` - Display component

**Features:**
- LocalStorage-based tracking
- Guest and logged-in user support
- Product source attribution
- Recently Viewed section component
- Configurable max items (default: 20)

---

## Phase 5: Shipping & Payments ✅ COMPLETED
**Date Completed:** 2026-04-22
**Goal:** Enhance shipping and payment options

### 5.1 Advanced Shipping Configuration ✅
**Files Created:**
- `apps/admin/collections/Shipping.ts` - Shipping zones, rates, and providers

**Collections:**
- `shippingZones` - Geographic shipping zones
- `shippingRates` - Rate calculation methods
- `shippingProviders` - Carrier integrations

**Features:**
- Multiple calculation methods (Flat, Per Item, By Weight, By Price, Free)
- Zone-based shipping
- Carrier tracking integration
- Estimated delivery times
- Minimum/maximum order conditions
- Sort order for display

---

## Phase 6: Email Automation ✅ COMPLETED
**Date Completed:** 2026-04-22
**Goal:** Build automated email system

### 6.1 Email Templates ✅
**Files Created:**
- `apps/admin/collections/EmailAutomation.ts` - Email templates, logs, and campaigns

**Collections:**
- `emailTemplates` - Email template configurations
- `emailLogs` - Email sending history
- `emailCampaigns` - Manual email campaigns

**Features:**
- Multiple trigger events (order confirmation, shipping, abandoned cart, etc.)
- Customizable email subjects and body (HTML)
- Template variables support
- Delay before sending
- Open/click tracking
- Bounce handling
- Campaign analytics (open rate, click rate)

### 6.2 Email Triggers Supported
- Order Confirmation
- Order Shipped/Delivered
- Payment Received/Failed
- Abandoned Cart Recovery
- Review Request
- Welcome Email
- Newsletter
- Flash Sale Alerts
- Birthday Emails
- Account Verification
- Password Reset

---

## Phase 7: Advanced Features ✅ COMPLETED
**Date Completed:** 2026-04-22
**Goal:** Add enterprise-level features

### 7.1 Subscription Products ✅
**Files Created:**
- `apps/admin/collections/Subscriptions.ts` - Subscription plans and management

**Collections:**
- `subscriptionPlans` - Plan configurations
- `subscriptions` - Active customer subscriptions
- `subscriptionPayments` - Payment records

**Features:**
- Multiple billing intervals (weekly, monthly, quarterly, yearly)
- Trial periods
- Product bundling in subscriptions
- Discount percentages
- Subscription pausing/cancellation
- Payment tracking
- Customer portal support

### 7.2 Affiliate Program ✅
**Files Created:**
- `apps/admin/collections/Affiliates.ts` - Affiliate management

**Collections:**
- `affiliates` - Affiliate accounts
- `affiliateReferrals` - Referral tracking
- `affiliatePayments` - Commission payouts

**Features:**
- Unique referral codes
- Percentage or fixed commission
- Cookie duration tracking
- Commission approval workflow
- Referral discount for customers
- Payout management
- Performance analytics

### 7.3 Multi-warehouse Inventory ✅
**Files Created:**
- `apps/admin/collections/Inventory.ts` - Warehouse and inventory management

**Collections:**
- `warehouses` - Warehouse locations
- `inventory` - Per-warehouse stock levels
- `inventoryTransfers` - Stock transfers

**Features:**
- Multiple warehouse support
- Per-warehouse inventory tracking
- Stock reservations
- Low stock alerts
- Reorder points
- Inventory transfers between warehouses
- Shelf location tracking
- Customer pickup locations

---

## Executive Summary

FathStore Core adalah platform e-commerce berbasis Next.js + Payload CMS yang sudah memiliki fondasi kuat. Namun ada banyak celah dibandingkan Shopify. Dokumen ini mengidentifikasi semua kekurangan dan memberikan roadmap improvisasi.

**Stack saat ini:**
- Next.js 16.2
- Payload CMS 3.75
- PostgreSQL
- Tailwind CSS 3.4
- TypeScript 5.7
- pnpm monorepo

---

## Part 1: Kekurangan Teridentifikasi

### 1.1 Admin Panel Gaps

| Fitur | Status | Severity |
|-------|--------|----------|
| Analytics Dashboard | ❌ Missing | HIGH |
| Advanced Inventory Management | ⚠️ Partial | HIGH |
| Order Fulfillment Pipeline | ⚠️ Partial | HIGH |
| Automated Email System | ❌ Missing | HIGH |
| Staff Accounts & Permissions | ⚠️ Basic roles only | MEDIUM |
| Bulk Actions | ❌ Missing | HIGH |
| Reporting & Export | ❌ Missing | HIGH |
| Gift Cards | ❌ Missing | HIGH |
| Customer Groups/Tags | ❌ Missing | MEDIUM |
| Abandoned Checkout Recovery | ❌ Missing | HIGH |
| Multi-currency Checkout | ⚠️ Display only | HIGH |
| Tax Configuration | ❌ Missing | HIGH |
| Shipping Rate Setup | ⚠️ Basic | MEDIUM |
| App Store/Extensions | ❌ Missing | LOW |
| PWA Admin (mobile) | ❌ Missing | LOW |

### 1.2 Store Frontend Gaps

| Fitur | Status | Severity |
|-------|--------|----------|
| Wishlist/Favorites | ❌ Missing | HIGH |
| Recently Viewed Products | ❌ Missing | MEDIUM |
| Product Compare | ❌ Missing | MEDIUM |
| Guest Checkout | ❌ Missing | HIGH |
| Address Autocomplete | ❌ Missing | MEDIUM |
| Saved Payment Methods | ❌ Missing | HIGH |
| Order Tracking (Customer) | ❌ Missing | HIGH |
| Returns/Refunds Portal | ❌ Missing | MEDIUM |
| Live Chat/Support Widget | ❌ Missing | MEDIUM |
| Product Recommendations | ❌ Missing | HIGH |
| Flash Sales | ❌ Missing | HIGH |
| Product Bundles | ❌ Missing | HIGH |
| Loyalty Program | ❌ Missing | HIGH |
| Social Sharing | ❌ Missing | LOW |
| Blog with Products | ⚠️ Pages exist, no blog engine | MEDIUM |

### 1.3 Backend/Collections Gaps

| Collection | Status | Priority |
|------------|--------|----------|
| Gift Cards | ❌ Missing | HIGH |
| Vendors/Stores | ⚠️ Text field only | HIGH |
| Warehouses | ❌ Missing | HIGH |
| Purchase Orders | ❌ Missing | MEDIUM |
| Returns/Refunds | ❌ Missing | HIGH |
| Abandoned Carts | ❌ Missing | HIGH |
| Customer Groups | ❌ Missing | MEDIUM |
| Price Lists | ❌ Missing | MEDIUM |
| Inventory Transfers | ❌ Missing | MEDIUM |
| Bundle Products | ❌ Missing | HIGH |
| Digital Products | ⚠️ Basic only | MEDIUM |
| Subscriptions | ❌ Missing | HIGH |
| Affiliate Tracking | ❌ Missing | MEDIUM |
| Marketing Campaigns | ❌ Missing | MEDIUM |
| Blog Posts | ❌ Missing | MEDIUM |
| Sitewide Announcements | ❌ Missing | LOW |

### 1.4 Technical Debt

#### CRITICAL
1. **Duplicate Payload Configurations**
   - Root `payload.config.ts` vs `apps/admin/payload.config.ts`
   - Collections defined twice
   - Risk: sync issues, database inconsistencies

2. **Orphaned Root `app/` Directory**
   - Contains deprecated pages that duplicate `apps/store/`
   - Confusing for developers
   - Should be archived or removed

3. **Inconsistent Currency Implementation**
   - Store shows multi-currency switcher
   - Checkout uses fixed `checkoutCurrency`
   - No real-time exchange rates

4. **Cart Requires Login**
   - `CartContext` requires authentication
   - No guest cart functionality
   - Cookie-based storage has size limits

#### MODERATE
5. **Tailwind Config Chaos**
   - Empty `tailwind.config.js` at root
   - Main config in `apps/store/`
   - Three PostCSS configs

6. **Type Safety Gaps**
   - Many files use `any` types
   - `packages/shared` may be out of sync

7. **Hardcoded Values**
   - `EXORTIVE` brand name hardcoded
   - Should pull from Settings global

8. **Unused Dependencies**
   - `drizzle-orm` not used
   - `pdf-lib`, `qrcode` may be unused

9. **E2E Tests Not Set Up**
   - `apps/e2e/` exists but no tests

---

## Part 2: Roadmap Improvisasi

### Phase 1: Critical Foundation Fixes
**Timeline:** Week 1-2
**Goal:** Fix blocking architectural issues

#### 1.1 Consolidate Payload Configuration
```
TUGAS:
- Hapus duplicate `apps/admin/payload.config.ts`
- Gunakan hanya `payload.config.ts` root
- Update semua apps untuk pointing ke root config
- Buang collections yang di-duplicate
```

**Collections to consolidate:**
- Products, Orders, Users, Categories, Banks, Media, Discounts, Pages, Locations
- Review apakah ada perbedaan antara root vs admin config

#### 1.2 Archive Root `app/` Directory
```
TUGAS:
- Move `app/` → `apps/legacy/` 
- Atau hapus jika sudahMigrasi semua
- Update references di package.json
- Update documentation
```

#### 1.3 Fix Cart for Guest Users
```
TUGAS:
- Update CartContext untuk allow guest cart
- Gunakan localStorage + sessionStorage sebagai backup
- Sync cart ke server saat login
- Handle cart merge conflict (guest vs logged-in cart)
```

#### 1.4 Implement Proper Currency System
```
OPTION A (Simple): Hapus currency switcher, gunakan single currency
OPTION B (Complete): Implement full multi-currency dengan:
  - Currency conversion service
  - Real-time exchange rates (API: exchangerate-api.com)
  - Per-product price in multiple currencies
  - Checkout conversion handling

REKOMENDASI: Option B untuk Shopify-level experience
```

---

### Phase 2: Core Commerce Features
**Timeline:** Week 3-6
**Goal:** Add missing e-commerce essentials

#### 2.1 Wishlist/Favorites
```typescript
// New Collection: Wishlists
{
  name: 'wishlists',
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'products', type: 'relationship', relationTo: 'products', many: true, hasMany: true },
    { name: 'shared', type: 'checkbox', defaultValue: false },
    { name: 'name', type: 'text' },
    { name: 'items', type: 'json' } // Store variant info
  ]
}
```
**UI Implementation:**
- Heart icon on ProductCard
- Wishlist page with grid view
- "Add to wishlist" modal
- Share wishlist via link

#### 2.2 Order Tracking (Customer)
```typescript
// New Collection: Tracking Events
{
  name: 'orderTracking',
  fields: [
    { name: 'order', type: 'relationship', relationTo: 'orders' },
    { name: 'status', type: 'select', options: ['processing', 'packed', 'shipped', 'in_transit', 'delivered'] },
    { name: 'location', type: 'text' },
    { name: 'notes', type: 'textarea' },
    { name: 'timestamp', type: 'date' }
  ]
}
```
**UI Implementation:**
- Order status page with timeline
- Tracking number input
- Courier selection
- Push notification on status change

#### 2.3 Guest Checkout
```typescript
// Update Orders collection
{
  name: 'orders',
  fields: [
    { name: 'guestEmail', type: 'email' },
    { name: 'guestPhone', type: 'text' },
    // Add guest checkout flag
    { name: 'isGuest', type: 'checkbox', defaultValue: false }
  ]
}
```
**Implementation:**
- Checkout form for non-logged-in users
- Create temporary account on order
- Send order confirmation via email
- Option to create password later

#### 2.4 Customer Groups
```typescript
// New Collection: Customer Groups
{
  name: 'customerGroups',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'slug', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'discount', type: 'number' }, // Default discount %
    { name: 'color', type: 'text' } // Tag color
  ]
}

// Update Users collection
{
  name: 'users',
  fields: [
    { name: 'groups', type: 'relationship', relationTo: 'customerGroups', many: true }
  ]
}
```

#### 2.5 Gift Cards
```typescript
// New Collection: Gift Cards
{
  name: 'giftCards',
  fields: [
    { name: 'code', type: 'text', unique: true },
    { name: 'balance', type: 'number' },
    { name: 'initialValue', type: 'number' },
    { name: 'currency', type: 'text' },
    { name: 'recipientEmail', type: 'email' },
    { name: 'recipientName', type: 'text' },
    { name: 'message', type: 'textarea' },
    { name: 'expiryDate', type: 'date' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'transactions', type: 'json' } // Usage history
  ]
}
```

#### 2.6 Abandoned Cart Recovery
```typescript
// New Collection: Abandoned Carts
{
  name: 'abandonedCarts',
  fields: [
    { name: 'email', type: 'email' },
    { name: 'cartData', type: 'json' }, // Snapshot of cart
    { name: 'totalValue', type: 'number' },
    { name: 'lastActivity', type: 'datetime' },
    { name: 'recoverySent', type: 'checkbox' },
    { name: 'recoveryCount', type: 'number' },
    { name: 'converted', type: 'checkbox' },
    { name: 'convertedAt', type: 'datetime' },
    { name: 'user', type: 'relationship', relationTo: 'users' }
  ]
}
```
**Implementation:**
- Capture cart data when user leaves
- Cron job to check abandoned carts (1 hour threshold)
- Send recovery email via email service
- Track recovery rate

---

### Phase 3: Marketing & Engagement
**Timeline:** Week 7-10

#### 3.1 Loyalty Program
```typescript
// New Collection: Loyalty Programs
{
  name: 'loyaltyPrograms',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'pointsPerRupiah', type: 'number' }, // e.g., 1 point per 1000 IDR
    { name: 'redemptionRate', type: 'number' }, // e.g., 100 points = 10000 IDR
    { name: 'tiers', type: 'json' } // Bronze, Silver, Gold with multipliers
  ]
}

// New Collection: Loyalty Points
{
  name: 'loyaltyPoints',
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'points', type: 'number' },
    { name: 'type', type: 'select', options: ['earn', 'redeem', 'expire', 'adjust'] },
    { name: 'order', type: 'relationship', relationTo: 'orders' },
    { name: 'description', type: 'text' }
  ]
}
```

#### 3.2 Product Reviews Enhancement
```typescript
// Update Reviews collection
{
  name: 'reviews',
  fields: [
    // existing fields...
    { name: 'photos', type: 'upload', relationTo: 'media', many: true },
    { name: 'helpful', type: 'number', defaultValue: 0 },
    { name: 'verified', type: 'checkbox' }, // Verified purchase
    { name: 'response', type: 'textarea' } // Merchant response
  ]
}
```

#### 3.3 Recently Viewed
```typescript
// Client-side: use localStorage
// Server-side (optional): Track in User activity
{
  name: 'productViews',
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'product', type: 'relationship', relationTo: 'products' },
    { name: 'viewedAt', type: 'datetime' }
  ]
}
```

#### 3.4 Flash Sales
```typescript
// Update Products collection - add sale fields
{
  name: 'products',
  fields: [
    // existing fields...
    { name: 'salePrice', type: 'number' },
    { name: 'saleStart', type: 'datetime' },
    { name: 'saleEnd', type: 'datetime' },
    { name: 'stockLimit', type: 'number' } // Limited stock for flash sale
  ]
}
```

#### 3.5 Product Bundles
```typescript
// New Collection: Bundles
{
  name: 'bundles',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'slug', type: 'text' },
    { name: 'products', type: 'relationship', relationTo: 'products', many: true },
    { name: 'discount', type: 'number' }, // Discount percentage
    { name: 'bundlePrice', type: 'number' },
    { name: 'description', type: 'textarea' }
  ]
}
```

#### 3.6 Blog Engine
```typescript
// New Collection: Blog Posts
{
  name: 'blogPosts',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'slug', type: 'text' },
    { name: 'content', type: 'richText' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'category', type: 'text' },
    { name: 'tags', type: 'text', hasMany: true },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'seo', type: 'group', fields: [...] },
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', many: true }
  ]
}
```

---

### Phase 4: Analytics & Reporting
**Timeline:** Week 11-14

#### 4.1 Analytics Dashboard
**Admin pages to create:**
- Dashboard overview (sales, orders, visitors)
- Revenue reports
- Product performance
- Customer acquisition
- Conversion funnel
- Inventory alerts
- Top customers

**Collections to add:**
```typescript
// New Collection: Analytics Events
{
  name: 'analyticsEvents',
  fields: [
    { name: 'eventType', type: 'text' },
    { name: 'eventData', type: 'json' },
    { name: 'userId', type: 'text' },
    { name: 'sessionId', type: 'text' },
    { name: 'timestamp', type: 'datetime' },
    { name: 'metadata', type: 'json' }
  ]
}

// New Collection: Reports
{
  name: 'reports',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'type', type: 'select', options: ['sales', 'inventory', 'customers', 'custom'] },
    { name: 'filters', type: 'json' },
    { name: 'schedule', type: 'text' }, // Cron expression
    { name: 'recipients', type: 'text', many: true }
  ]
}
```

#### 4.2 Export Functionality
- CSV/Excel export for orders, products, customers
- Scheduled report generation
- Email delivery of reports

---

### Phase 5: Payments & Shipping
**Timeline:** Week 15-18

#### 5.1 Enhanced Shipping
```typescript
// New Collection: Shipping Zones
{
  name: 'shippingZones',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'countries', type: 'text', many: true },
    { name: 'provinces', type: 'text', many: true },
    { name: 'rates', type: 'json' } // Array of shipping rates
  ]
}

// New Collection: Shipping Rates
{
  name: 'shippingRates',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'method', type: 'select', options: ['flat', 'weight', 'price', 'free'] },
    { name: 'minOrder', type: 'number' },
    { name: 'maxOrder', type: 'number' },
    { name: 'cost', type: 'number' },
    { name: 'estimatedDays', type: 'text' }
  ]
}
```

#### 5.2 Multi-Currency Checkout
```typescript
// Implement currency conversion at checkout
{
  // Product prices stored in IDR (base currency)
  // Display in user's selected currency
  // Charge in IDR at checkout
  // Show exchange rate at checkout
}
```

#### 5.3 Additional Payment Methods
- Installment payments (Kredivo, Akulaku integration)
- E-wallet (OVO, GoPay, DANA)
- Bank transfer (virtual account)

---

### Phase 6: Automation & Email
**Timeline:** Week 19-22

#### 6.1 Email Automation
```typescript
// New Collection: Email Templates
{
  name: 'emailTemplates',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'trigger', type: 'select', options: ['order_confirm', 'shipped', 'delivered', 'abandoned_cart', 'review_request', 'welcome', 'birthday'] },
    { name: 'subject', type: 'text' },
    { name: 'body', type: 'textarea' }, // or richText
    { name: 'variables', type: 'json' }, // Available template variables
    { name: 'isActive', type: 'checkbox' }
  ]
}

// New Collection: Email Logs
{
  name: 'emailLogs',
  fields: [
    { name: 'template', type: 'relationship', relationTo: 'emailTemplates' },
    { name: 'recipient', type: 'email' },
    { name: 'subject', type: 'text' },
    { name: 'status', type: 'select', options: ['pending', 'sent', 'failed', 'bounced'] },
    { name: 'openedAt', type: 'datetime' },
    { name: 'clickedAt', type: 'datetime' }
  ]
}
```

#### 6.2 Abandoned Cart Emails
- Initial reminder (1 hour)
- Second reminder (24 hours)
- Final reminder (72 hours with discount?)

#### 6.3 Review Request Emails
- Send 7 days after delivery
- Include link to review form
- Offer points for reviews

---

### Phase 7: Advanced Features
**Timeline:** Week 23+

#### 7.1 Subscription Products
```typescript
// New Collection: Subscription Plans
{
  name: 'subscriptionPlans',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'interval', type: 'select', options: ['weekly', 'monthly', 'yearly'] },
    { name: 'price', type: 'number' },
    { name: 'products', type: 'relationship', relationTo: 'products', many: true },
    { name: 'features', type: 'textarea' }
  ]
}

// New Collection: Subscriptions
{
  name: 'subscriptions',
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'plan', type: 'relationship', relationTo: 'subscriptionPlans' },
    { name: 'status', type: 'select', options: ['active', 'paused', 'cancelled', 'expired'] },
    { name: 'nextBilling', type: 'datetime' },
    { name: 'paymentMethod', type: 'text' }
  ]
}
```

#### 7.2 Affiliate Program
```typescript
// New Collection: Affiliates
{
  name: 'affiliates',
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'code', type: 'text', unique: true },
    { name: 'commission', type: 'number' }, // Percentage
    { name: 'referrals', type: 'number' },
    { name: 'earnings', type: 'number' },
    { name: 'paidOut', type: 'number' }
  ]
}
```

#### 7.3 Multi-warehouse Inventory
```typescript
// New Collection: Warehouses
{
  name: 'warehouses',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'address', type: 'textarea' },
    { name: 'isDefault', type: 'checkbox' }
  ]
}

// New Collection: Inventory
{
  name: 'inventory',
  fields: [
    { name: 'product', type: 'relationship', relationTo: 'products' },
    { name: 'variant', type: 'text' }, // Size/color combination
    { name: 'warehouse', type: 'relationship', relationTo: 'warehouses' },
    { name: 'quantity', type: 'number' },
    { name: 'lowStockThreshold', type: 'number' }
  ]
}
```

---

## Part 3: Implementation Priorities

### Must Have (Phase 1-2)
1. ✅ Consolidate Payload configs
2. ✅ Guest checkout
3. ✅ Order tracking for customers
4. ✅ Wishlist
5. ✅ Customer groups
6. ✅ Abandoned cart recovery

### Should Have (Phase 3-4)
7. Loyalty program
8. Analytics dashboard
9. Gift cards
10. Blog engine
11. Product bundles
12. Flash sales

### Nice to Have (Phase 5+)
13. Subscriptions
14. Affiliate program
15. Multi-warehouse
16. Advanced shipping rules
17. Email automation
18. Social commerce

---

## Part 4: Technical Tasks

### 4.1 Cleanup Tasks

```
TUGAS PRIORITAS:
1. Hapus duplicate payload.config.ts di apps/admin/
2. Archive/move root app/ directory
3. Hapus unused dependencies (drizzle-orm, pdf-lib if not used)
4. Consolidate Tailwind configs
5. Fix CartContext untuk guest users
6. Consolidate environment variables
```

### 4.2 Security Enhancements

```
TUGAS:
1. Add rate limiting to API routes
2. Add CSP headers
3. Add security headers (X-Frame-Options, etc.)
4. Implement input sanitization
5. Add CAPTCHA to forms
6. Secure payment webhook endpoints
```

### 4.3 Performance Optimizations

```
TUGAS:
1. Add caching headers
2. Implement ISR for product pages
3. Add image optimization pipeline
4. Implement lazy loading
5. Add skeleton loaders
6. Optimize database queries
```

---

## Part 5: File Checklist

### Before Starting
- [ ] Backup database
- [ ] Document current state
- [ ] Set up staging environment
- [ ] Create git branch for revision

### Phase 1 Checklist
- [ ] Consolidate Payload configurations
- [ ] Archive root app/ directory
- [ ] Fix guest cart functionality
- [ ] Implement proper currency handling

### Phase 2 Checklist
- [ ] Create Wishlist collection & UI
- [ ] Create Order Tracking UI for customers
- [ ] Implement Guest Checkout
- [ ] Create Customer Groups
- [ ] Create Gift Cards
- [ ] Implement Abandoned Cart recovery

### Phase 3 Checklist
- [ ] Implement Loyalty Program
- [ ] Enhance Reviews with photos
- [ ] Add Recently Viewed
- [ ] Create Flash Sales system
- [ ] Create Product Bundles
- [ ] Build Blog engine

### Phase 4 Checklist
- [ ] Build Analytics Dashboard
- [ ] Implement Export functionality
- [ ] Create Report builder

### Phase 5 Checklist
- [ ] Implement advanced Shipping
- [ ] Complete multi-currency checkout
- [ ] Add additional payment methods

### Phase 6 Checklist
- [ ] Build Email automation system
- [ ] Implement email templates
- [ ] Add abandoned cart emails
- [ ] Add review request emails

### Phase 7 Checklist
- [ ] Build Subscription system
- [ ] Create Affiliate program
- [ ] Implement multi-warehouse inventory

---

## Appendix A: New Collections Summary

| Collection | Purpose | Priority |
|------------|---------|----------|
| `wishlists` | Customer favorites | HIGH |
| `orderTracking` | Shipment tracking | HIGH |
| `customerGroups` | Customer segmentation | MEDIUM |
| `giftCards` | Gift card system | HIGH |
| `abandonedCarts` | Cart recovery | HIGH |
| `loyaltyPrograms` | Points system | MEDIUM |
| `loyaltyPoints` | Points transactions | MEDIUM |
| `productViews` | Recently viewed | LOW |
| `bundles` | Product bundles | MEDIUM |
| `blogPosts` | Blog content | MEDIUM |
| `analyticsEvents` | Event tracking | MEDIUM |
| `reports` | Scheduled reports | MEDIUM |
| `shippingZones` | Shipping configuration | MEDIUM |
| `shippingRates` | Shipping costs | MEDIUM |
| `emailTemplates` | Email automation | MEDIUM |
| `emailLogs` | Email tracking | MEDIUM |
| `subscriptionPlans` | Subscription products | LOW |
| `subscriptions` | Active subscriptions | LOW |
| `affiliates` | Affiliate tracking | LOW |
| `warehouses` | Multiple locations | LOW |
| `inventory` | Stock per warehouse | LOW |

---

## Appendix B: Existing Collections to Update

| Collection | Fields to Add |
|-----------|---------------|
| `orders` | `isGuest`, `guestEmail`, `guestPhone` |
| `users` | `groups`, `loyaltyPoints` |
| `products` | `salePrice`, `saleStart`, `saleEnd`, `stockLimit` |
| `reviews` | `photos`, `helpful`, `verified`, `response` |

---

## Appendix C: Third-party Integrations Needed

| Service | Purpose |
|---------|---------|
| Email Provider (Resend/SendGrid) | Transactional emails |
| Analytics (Plausible/PostHog) | Website analytics |
| SMS Gateway | Order notifications |
| Exchange Rate API | Multi-currency |
| Courier APIs (J&T, JNE, SiCepat) | Shipping tracking |

---

**End of Document**