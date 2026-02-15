
import React from 'react';

export default function CartPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center py-20">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
        🛒
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Looks like you haven't added anything to your cart yet. Browse our products to find something you like!
      </p>
      <a 
        href="/products" 
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
      >
        Browse Products
      </a>
    </div>
  );
}
