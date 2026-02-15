import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function LicenseExpiredPage() {
  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto py-24 px-6 text-center">
        <div className="bg-white border border-red-200 rounded-2xl p-12 shadow-sm">
          <div className="text-red-500 mb-6">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Store License Expired
          </h1>
          <p className="text-gray-600 leading-relaxed">
            This store&apos;s license has expired or is inactive. Please contact the
            store owner or <a href="mailto:support@fathstore.com" className="text-emerald-700 underline">FathStore support</a> for assistance.
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}
