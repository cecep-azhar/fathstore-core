'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

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
  const activeSlides = slides.sort((a, b) => a.order - b.order)

  useEffect(() => {
    if (activeSlides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [activeSlides.length])

  if (activeSlides.length === 0) {
    return null
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
  }

  const slide = activeSlides[currentSlide]

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-islamic-green to-islamic-green/80 dark:from-islamic-gold dark:to-islamic-gold/80">
      <div className="relative h-[400px] sm:h-[500px]">
        {/* Background Image */}
        {slide.image?.url && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${slide.image.url})` }}
          />
        )}

        {/* Content */}
        <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white dark:text-gray-900 mb-4 animate-fade-in">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-lg sm:text-xl text-white/90 dark:text-gray-900/90 mb-8 animate-fade-in-delay">
                {slide.subtitle}
              </p>
            )}
            {slide.buttonText && slide.buttonLink && (
              <Link
                href={slide.buttonLink}
                className="inline-block bg-white dark:bg-gray-900 text-islamic-green dark:text-islamic-gold font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-lg animate-fade-in-delay-2"
              >
                {slide.buttonText}
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        {activeSlides.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 dark:bg-gray-900/20 hover:bg-white/30 dark:hover:bg-gray-900/30 text-white dark:text-gray-900 rounded-full p-2 transition-colors"
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 dark:bg-gray-900/20 hover:bg-white/30 dark:hover:bg-gray-900/30 text-white dark:text-gray-900 rounded-full p-2 transition-colors"
              aria-label="Slide berikutnya"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-white dark:bg-gray-900'
                    : 'w-2 bg-white/50 dark:bg-gray-900/50'
                }`}
                aria-label={`Ke slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
      `}</style>
    </div>
  )
}
