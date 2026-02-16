import React from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — Exortive',
  description: 'Learn more about Exortive and our mission to provide premium apparel.',
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80"
            alt="About background"
            fill
            className="w-full h-full object-cover opacity-50"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center bg-black/30 backdrop-blur-sm rounded-xl my-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
            Our Story
          </h1>
          <p className="mt-6 text-xl text-gray-100 max-w-3xl mx-auto drop-shadow-md font-medium">
            Driven by passion, defined by quality. We are redefining what it means to wear your ambition.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Crafted for Excellence
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Founded in 2024, Exortive began with a simple idea: that clothing should be more than just fabric—it should be a statement. We combine modern aesthetics with timeless craftsmanship to create pieces that stand out.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
              <div className="col-span-1 flex flex-col justify-center py-8 px-8 bg-gray-50 border border-gray-100 rounded-lg mr-4 mb-4">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-amber-600">10k+</span>
                  <span className="block mt-1 text-sm text-gray-500 font-medium">Happy Customers</span>
                </div>
              </div>
              <div className="col-span-1 flex flex-col justify-center py-8 px-8 bg-gray-50 border border-gray-100 rounded-lg mb-4">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-amber-600">100%</span>
                  <span className="block mt-1 text-sm text-gray-500 font-medium">Quality Guarantee</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 relative h-64 sm:h-72 md:h-96 lg:h-full min-h-[400px]">
            <Image
              className="rounded-2xl shadow-xl object-cover"
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80"
              alt="Workspace"
              fill
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-amber-600 font-bold tracking-wide uppercase">Our Values</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to shop
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We believe in sustainable practices, transparent pricing, and uncompromising quality.
            </p>
          </div>

          <div className="mt-14">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-amber-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-bold text-gray-900">Innovation</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Constantly pushing boundaries in fabric technology and design to bring you the best.
                </dd>
              </div>

              <div className="relative bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-amber-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-bold text-gray-900">Sustainability</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Confirmed responsibly sourced materials and environmentally conscious production methods.
                </dd>
              </div>

              <div className="relative bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-amber-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-bold text-gray-900">Community</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Building a community of like-minded individuals who value authenticity and style.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
