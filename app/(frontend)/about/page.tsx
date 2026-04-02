import { BRAND } from '@/config/brand'
import Link from 'next/link'
import { ArrowRight, Award, Shield, Truck } from 'lucide-react'

export const metadata = {
  title: `Tentang Kami - ${BRAND.name}`,
  description: BRAND.description,
}

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-6xl mb-6">
            Kenali Lebih Dekat <span className="text-amber-700">{BRAND.name}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            {BRAND.description} Kami berkomitmen untuk menghadirkan kualitas terbaik langsung ke tangan Anda.
          </p>
        </div>
      </section>

      {/* Nilai Kami */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Nilai yang Kami Pegang
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-amber-50">
                  <Award className="h-8 w-8 text-amber-700" />
                </div>
                <dt className="text-xl font-bold leading-7 text-gray-900">Kualitas Premium</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Setiap produk yang kami pasarkan dipilih dengan standar kualitas yang ketat demi kepuasan pelanggan.</p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-amber-50">
                  <Shield className="h-8 w-8 text-amber-700" />
                </div>
                <dt className="text-xl font-bold leading-7 text-gray-900">Pembayaran Aman</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Sistem pembayaran kami menggunakan enkripsi standar industri untuk keamanan transaksi Anda.</p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-amber-50">
                  <Truck className="h-8 w-8 text-amber-700" />
                </div>
                <dt className="text-xl font-bold leading-7 text-gray-900">Pengiriman Cepat</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Bekerja sama dengan logistik terpercaya untuk memastikan pesanan Anda tiba tepat waktu.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-black mb-6">Siap Menjelajahi Koleksi Kami?</h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-amber-900 shadow-sm hover:bg-gray-100 transition-all"
          >
            Mulai Belanja Sekarang <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
