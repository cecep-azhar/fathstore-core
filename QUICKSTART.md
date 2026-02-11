## LMS WIJAD.com - Quick Start Guide

### Installation Steps

1. **Install dependencies:**

   ```powershell
   pnpm install
   ```

2. **Setup environment variables:**

   ```powershell
   Copy-Item .env.local.example .env.local
   ```

   Edit `.env.local` with your PostgreSQL credentials.

3. **Create PostgreSQL database:**

   ```sql
   CREATE DATABASE lmswijd;
   ```

4. **Run development server:**

   ```powershell
   pnpm dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

### First Time Setup

1. Navigate to http://localhost:3000/admin
2. Create your first admin account
3. Configure app settings via Globals → Settings
4. Add categories, banks, and materials

### Key Features

✅ Complete PayloadCMS integration
✅ PostgreSQL database with Drizzle ORM  
✅ QRIS and bank transfer payments
✅ Light/dark mode support
✅ Fully responsive mobile-first design
✅ Role-based access control
✅ Rich text editor (Lexical)
✅ File uploads with Sharp
✅ Production-ready for Vercel

### Project Structure

- `/app/(frontend)` - Public pages (home, login, dashboard, etc.)
- `/app/(payload)` - Admin panel and API routes
- `/components` - Reusable UI components
- `/lib` - Utilities, hooks, API functions
- `payload.config.ts` - PayloadCMS configuration

### Deployment

```powershell
vercel
```

Follow prompts and add environment variables in Vercel Dashboard.

For detailed documentation, see README.md
