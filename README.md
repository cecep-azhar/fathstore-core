# LMS WIJAD.com - Islamic Learning Management System

A complete, production-ready Next.js 16 application with PayloadCMS for Islamic education and learning management.

## 🚀 Features

- **Modern Tech Stack**: Next.js 16 App Router, PayloadCMS 3.x, PostgreSQL 16, Tailwind CSS
- **Authentication**: Built-in JWT authentication with role-based access control
- **Payment Integration**: QRIS and bank transfer support with admin approval workflow
- **Responsive Design**: Mobile-first, single-column layouts optimized for all devices
- **Dark Mode**: Full light/dark theme support with localStorage persistence
- **Content Management**: Rich text editor (Lexical), video embeds, PDF viewer, articles
- **Admin Panel**: Auto-generated admin interface at `/admin` for complete platform management
- **Multi-tenant Ready**: Customizable logos, themes, and branding

## 📋 Prerequisites

- Node.js >= 18.17.0
- PostgreSQL 16
- pnpm (recommended) or npm

## 🛠️ Installation

### 1. Install Dependencies

```powershell
pnpm install
```

Or with npm:

```powershell
npm install
```

### 2. Setup Environment Variables

Copy `.env.local.example` to `.env.local`:

```powershell
Copy-Item .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# PayloadCMS Configuration
PAYLOAD_SECRET=your-super-secret-key-change-this-in-production
DATABASE_URI=postgres://user:password@localhost:5432/lmswijd

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# QRIS Configuration (Optional)
QRIS_MERCHANT_ID=your-merchant-id
```

### 3. Setup PostgreSQL Database

Create a new PostgreSQL database:

```sql
CREATE DATABASE lmswijd;
```

PayloadCMS will automatically create tables on first run.

### 4. Run Development Server

```powershell
pnpm dev
```

Visit:

- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

## 📦 Project Structure

```
.
├── app/
│   ├── (frontend)/          # Public and member pages
│   │   ├── page.tsx         # Home page
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── dashboard/       # Member dashboard
│   │   ├── materials/[id]/  # Material detail page
│   │   ├── profile/         # User profile
│   │   ├── history/         # Transaction history
│   │   └── purchase/[id]/   # Payment page
│   ├── (payload)/           # Payload routes
│   │   ├── admin/           # Admin panel
│   │   └── api/             # REST & GraphQL API
│   ├── api/                 # Custom API routes
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── MaterialCard.tsx
│   ├── QRISCode.tsx
│   ├── PaymentProofUpload.tsx
│   └── ThemeToggle.tsx
├── lib/                     # Utilities and helpers
│   ├── api.ts              # API functions
│   ├── payment.ts          # Payment helpers
│   ├── utils.ts            # Utility functions
│   └── hooks/              # React hooks
│       ├── useAuth.ts
│       └── useTheme.ts
├── public/                  # Static assets
├── payload.config.ts        # PayloadCMS configuration
├── next.config.mjs          # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## 🗄️ Database Schema

### Collections

1. **Users**: Authentication and user management

   - email, password, name, role (admin/member), gformValidated

2. **Materials**: Learning content

   - title, description, type (video/pdf/article), url, price, category

3. **Categories**: Content organization

   - name, slug, description

4. **Enrollments**: User-material relationships

   - userId, materialId, status, progress

5. **Transactions**: Payment records

   - userId, materialId, amount, method, status, proofUrl

6. **Banks**: Bank account information

   - name, accountNumber, accountHolder

7. **Tenants**: Multi-tenant support

   - name, logo, theme

8. **Media**: File uploads
   - Image and PDF storage

### Global

- **Settings**: App configuration (name, logo, colors, etc.)

## 🎨 Features Guide

### For Users

1. **Browse Materials**: View all available courses without login
2. **Register/Login**: Create account and access personalized dashboard
3. **Purchase Courses**: Pay via QRIS or bank transfer
4. **Track Progress**: Monitor enrolled courses and transaction status

### For Admins

1. **Access Admin Panel**: Navigate to `/admin`
2. **Manage Materials**: Create, edit, delete courses
3. **Approve Transactions**: Review and approve bank transfer payments
4. **Manage Users**: View and modify user accounts
5. **Configure Settings**: Update app branding, colors, social links

## 💳 Payment Flow

### QRIS Payment

1. User selects material and clicks "Purchase"
2. Choose QRIS payment method
3. QR code is generated dynamically
4. User scans and pays
5. Transaction auto-verified (in production, integrate with payment gateway)

### Bank Transfer

1. User selects material and clicks "Purchase"
2. Choose bank transfer method
3. System displays bank details
4. User transfers money
5. User uploads payment proof
6. Admin approves transaction
7. User gains access to material

## 🚀 Deployment to Vercel

### 1. Prepare for Production

Update `package.json` scripts:

```json
{
  "scripts": {
    "build": "cross-env NODE_OPTIONS=\"${NODE_OPTIONS} --no-deprecation\" next build",
    "start": "cross-env NODE_OPTIONS=\"${NODE_OPTIONS} --no-deprecation\" next start"
  }
}
```

### 2. Setup Vercel Project

```powershell
# Install Vercel CLI
pnpm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### 3. Configure Environment Variables

In Vercel Dashboard, add:

```
PAYLOAD_SECRET=<strong-random-key>
DATABASE_URI=<vercel-postgres-connection-string>
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
QRIS_MERCHANT_ID=<your-merchant-id>
```

### 4. Setup Vercel Postgres

1. Go to your project in Vercel Dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy connection string to `DATABASE_URI`

### 5. Deploy

```powershell
vercel --prod
```

## 🔐 Default Admin Account

On first run, create an admin account via `/admin`:

1. Navigate to http://localhost:3000/admin
2. Create first user with admin role
3. Login with credentials

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js`:

```js
colors: {
  islamic: {
    green: '#006B3F',  // Primary color
    gold: '#D4AF37',   // Accent color
  },
}
```

### App Settings

Update via Admin Panel → Globals → Settings:

- App name and description
- Logo upload
- Primary/secondary colors
- Social media links
- Contact email

## 🧪 Testing

Run the development server and test:

1. User registration and login
2. Material browsing and viewing
3. Payment flow (QRIS and bank transfer)
4. Admin panel access
5. Transaction approval
6. Dark/light mode toggle

## 📱 Responsive Design

The app uses a mobile-first approach with:

- Single-column layouts
- Touch-friendly buttons (min 44px)
- Max-width containers (`max-w-mobile-max`: 640px)
- Optimized for portrait and landscape

## ♿ Accessibility

- WCAG 2.1 Level AA compliant
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast ratios

## 🔒 Security

- JWT authentication
- HTTPS (in production)
- Input validation
- SQL injection protection (Drizzle ORM)
- XSS protection
- CSRF protection

## 📊 Performance

- Server-side rendering (SSR)
- Image optimization (Sharp)
- Code splitting
- Lazy loading
- Caching strategies

## 🐛 Troubleshooting

### Database Connection Issues

```powershell
# Check PostgreSQL is running
Get-Service postgresql*

# Test connection
psql -U user -d lmswijd
```

### Build Errors

```powershell
# Clear cache and rebuild
Remove-Item -Recurse -Force .next
pnpm build
```

### Port Already in Use

```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000

# Kill process
Stop-Process -Id <PID>
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PayloadCMS Documentation](https://payloadcms.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For support, contact: support@lmswijd.com

---

Built with ❤️ for Islamic education
