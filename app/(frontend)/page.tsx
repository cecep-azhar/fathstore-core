'use client'

import { useEffect, useState } from 'react'
import { HeroSlider } from '@/components/HeroSlider'
import { MaterialCard } from '@/components/MaterialCard'

interface Material {
  id: string
  title: string
  description: string
  thumbnail?: {
    url: string
  }
  category?: {
    name: string
  }
  price?: number
  requiresPurchase?: boolean
  previewAllowed?: boolean
}

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  image: {
    url: string
  }
  order: number
  active: boolean
}

type FilterType = 'all' | 'free' | 'premium'

export default function HomePage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [sliders, setSliders] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch materials
        const materialsRes = await fetch('/api/materials?limit=50')
        if (materialsRes.ok) {
          const materialsData = await materialsRes.json()
          setMaterials(materialsData.docs || [])
        }

        // Fetch hero sliders
        const slidersRes = await fetch('/api/hero-sliders?where[active][equals]=true&sort=order')
        if (slidersRes.ok) {
          const slidersData = await slidersRes.json()
          setSliders(slidersData.docs || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredMaterials = materials.filter((material) => {
    if (filter === 'all') return true
    if (filter === 'free') return !material.requiresPurchase
    if (filter === 'premium') return material.requiresPurchase
    return true
  })

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'free', label: 'Gratis' },
    { key: 'premium', label: 'Premium' },
  ]

  return (
    <div className="mx-auto max-w-mobile-max px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Slider */}
      {sliders.length > 0 && (
        <section className="mb-12">
          <HeroSlider slides={sliders} />
        </section>
      )}

      {/* Materials Grid */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Materi Pembelajaran</h2>

          {/* Filter Tabs */}
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filter === btn.key
                    ? 'bg-white dark:bg-gray-700 text-islamic-green dark:text-islamic-gold shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {btn.label}
                {btn.key === 'premium' && (
                  <span className="ml-1 text-xs bg-islamic-gold/20 text-islamic-gold px-1.5 py-0.5 rounded">
                    {materials.filter((m) => m.requiresPurchase).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Memuat materi...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'premium'
                ? 'Belum ada materi premium tersedia.'
                : filter === 'free'
                  ? 'Belum ada materi gratis tersedia.'
                  : 'Belum ada materi tersedia. Silakan cek kembali nanti!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mt-16 rounded-lg bg-gradient-to-r from-islamic-green to-islamic-green/80 dark:from-islamic-gold dark:to-islamic-gold/80 p-8 text-center">
        <h2 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">
          Mulai Perjalanan Belajar Anda Hari Ini
        </h2>
        <p className="text-white/90 dark:text-gray-900/90 mb-6">
          Bergabunglah dengan ribuan pelajar dalam mendalami ilmu Islam
        </p>
        <a
          href="/register"
          className="inline-block bg-white dark:bg-gray-900 text-islamic-green dark:text-islamic-gold font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Daftar Sekarang
        </a>
      </section>
    </div>
  )
}
