import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fathstore - Online Shop System',
  description: 'Online Shop System for Business',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
