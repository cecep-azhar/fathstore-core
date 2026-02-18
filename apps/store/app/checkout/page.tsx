'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { createOrder } from '@/lib/payload'
import { ChevronRight, CreditCard, MapPin, Truck, CheckCircle, AlertCircle } from 'lucide-react'

export default function CheckoutPage() {
  const { user, token, isLoading: authLoading } = useAuth()
  const { items, cartCount, clearCart } = useCart()
  const { t } = useLanguage()
  const router = useRouter()

  const [step, setStep] = useState<'address' | 'shipping' | 'payment'>('address')
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null)
  const [shippingMethod, setShippingMethod] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not logged in or empty cart
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(process.env.NEXT_PUBLIC_MEMBER_URL ? `${process.env.NEXT_PUBLIC_MEMBER_URL}/login` : '/login')
    } else if (!authLoading && user && items.length === 0) {
      router.push('/cart')
    }
  }, [user, items, authLoading, router])

  // Select default address if available
  useEffect(() => {
    if (user?.addresses?.length > 0 && selectedAddressIndex === null) {
      const defaultIndex = user.addresses.findIndex((a: any) => a.isDefault)
      setSelectedAddressIndex(defaultIndex >= 0 ? defaultIndex : 0)
    }
  }, [user, selectedAddressIndex])

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingCost = shippingMethod ? 15000 : 0 // Flat rate example
  const total = subtotal + shippingCost

  const handleCreateOrder = async () => {
    if (!user || selectedAddressIndex === null || !paymentMethod || !shippingMethod) {
      setError('Please complete all steps.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const address = user.addresses[selectedAddressIndex]
      
      const orderData = {
        customer: user.id,
        items: items.map(item => ({
          product: item.productId,
          productTitle: item.title,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          // image: item.thumbnailId // If existed
        })),
        subtotal,
        total,
        shippingCost,
        shippingAddress: {
          fullName: address.fullName,
          street: address.street,
          city: address.city,
          province: address.province,
          postalCode: address.postalCode,
          phone: address.phone,
          country: address.country || 'Indonesia'
        },
        shippingCarrier: shippingMethod,
        paymentMethod,
        paymentStatus: 'pending', // Initial status
        fulfillmentStatus: 'unfulfilled'
      }

      const res = await createOrder(orderData, token!)
      clearCart()
      router.push(`/payment/success?orderId=${res.doc.id}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to create order.')
      setIsSubmitting(false)
    }
  }

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 dark:text-gray-100">Checkout</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Address */}
            <div className={`bg-white rounded-lg shadow p-6 ${step !== 'address' && 'opacity-60 pointer-events-none'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Shipping Address
                </h2>
                {step !== 'address' && selectedAddressIndex !== null && (
                  <button onClick={() => setStep('address')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Edit</button>
                )}
              </div>
              
              {step === 'address' && (
                <div className="space-y-4">
                  {user.addresses?.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {user.addresses.map((addr: any, idx: number) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedAddressIndex(idx)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{addr.label}</span>
                            {addr.isDefault && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Default</span>}
                          </div>
                          <p className="text-sm font-medium">{addr.fullName}</p>
                          <p className="text-sm text-gray-600">{addr.street}</p>
                          <p className="text-sm text-gray-600">{addr.city}, {addr.province} {addr.postalCode}</p>
                          <p className="text-sm text-gray-600">{addr.phone}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-4">You don't have any saved addresses.</p>
                      <a href={`${process.env.NEXT_PUBLIC_MEMBER_URL}/profile`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700">
                        Add Address in Profile
                      </a>
                    </div>
                  )}

                  {user.addresses?.length > 0 && (
                    <button 
                      onClick={() => setStep('shipping')}
                      disabled={selectedAddressIndex === null}
                      className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Continue to Shipping
                    </button>
                  )}
                </div>
              )}
               {step !== 'address' && selectedAddressIndex !== null && (
                 <div className="text-sm text-gray-600">
                    <p className="font-medium">{user.addresses[selectedAddressIndex].fullName}</p>
                    <p>{user.addresses[selectedAddressIndex].street}, {user.addresses[selectedAddressIndex].city}</p>
                 </div>
               )}
            </div>

            {/* Step 2: Shipping Method */}
            <div className={`bg-white rounded-lg shadow p-6 ${step !== 'shipping' && 'opacity-60 pointer-events-none'}`}>
               <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  Shipping Method
                </h2>
                {step === 'payment' && (
                   <button onClick={() => setStep('shipping')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Edit</button>
                )}
              </div>

              {step === 'shipping' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                     <label className={`block border p-4 rounded-lg cursor-pointer flex justify-between items-center ${shippingMethod === 'JNE' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                           <input type="radio" name="shipping" value="JNE" checked={shippingMethod === 'JNE'} onChange={(e) => setShippingMethod(e.target.value)} className="text-emerald-600 focus:ring-emerald-500" />
                           <span className="font-medium">JNE Regular</span>
                        </div>
                        <span className="font-bold">Rp 15.000</span>
                     </label>
                     <label className={`block border p-4 rounded-lg cursor-pointer flex justify-between items-center ${shippingMethod === 'JNT' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                           <input type="radio" name="shipping" value="JNT" checked={shippingMethod === 'JNT'} onChange={(e) => setShippingMethod(e.target.value)} className="text-emerald-600 focus:ring-emerald-500" />
                           <span className="font-medium">J&T Express</span>
                        </div>
                        <span className="font-bold">Rp 15.000</span>
                     </label>
                  </div>
                  <button 
                      onClick={() => setStep('payment')}
                      disabled={!shippingMethod}
                      className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                      Continue to Payment
                  </button>
                </div>
              )}
              {step === 'payment' && shippingMethod && (
                 <p className="text-sm text-gray-600">{shippingMethod} Regular - Rp 15.000</p>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className={`bg-white rounded-lg shadow p-6 ${step !== 'payment' && 'opacity-60 pointer-events-none'}`}>
              <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Payment Method
              </h2>
              
              {step === 'payment' && (
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className={`block border p-4 rounded-lg cursor-pointer flex items-center gap-3 ${paymentMethod === 'bank_transfer' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                           <input type="radio" name="payment" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-emerald-600 focus:ring-emerald-500" />
                           <div>
                              <span className="block font-medium">Bank Transfer (Manual)</span>
                              <span className="text-sm text-gray-500">Upload proof of payment after checkout</span>
                           </div>
                       </label>
                       <label className={`block border p-4 rounded-lg cursor-pointer flex items-center gap-3 ${paymentMethod === 'qris' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                           <input type="radio" name="payment" value="qris" checked={paymentMethod === 'qris'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-emerald-600 focus:ring-emerald-500" />
                           <div>
                              <span className="block font-medium">QRIS</span>
                              <span className="text-sm text-gray-500">Scan QR code to pay instantly</span>
                           </div>
                       </label>
                    </div>
                 </div>
              )}
            </div>

          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
             <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="flow-root">
                   <ul className="-my-4 divide-y divide-gray-200">
                      {items.map((item) => (
                         <li key={item.cartId} className="flex py-4">
                            <div className="flex-1 flex flex-col">
                               <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.title}</h3>
                                  <p className="ml-4">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                               </div>
                               <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                            </div>
                         </li>
                      ))}
                   </ul>
                </div>
                
                <dl className="border-t border-gray-200 pt-4 mt-6 space-y-2">
                   <div className="flex items-center justify-between text-sm text-gray-600">
                      <dt>Subtotal</dt>
                      <dd>Rp {subtotal.toLocaleString('id-ID')}</dd>
                   </div>
                   <div className="flex items-center justify-between text-sm text-gray-600">
                      <dt>Shipping</dt>
                      <dd>Rp {shippingCost.toLocaleString('id-ID')}</dd>
                   </div>
                   <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-base font-bold text-gray-900">
                      <dt>Total</dt>
                      <dd>Rp {total.toLocaleString('id-ID')}</dd>
                   </div>
                </dl>

                {error && (
                   <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{error}</span>
                   </div>
                )}

                <button
                   onClick={handleCreateOrder}
                   disabled={isSubmitting || step !== 'payment' || !paymentMethod}
                   className="mt-6 w-full bg-emerald-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                   {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
                <p className="mt-4 text-xs text-gray-500 text-center">
                   By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
