'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Lock, Crown, ArrowRight } from 'lucide-react'
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
    <Link href={`/materials/${material.id}`} className="block group">
      <div className="glass-card h-full flex flex-col overflow-hidden">
        {/* Thumbnail Section */}
        <div className="aspect-[16/10] relative overflow-hidden">
          {material.thumbnail?.url ? (
            <Image
              src={material.thumbnail.url}
              alt={material.thumbnail.alt || material.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted/30">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {material.category && (
              <span className="backdrop-blur-md bg-white/20 dark:bg-black/20 text-white dark:text-islamic-gold text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border border-white/10">
                {material.category.name}
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3">
            {material.requiresPurchase && !enrolled ? (
              <div className="bg-islamic-gold text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg ring-1 ring-white/20">
                <Crown className="h-3.5 w-3.5" />
                <span>{material.price ? formatCurrency(material.price) : 'Premium'}</span>
              </div>
            ) : !material.requiresPurchase ? (
              <div className="bg-islamic-green text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg ring-1 ring-white/20">
                <span>GRATIS</span>
              </div>
            ) : enrolled ? (
              <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg ring-1 ring-white/20">
                <span>TERDAFTAR</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
            {material.title}
          </h3>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {material.requiresPurchase && !material.previewAllowed && !enrolled ? (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 font-medium">
                  <Lock className="h-4 w-4" />
                  <span>Akses Terkunci</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-islamic-green dark:text-islamic-gold font-medium">
                  <BookOpen className="h-4 w-4" />
                  <span>Mulai Belajar</span>
                </div>
              )}
            </div>

            <div className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
