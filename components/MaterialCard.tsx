'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Lock, Crown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface MaterialCardMaterial {
  id: string
  title: string
  description?: any
  thumbnail?: {
    url: string
    alt?: string
  }
  category?: {
    name: string
  }
  price?: number
  requiresPurchase?: boolean
  previewAllowed?: boolean
}

interface MaterialCardProps {
  material: MaterialCardMaterial
  enrolled?: boolean
}

export function MaterialCard({ material, enrolled = false }: MaterialCardProps) {
  return (
    <Link href={`/materials/${material.id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800">
        <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-700">
          {material.thumbnail?.url ? (
            <Image
              src={material.thumbnail.url}
              alt={material.thumbnail.alt || material.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {/* Premium Badge */}
          {material.requiresPurchase && !enrolled && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-islamic-gold to-yellow-500 text-gray-900 px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 shadow-lg">
              <Crown className="h-3 w-3" />
              {material.price ? formatCurrency(material.price) : 'Premium'}
            </div>
          )}

          {/* Enrolled Badge */}
          {enrolled && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              Terdaftar
            </div>
          )}

          {/* Free Badge */}
          {!material.requiresPurchase && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              Gratis
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {material.category && (
              <span className="text-xs bg-islamic-green/10 text-islamic-green dark:bg-islamic-gold/10 dark:text-islamic-gold px-2 py-1 rounded">
                {material.category.name}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-islamic-green dark:group-hover:text-islamic-gold transition-colors">
            {material.title}
          </h3>

          {material.requiresPurchase && !material.previewAllowed && !enrolled && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Lock className="h-4 w-4" />
              <span>Perlu pembelian</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
