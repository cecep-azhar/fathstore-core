export type Locale = 'id' | 'en'

export const translations: Record<Locale, Record<string, string>> = {
  id: {
    // Header / Nav
    'nav.home': 'Beranda',
    'nav.shop': 'Belanja',
    'nav.categories': 'Kategori',
    'nav.about': 'Tentang',

    // Cart
    'cart.title': 'Keranjang Belanja',
    'cart.empty': 'Keranjang Belanja Kosong',
    'cart.emptyDesc': 'Sepertinya Anda belum menambahkan produk apapun. Jelajahi produk kami untuk menemukan yang Anda suka!',
    'cart.startShopping': 'Mulai Belanja',
    'cart.orderSummary': 'Ringkasan Pesanan',
    'cart.subtotal': 'Subtotal',
    'cart.orderTotal': 'Total Pesanan',
    'cart.checkout': 'Pembayaran',
    'cart.shippingNote': 'Ongkos kirim dan pajak dihitung saat pembayaran.',
    'cart.defaultVariant': 'Varian Standar',

    // Footer
    'footer.shop': 'Belanja',
    'footer.allProducts': 'Semua Produk',
    'footer.newArrivals': 'Produk Baru',
    'footer.categories': 'Kategori',
    'footer.support': 'Dukungan',
    'footer.faq': 'FAQ',
    'footer.shipping': 'Pengiriman & Pengembalian',
    'footer.contact': 'Hubungi Kami',
    'footer.stayUpdated': 'Tetap Terhubung',
    'footer.newsletter': 'Berlangganan newsletter kami untuk akses awal ke koleksi terbaru dan penawaran eksklusif.',
    'footer.emailPlaceholder': 'Masukkan email Anda',
    'footer.subscribe': 'Berlangganan',
    'footer.rights': 'Hak cipta dilindungi.',
    'footer.tagline': 'Pakaian premium yang dirancang untuk mereka yang berani memimpin. Kualitas, performa, dan gaya di setiap jahitan.',

    // Product
    'product.addToCart': 'Tambah ke Keranjang',
    'product.buyNow': 'Beli Sekarang',
    'product.outOfStock': 'Stok Habis',
    'product.quantity': 'Jumlah',
    'product.variant': 'Varian',
    'product.description': 'Deskripsi',
    'product.reviews': 'Ulasan',

    // General
    'general.loading': 'Memuat...',
    'general.error': 'Terjadi kesalahan',
    'general.language': 'Bahasa',
  },
  en: {
    // Header / Nav
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.categories': 'Categories',
    'nav.about': 'About',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your Cart is Empty',
    'cart.emptyDesc': "Looks like you haven't added anything to your cart yet. Browse our products to find something you like!",
    'cart.startShopping': 'Start Shopping',
    'cart.orderSummary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.orderTotal': 'Order Total',
    'cart.checkout': 'Checkout',
    'cart.shippingNote': 'Shipping and taxes calculated at checkout.',
    'cart.defaultVariant': 'Default Variant',

    // Footer
    'footer.shop': 'Shop',
    'footer.allProducts': 'All Products',
    'footer.newArrivals': 'New Arrivals',
    'footer.categories': 'Categories',
    'footer.support': 'Support',
    'footer.faq': 'FAQ',
    'footer.shipping': 'Shipping & Returns',
    'footer.contact': 'Contact Us',
    'footer.stayUpdated': 'Stay Updated',
    'footer.newsletter': 'Subscribe to our newsletter for early access to new drops and exclusive offers.',
    'footer.emailPlaceholder': 'Enter your email',
    'footer.subscribe': 'Subscribe',
    'footer.rights': 'All rights reserved.',
    'footer.tagline': 'Premium apparel designed for those who dare to lead. Quality, performance, and style in every stitch.',

    // Product
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.outOfStock': 'Out of Stock',
    'product.quantity': 'Quantity',
    'product.variant': 'Variant',
    'product.description': 'Description',
    'product.reviews': 'Reviews',

    // General
    'general.loading': 'Loading...',
    'general.error': 'An error occurred',
    'general.language': 'Language',
  },
}
