import type { HeroBlock } from '@fathstore/shared'
import Link from 'next/link'
import Image from 'next/image'

import { getMediaUrl } from '@/lib/utils'

export const Hero_Block = ({ block }: { block: HeroBlock }) => {
  const imageUrl = getMediaUrl(block.backgroundImage)

  return (
    <section className="relative h-[80vh] flex items-center">
      <div className="absolute inset-0 z-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={block.headline}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 drop-shadow-lg">
            {block.headline}
          </h1>
          {block.subHeadline && (
            <p className="text-xl text-gray-100 mb-8 max-w-xl font-medium drop-shadow-md">
              {block.subHeadline}
            </p>
          )}
          {block.buttons && block.buttons.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {block.buttons.map((btn, i) => (
                <Link
                  key={i}
                  href={btn.url}
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-full transition-all hover:scale-105 font-bold ${
                    btn.type === 'primary' 
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-900/20' 
                      : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/30 shadow-lg'
                  }`}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
