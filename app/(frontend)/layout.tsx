import { cookies } from 'next/headers'
import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getPayload } from 'payload'
import config from '@payload-config'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')

  if (!token) return null

  try {
    const response = await fetch(`${getBaseUrl()}/api/users/me`, {
      headers: {
        Cookie: `payload-token=${token.value}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.user
  } catch (error) {
    return null
  }
}

async function getSettings() {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: 'settings',
    })
    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [user, settings] = await Promise.all([getUser(), getSettings()])

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header user={user} settings={settings || undefined} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </div>
      </body>
    </html>
  )
}
