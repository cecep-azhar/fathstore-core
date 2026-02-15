import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3001'

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <a href={storeUrl} className="inline-block mb-6">
              <span className="text-2xl font-black tracking-tighter text-gray-900">
                EXORTIVE
              </span>
            </a>
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
              <li><a href={`${storeUrl}/products`} className="hover:text-black transition-colors">All Products</a></li>
              <li><a href={`${storeUrl}/new-arrivals`} className="hover:text-black transition-colors">New Arrivals</a></li>
              <li><a href={`${storeUrl}/categories`} className="hover:text-black transition-colors">Categories</a></li>
              <li><a href={`${storeUrl}/sale`} className="hover:text-black transition-colors">Sale</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href={`${storeUrl}/faq`} className="hover:text-black transition-colors">FAQ</a></li>
              <li><a href={`${storeUrl}/shipping`} className="hover:text-black transition-colors">Shipping & Returns</a></li>
              <li><a href={`${storeUrl}/contact`} className="hover:text-black transition-colors">Contact Us</a></li>
              <li><a href={`${storeUrl}/size-guide`} className="hover:text-black transition-colors">Size Guide</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
             <h3 className="font-bold text-gray-900 mb-4">Stay Updated</h3>
             <p className="text-sm text-gray-500 mb-4">
              Subscribe to my newsletter for updates.
             </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Exortive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
