import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-black tracking-tighter text-gray-900">
                EXORTIVE
              </span>
            </Link>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Premium apparel designed for those who dare to lead. Quality, performance, and style in every stitch.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Shop</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/products" className="hover:text-black transition-colors">All Products</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link href="/categories" className="hover:text-black transition-colors">Categories</Link></li>
              <li><Link href="/sale" className="hover:text-black transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link href="/size-guide" className="hover:text-black transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
             <h3 className="font-bold text-gray-900 mb-4">Stay Updated</h3>
             <p className="text-sm text-gray-500 mb-4">
              Subscribe to our newsletter for early access to new drops and exclusive offers.
             </p>
             <form className="flex flex-col gap-2">
               <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
               />
               <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                Subscribe
               </button>
             </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Exortive. All rights reserved. Powered by FathStore.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
             <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

