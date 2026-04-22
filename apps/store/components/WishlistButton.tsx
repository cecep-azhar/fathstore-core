'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'

interface WishlistButtonProps {
  productId: string
  variantId?: string
  variantTitle?: string
  title: string
  slug: string
  price: number
  thumbnailUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function WishlistButton({
  productId,
  variantId,
  variantTitle,
  title,
  slug,
  price,
  thumbnailUrl,
  size = 'md',
  className = '',
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const inWishlist = isInWishlist(productId, variantId)

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlist) {
      removeFromWishlist(productId, variantId)
    } else {
      addToWishlist({
        productId,
        variantId,
        variantTitle,
        title,
        slug,
        price,
        thumbnailUrl,
      })
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`
        rounded-full transition-all duration-200
        ${inWishlist
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-white/80 text-gray-500 hover:text-red-500 hover:bg-white'
        }
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`${iconSizes[size]} ${inWishlist ? 'fill-current' : ''}`}
      />
    </button>
  )
}