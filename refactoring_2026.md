# Refactoring Fathstore UI - April 2026

## Tujuan
Refactor seluruh tampilan frontend (login, register, homepage, product listing, categories) mengikuti design system minimal Exortive dengan:
- header minimalis (logo tengah, nav sederhana, action icon kanan)
- warna konsisten
- spacing dan layout rapi
- hapus kelas tema lama (islamic-*)
- hapus semua error TypeScript/lint
- verifikasi di Chrome tanpa error runtime

---

## Phase 1: Perbaikan Error Teknis
**Status:** MULAI

### 1.1 TypeScript Configuration
- File: `tsconfig.json`
- Tugas:
  - Exclude folder `apps/` agar tidak ikut type-check (fokus ke root app saja)
  - Exclude `node_modules` dari type-check
  - Set strict mode konsisten
  - Set module ESNext untuk Next.js 14+

### 1.2 Payload Config
- File: `payload.config.ts`
- Tugas:
  - Hapus properti duplikat
  - Pastikan `sharp` config untuk media handling

### 1.3 Root Layout & Globals
- File: `app/layout.tsx`
- Tugas:
  - Pastikan provider wrapping (Auth, Currency, Theme)
  - Meta tag lengkap

- File: `app/globals.css`
- Tugas:
  - Tentukan CSS variable untuk warna Exortive (primary, secondary, neutral)
  - Hapus kelas tema lama (islamic-*)
  - Buat utility class untuk button, card, spacing

---

## Phase 2: Refactor Komponen Storefront Utama
**Status:** TODO

### 2.1 Header Store
- File: `components/store/StoreHeader.tsx` (create jika belum ada)
- Design:
  - Logo Exortive di tengah atau kiri (small)
  - Navigation horizontal: Home | Products | Categories | About
  - Action icons kanan: Search | Cart | User
  - Mobile: hamburger menu
  - Warna: background light/dark sesuai theme, text contrast tinggi
  - Padding: py-4 px-6
  - Border bottom subtle

### 2.2 Footer Store
- File: `components/store/StoreFooter.tsx` (create jika belum ada)
- Design:
  - Link section: Legal & Support, Ordering, Promotion & Voucher, Payment via QRIS, Payment Inquiries, Delivery, Refund & Returns, Size Charts, Unboxing
  - Newsletter signup form
  - Warna: background neutral/dark, text light
  - Padding: py-8 px-6
  - Copyright footer

### 2.3 Product Card
- File: `components/store/StoreProductCard.tsx` (atau update `components/ProductCard.tsx`)
- Design:
  - Image container: aspect-square, rounded-lg
  - Title: font-semibold, line-clamp-2
  - Price: font-bold, text-primary
  - Kategori badge: optional
  - Button: "Add to Cart" minimal style
  - Hover: shadow-md, scale-105 subtle

---

## Phase 3: Refactor Halaman Frontend
**Status:** TODO

### 3.1 Homepage
- File: `app/(frontend)/page.tsx`
- Sections:
  1. Hero banner (full width, overlay text "We Exortive Passion", CTA button)
  2. Featured products grid: 3-4 columns, responsive
  3. Categories showcase: 6 cards
  4. Newsletter CTA
  5. Footer

- Styling:
  - Remove old theme classes
  - Use new CSS classes (exortive-button, exortive-card, etc.)
  - Padding consistent: 4rem gap sections
  - Colors: primary (brand), secondary (accent), neutral (text/bg)

### 3.2 Products Listing
- File: `app/(frontend)/products/page.tsx`
- Sections:
  1. Page title: "All Products"
  2. Filter sidebar: kategori, harga, dll
  3. Product grid: 4 kolom desktop, 2 mobile
  4. Pagination
  5. Footer

- Styling:
  - Card design same as 3.1
  - Filter panel: clean, no shadow excess
  - Spacing: gap-6 antar card

### 3.3 Product Detail
- File: `app/(frontend)/[slug]/page.tsx`
- Sections:
  1. Image carousel (left)
  2. Details (right): title, price, description, specs, add-to-cart button
  3. Reviews section
  4. Related products
  5. Footer

- Styling:
  - Image: max-width-500px, rounded
  - Button: primary color, px-8 py-3
  - Spec list: clean table or list items

### 3.4 Categories
- File: `app/(frontend)/categories/page.tsx`
- Sections:
  1. Page title
  2. Category grid: 3-4 columns, image + name
  3. Description
  4. Footer

### 3.5 Login
- File: `app/(frontend)/login/page.tsx`
- Design:
  - Form centered: max-width-400px
  - Title: "Welcome Back"
  - Email input + Password input
  - "Forgot Password?" link
  - "Sign In" button (primary color, full width)
  - "Don't have account? Register here" link
  - No old theme classes (islamic-*)
  - Padding: py-12 px-4

- Styling:
  - Card bg: white/dark mode aware
  - Input: border-gray-300, focus ring primary
  - Button: bg-primary, text-white, hover darker

### 3.6 Register
- File: `app/(frontend)/register/page.tsx`
- Design:
  - Form centered: max-width-400px
  - Title: "Create Account"
  - Name input + Email input + Password input + Confirm password
  - Terms checkbox
  - "Sign Up" button (primary color, full width)
  - "Already have account? Sign in here" link
  - No old theme classes
  - Padding: py-12 px-4

- Styling:
  - Same as login, consistent form style

---

## Phase 4: CSS Cleanup & Utilities
**Status:** TODO

