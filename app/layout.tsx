import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LMS WIJAD.com - Islamic Learning Management System',
  description: 'Islamic Learning Management System for online education',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
