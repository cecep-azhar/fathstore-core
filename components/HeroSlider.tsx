'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Slide {
  id: string
  title: string
  subtitle?: string
  image?: { url: string }
  buttonText?: string
  buttonLink?: string
  order: number
}

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  
  const activeSlides = [...slides].sort((a, b) => a.order - b.order)

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
  }, [activeSlides.length])

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }, [activeSlides.length])

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return

    const interval = setInterval(goToNext, 6000)
    return () => clearInterval(interval)
  }, [activeSlides.length, isPaused, goToNext])

  if (activeSlides.length === 0) return null

  const slide = activeSlides[currentSlide]

  return (
    <div 
      className="relative w-full group overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[450px] sm:h-[550px] overflow-hidden">
        {/* Background Image with Zoom Effect */}
        {activeSlides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
            }`}
          >
            {s.image?.url && (
              <Image
                src={s.image.url}
                alt={s.title}
                fill
                priority={idx === 0}
                className="object-cover"
              />
            )}
            {/* Dark Overlay with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        ))}

        {/* Content Section */}
        <div className="relative h-full flex items-center px-6 sm:px-12 lg:px-20">
          <div className="max-w-2xl">
            <div className={`space-y-6 transition-all duration-700 delay-300 ${isPaused ? '' : 'animate-in fade-in slide-in-from-left-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                <Sparkles className="h-4 w-4 text-islamic-gold" />
                <span>Koleksi Terbaru</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
                {slide.title}
              </h1>
              
              {slide.subtitle && (
                <p className="text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed">
                  {slide.subtitle}
                </p>
              )}

              <div className="pt-4 flex flex-wrap gap-4">
                {slide.buttonText && slide.buttonLink && (
                  <Link
                    href={slide.buttonLink}
                    className="btn-islamic-primary !py-4 !px-10 !text-lg !rounded-2xl group/btn flex items-center gap-2"
                  >
                    <span>{slide.buttonText}</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                )}
                <Link
                  href="/register"
                  className="glass px-10 py-4 rounded-2xl text-white font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Belanja Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Indicators */}
        <div className="absolute bottom-10 left-6 sm:left-12 flex items-center gap-3">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="group relative py-2"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className={`h-1.5 rounded-full transition-all duration-500 overflow-hidden ${
                index === currentSlide ? 'w-12 bg-islamic-gold' : 'w-3 bg-white/40 group-hover:bg-white/60'
              }`}>
                {index === currentSlide && (
                  <div className={`h-full bg-white transition-all duration-[6000ms] linear ${isPaused ? 'w-0' : 'w-full'}`} />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Controls Hidden by default, shown on hover */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-10 right-6 sm:right-12 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={goToPrevious}
              className="p-3 rounded-2xl glass hover:bg-white/20 text-white transition-all active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNext}
              className="p-3 rounded-2xl glass hover:bg-white/20 text-white transition-all active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
