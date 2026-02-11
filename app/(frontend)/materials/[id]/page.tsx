'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getYoutubeEmbedUrl, formatCurrency } from '@/lib/utils'
import {
  PlayCircle,
  FileText,
  BookOpen,
  Lock,
  CheckCircle,
  Loader2,
  Clock,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'

interface MaterialDetail {
  id: string
  order: number
  title: string
  type: 'video' | 'pdf' | 'article'
  url: string
  duration?: string
  isFreePreview: boolean
}

interface Material {
  id: string
  title: string
  description: any
  category: { name: string }
  requiresPurchase: boolean
  previewAllowed: boolean
  price: number
  gformLink?: string
  thumbnail?: { url: string }
}

interface Enrollment {
  id: string
  materialId: any
  status: string
}

export default function MaterialPage() {
  const params = useParams()
  const id = params.id as string
  const { user, loading: authLoading } = useAuth()
  const [material, setMaterial] = useState<Material | null>(null)
  const [details, setDetails] = useState<MaterialDetail[]>([])
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [id, user])

  const fetchData = async () => {
    try {
      // Fetch material
      const matRes = await fetch(`/api/materials/${id}`)
      if (!matRes.ok) {
        setMaterial(null)
        setLoading(false)
        return
      }
      const matData = await matRes.json()
      setMaterial(matData)

      // Fetch material details
      const detailsRes = await fetch(
        `/api/material-details?where[material][equals]=${id}&sort=order`
      )
      if (detailsRes.ok) {
        const detailsData = await detailsRes.json()
        setDetails(detailsData.docs || [])
        // Set first accessible detail as active
        if (detailsData.docs && detailsData.docs.length > 0) {
          const firstAccessible =
            detailsData.docs.find((d: MaterialDetail) => d.isFreePreview) || detailsData.docs[0]
          setActiveDetailId(firstAccessible.id)
        }
      }

      // Fetch enrollment if user logged in
      if (user) {
        const enrollRes = await fetch(
          `/api/enrollments?where[userId][equals]=${user.id}&where[materialId][equals]=${id}`
        )
        if (enrollRes.ok) {
          const enrollData = await enrollRes.json()
          if (enrollData.docs && enrollData.docs.length > 0) {
            setEnrollment(enrollData.docs[0])
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!enrollment) return
    try {
      const res = await fetch(`/api/enrollments/${enrollment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', progress: 100 }),
      })
      if (res.ok) {
        setEnrollment({ ...enrollment, status: 'completed' })
        alert('Selamat! Anda telah menyelesaikan materi ini.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-islamic-green dark:text-islamic-gold" />
      </div>
    )
  }

  if (!material) {
    return (
      <div className="mx-auto max-w-mobile-max px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Materi Tidak Ditemukan
        </h1>
        <Link href="/" className="btn-primary">
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

  const hasPurchased =
    enrollment && (enrollment.status === 'purchased' || enrollment.status === 'completed')
  const activeDetail = details.find((d) => d.id === activeDetailId)

  const canAccessDetail = (detail: MaterialDetail) => {
    if (!material.requiresPurchase) return true
    if (detail.isFreePreview) return true
    if (hasPurchased) return true
    return false
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="h-4 w-4" />
      case 'pdf':
        return <FileText className="h-4 w-4" />
      case 'article':
        return <BookOpen className="h-4 w-4" />
      default:
        return null
    }
  }

  const renderContent = () => {
    if (!activeDetail) return null

    if (!canAccessDetail(activeDetail)) {
      return (
        <div className="text-center py-12">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sesi ini memerlukan pembelian
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {user
              ? 'Silakan selesaikan pembelian untuk mengakses semua sesi.'
              : 'Silakan masuk untuk membeli materi ini.'}
          </p>
          {!user ? (
            <Link href="/login" className="btn-primary inline-block">
              Masuk untuk Membeli
            </Link>
          ) : (
            <Link href={`/purchase/${material.id}`} className="btn-primary inline-block">
              Beli Sekarang - {formatCurrency(material.price || 0)}
            </Link>
          )}
        </div>
      )
    }

    switch (activeDetail.type) {
      case 'video':
        return (
          <div className="aspect-video">
            <iframe
              src={getYoutubeEmbedUrl(activeDetail.url)}
              title={activeDetail.title}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      case 'pdf':
        return (
          <div className="aspect-[3/4]">
            <iframe
              src={activeDetail.url}
              title={`PDF: ${activeDetail.title}`}
              className="w-full h-full rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        )
      case 'article':
        return (
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: activeDetail.url }} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-mobile-max px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/" className="text-islamic-green dark:text-islamic-gold hover:underline">
          ← Kembali ke Materi
        </Link>
      </div>

      {/* Material Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-sm bg-islamic-green/10 text-islamic-green dark:bg-islamic-gold/10 dark:text-islamic-gold px-2 py-1 rounded">
                {material.category.name}
              </span>
              {material.requiresPurchase && (
                <span className="text-sm bg-islamic-gold text-gray-900 px-2 py-1 rounded font-semibold">
                  Premium
                </span>
              )}
              {hasPurchased && (
                <span className="text-sm bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Sudah Dibeli
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {material.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {details.length} sesi pembelajaran
            </p>
            {material.requiresPurchase && !hasPurchased && (
              <div className="flex items-center gap-4">
                <p className="text-2xl font-bold text-islamic-gold">
                  {formatCurrency(material.price || 0)}
                </p>
                <Link href={user ? `/purchase/${material.id}` : '/login'} className="btn-primary">
                  {user ? 'Beli Sekarang' : 'Masuk untuk Membeli'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Session List */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Daftar Sesi</h2>
            <div className="space-y-2">
              {details.map((detail, index) => {
                const accessible = canAccessDetail(detail)
                const isActive = activeDetailId === detail.id

                return (
                  <button
                    key={detail.id}
                    onClick={() => setActiveDetailId(detail.id)}
                    disabled={!accessible}
                    className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                      isActive
                        ? 'bg-islamic-green/10 dark:bg-islamic-gold/10 border-l-4 border-islamic-green dark:border-islamic-gold'
                        : accessible
                          ? 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${isActive ? 'text-islamic-green dark:text-islamic-gold' : 'text-gray-900 dark:text-white'}`}
                      >
                        {detail.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {getTypeIcon(detail.type)}
                        <span className="capitalize">{detail.type}</span>
                        {detail.duration && (
                          <>
                            <Clock className="h-3 w-3" />
                            <span>{detail.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {!accessible ? (
                      <Lock className="h-4 w-4 text-gray-400" />
                    ) : detail.isFreePreview && material.requiresPurchase ? (
                      <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded">
                        Gratis
                      </span>
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            {activeDetail && (
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {activeDetail.title}
              </h3>
            )}
            {renderContent()}
          </div>

          {/* Google Form Validation */}
          {material.gformLink && hasPurchased && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg card">
              <p className="text-blue-800 dark:text-blue-300 mb-2">
                Silakan lengkapi formulir validasi:
              </p>
              <a
                href={material.gformLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Buka Google Form →
              </a>
            </div>
          )}

          {/* Mark Complete & Certificate Section */}
          {hasPurchased && enrollment && (
            <div className="mt-6 card p-4">
              {enrollment.status === 'purchased' ? (
                <button
                  onClick={handleMarkComplete}
                  className="flex items-center gap-2 bg-islamic-green hover:bg-islamic-green/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <CheckCircle className="h-5 w-5" />
                  Tandai Selesai
                </button>
              ) : enrollment.status === 'completed' ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                  <CheckCircle className="h-5 w-5" />
                  Materi Selesai
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