### 4.1 Global Styles
- File: `app/globals.css`
- Create:
  - CSS variables: --primary, --secondary, --neutral, --error, --success
  - Utility classes: `.exortive-button`, `.exortive-card`, `.exortive-input`
  - Remove: all `.islamic-*` classes
  - Font loading: import Geist/system font
  - Dark mode support: @media (prefers-color-scheme: dark)

### 4.2 Tailwind Config
- File: `tailwind.config.js`
- Ensure:
  - Primary color mapped to Exortive brand
  - Extend spacing, rounded, shadow as needed
  - Dark mode enabled
  - Content paths correct

---

## Phase 5: Validasi & Testing
**Status:** TODO

### 5.1 Lint & Type Check
- Commands:
  ```bash
  npm run type-check  # atau next build --no-lint
  npx eslint app/ components/ --fix
  ```
- Ensure: 0 errors, 0 warnings

### 5.2 Build
- Commands:
  ```bash
  npm run build
  ```
- Ensure: build success, no type errors

### 5.3 Dev Server
- Commands:
  ```bash
  npm run dev
  ```
- Ensure: server starts on localhost:3000, no console errors

### 5.4 Browser Testing (Chrome)
- Routes to test:
  - [ ] `/` - Homepage (hero, products, categories)
  - [ ] `/login` - Login form
  - [ ] `/register` - Register form
  - [ ] `/products` - Product listing
  - [ ] `/categories` - Categories page
  - [ ] `/products/[slug]` - Product detail (pick one)
  - [ ] `/cart` - Cart page
  - [ ] `/checkout` - Checkout flow

- Checks:
  - [ ] No console errors
  - [ ] Layout responsive (desktop, tablet, mobile)
  - [ ] Colors consistent with Exortive design
  - [ ] Forms functional (input, submit)
  - [ ] Navigation works
  - [ ] Images load
  - [ ] Buttons clickable
  - [ ] Spacing/padding consistent

---

## Phase 6: Bug Fixes & Polish
**Status:** TODO

### 6.1 Known Issues to Fix
- [ ] `midtrans-client` dependency missing → install
- [ ] Seed scripts type error → add @ts-nocheck
- [ ] payload.config.ts duplicate property → remove
- [ ] tsconfig.json includes too many folders → exclude apps
- [ ] Old theme classes in pages → replace or remove
- [ ] Icon button accessibility → add aria-label

### 6.2 Responsive Design
- [ ] Test on Chrome DevTools mobile emulation (iPhone 12, iPad)
- [ ] Ensure grid responsive (4 col desktop → 2 col tablet → 1 col mobile)
- [ ] Header nav mobile friendly

### 6.3 Dark Mode
- [ ] Test dark mode toggle if exists
- [ ] Ensure colors readable in both modes
- [ ] Verify contrast ratio (WCAG AA minimum)

---

## Checkpoints Selesai

| Phase | Task | Status | Notes |
|-------|------|--------|-------|
| 1 | TypeScript config cleanup | TODO | Exclude apps/, set ESNext |
| 1 | Payload config fix | TODO | Remove duplicate property |
| 1 | Global layout & CSS prep | TODO | Define CSS variables, utilities |
| 2 | StoreHeader component | TODO | Minimal design, responsive |
| 2 | StoreFooter component | TODO | Link sections, newsletter |
| 2 | StoreProductCard component | TODO | Consistent card design |
| 3 | Homepage refactor | TODO | Hero, products, categories |
| 3 | Products page refactor | TODO | Grid, filter, pagination |
| 3 | Product detail page | TODO | Left image, right details |
| 3 | Categories page | TODO | Grid layout |
| 3 | Login page refactor | TODO | Remove old theme, minimal form |
| 3 | Register page refactor | TODO | Remove old theme, minimal form |
| 4 | CSS cleanup | TODO | Remove islamic-*, add utilities |
| 5 | Lint & type check | TODO | 0 errors |
| 5 | Build success | TODO | npm run build |
| 5 | Dev server | TODO | npm run dev |
| 5 | Chrome browser test | TODO | All routes working |
| 6 | Bug fixes | TODO | Dependencies, accessibility |

---

## File Checklist

### Create/Update
- [ ] `components/store/StoreHeader.tsx` (create)
- [ ] `components/store/StoreFooter.tsx` (create)
- [ ] `components/store/StoreProductCard.tsx` (create or update)
- [ ] `app/(frontend)/page.tsx` (update)
- [ ] `app/(frontend)/products/page.tsx` (update)
- [ ] `app/(frontend)/[slug]/page.tsx` (update)
- [ ] `app/(frontend)/categories/page.tsx` (update)
- [ ] `app/(frontend)/login/page.tsx` (update)
- [ ] `app/(frontend)/register/page.tsx` (update)
- [ ] `app/layout.tsx` (update)
- [ ] `app/globals.css` (update)
- [ ] `tailwind.config.js` (verify)
- [ ] `tsconfig.json` (update)
- [ ] `payload.config.ts` (fix)

---

## Timeline Estimasi
- Phase 1: 10 menit (error fixes)
- Phase 2: 15 menit (components)
- Phase 3: 30 menit (pages refactor)
- Phase 4: 10 menit (CSS cleanup)
- Phase 5: 15 menit (validation & testing)
- Phase 6: 10 menit (polish & bug fixes)

**Total: ~90 menit start-to-finish**

---

## Next Step
Mulai Phase 1 sekarang: perbaiki tsconfig.json, payload.config.ts, dan siapkan global styling.
