'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/providers/CurrencyProvider'
import { createOrder } from '@/lib/payload'
import { ChevronRight, CreditCard, MapPin, Truck, CheckCircle, AlertCircle, Plus } from 'lucide-react'

// Hardcoded rates for frontend submission (ideally fetched from /api/globals/settings)
const RATES: Record<string, number> = { SGD: 1, IDR: 11500, USD: 0.75 }

export default function CheckoutPage() {
  const { user, token, isLoading: authLoading } = useAuth() as { user: any, token: string | null, isLoading: boolean }
  const { items, cartCount, clearCart } = useCart()
  const { t } = useLanguage()
  const { activeCurrency, formatPrice } = useCurrency()
  const router = useRouter()

  const [step, setStep] = useState<'address' | 'shipping' | 'payment'>('address')
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null)
  const [shippingMethod, setShippingMethod] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // New Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', street: '', province: '', city: '', district: '', subdistrict: '', postalCode: '', country: 'Singapore'
  })

  // Cascading Location State
  const [provinces, setProvinces] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [subdistricts, setSubdistricts] = useState<any[]>([])

  const [selectedProvinceId, setSelectedProvinceId] = useState('')
  const [selectedCityId, setSelectedCityId] = useState('')
  const [selectedDistrictId, setSelectedDistrictId] = useState('')

  // Fetch initial provinces — uses store's own proxy route to avoid CORS issues
  useEffect(() => {
    if (isAddingAddress && provinces.length === 0) {
      fetch('/api/locations/provinces?limit=200')
        .then(res => res.json())
        .then(data => setProvinces(data.docs || []))
        .catch(console.error)
    }
  }, [isAddingAddress])

  // Fetch cities when province changes
  useEffect(() => {
    if (selectedProvinceId) {
      fetch(`/api/locations/cities?where[province][equals]=${selectedProvinceId}&limit=200`)
        .then(res => res.json())
        .then(data => setCities(data.docs || []))
        .catch(console.error)
    } else {
      setCities([])
    }
    setSelectedCityId('')
    setSelectedDistrictId('')
    setNewAddress(p => ({ ...p, city: '', district: '', subdistrict: '', postalCode: '' }))
  }, [selectedProvinceId])

  // Fetch districts when city changes
  useEffect(() => {
    if (selectedCityId) {
      fetch(`/api/locations/districts?where[city][equals]=${selectedCityId}&limit=200`)
        .then(res => res.json())
        .then(data => setDistricts(data.docs || []))
        .catch(console.error)
    } else {
      setDistricts([])
    }
    setSelectedDistrictId('')
    setNewAddress(p => ({ ...p, district: '', subdistrict: '', postalCode: '' }))
  }, [selectedCityId])

  // Fetch subdistricts when district changes
  useEffect(() => {
    if (selectedDistrictId) {
      fetch(`/api/locations/subdistricts?where[district][equals]=${selectedDistrictId}&limit=200`)
        .then(res => res.json())
        .then(data => setSubdistricts(data.docs || []))
        .catch(console.error)
    } else {
      setSubdistricts([])
    }
    setNewAddress(p => ({ ...p, subdistrict: '', postalCode: '' }))
  }, [selectedDistrictId])

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
  
  // Base shipping cost in SGD (Singapore Dollar) by default
  const shippingCost = shippingMethod ? 15 : 0 
  const total = subtotal + shippingCost

  const handleCreateOrder = async () => {
    if (!user || selectedAddressIndex === null || !paymentMethod || !shippingMethod) {
      setError('Please complete all steps.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const address = selectedAddressIndex === -1 ? newAddress : user.addresses[selectedAddressIndex]
      
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
          fullName: address.fullName || newAddress.fullName,
          street: address.street || newAddress.street,
          city: address.city || newAddress.city,
          district: address.district || newAddress.district,
          subdistrict: address.subdistrict || newAddress.subdistrict,
          province: address.province || newAddress.province,
          postalCode: address.postalCode || newAddress.postalCode,
          phone: address.phone || newAddress.phone,
          country: address.country || newAddress.country || 'Singapore'
        },
        shippingCarrier: shippingMethod,
        paymentMethod,
        checkoutCurrency: activeCurrency,
        exchangeRateAtCheckout: RATES[activeCurrency] || 1,
        paymentStatus: 'pending', // Initial status
        fulfillmentStatus: 'unfulfilled'
      }

      const res = await createOrder(orderData, token!)
      clearCart()
      router.push(`/success?orderId=${res.doc.id}&method=${encodeURIComponent(paymentMethod)}`)
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
                  {isAddingAddress ? (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <h3 className="font-semibold text-gray-900">Add New Address</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                         <input type="text" placeholder="Full Name" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} className="border-gray-300 rounded-md focus:ring-emerald-500" />
                         <input type="text" placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="border-gray-300 rounded-md focus:ring-emerald-500" />
                         <select aria-label="Country" className="border-gray-300 rounded-md focus:ring-emerald-500" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})}>
                            <option value="Singapore">Singapore</option>
                            <option value="Indonesia">Indonesia</option>
                         </select>
                         
                         <select 
                            aria-label="Select Province"
                            className="border-gray-300 rounded-md focus:ring-emerald-500" 
                            value={selectedProvinceId} 
                            onChange={e => {
                               setSelectedProvinceId(e.target.value);
                               setNewAddress({...newAddress, province: e.target.options[e.target.selectedIndex].text});
                            }}
                         >
                            <option value="">Select Province</option>
                            {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                         </select>
                         
                         <select 
                            aria-label="Select City"
                            className="border-gray-300 rounded-md focus:ring-emerald-500 disabled:opacity-50" 
                            value={selectedCityId} 
                            disabled={!selectedProvinceId}
                            onChange={e => {
                               setSelectedCityId(e.target.value);
                               setNewAddress({...newAddress, city: e.target.options[e.target.selectedIndex].text});
                            }}
                         >
                            <option value="">Select City</option>
                            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                         </select>

                         <select 
                            aria-label="Select District"
                            className="border-gray-300 rounded-md focus:ring-emerald-500 disabled:opacity-50" 
                            value={selectedDistrictId} 
                            disabled={!selectedCityId}
                            onChange={e => {
                               setSelectedDistrictId(e.target.value);
                               setNewAddress({...newAddress, district: e.target.options[e.target.selectedIndex].text});
                            }}
                         >
                            <option value="">Select District</option>
                            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                         </select>

                         <select 
                            aria-label="Select Subdistrict"
                            className="border-gray-300 rounded-md focus:ring-emerald-500 disabled:opacity-50" 
                            value={newAddress.subdistrict} 
                            disabled={!selectedDistrictId}
                            onChange={e => {
                               const selected = subdistricts.find(s => s.name === e.target.value)
                               setNewAddress({
                                 ...newAddress,
                                 subdistrict: e.target.value,
                                 postalCode: selected?.postalCode || newAddress.postalCode,
                               })
                            }}
                         >
                            <option value="">Select Subdistrict</option>
                            {subdistricts.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                         </select>

                         <input type="text" placeholder="Postal Code" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} className="border-gray-300 rounded-md focus:ring-emerald-500" />
                      </div>
                      <textarea placeholder="Street Address (Optional Detail)" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full border-gray-300 rounded-md focus:ring-emerald-500" rows={2}></textarea>
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => {
                            setIsAddingAddress(false)
                            setSelectedAddressIndex(null)
                            setNewAddress({ fullName: '', phone: '', street: '', province: '', city: '', district: '', subdistrict: '', postalCode: '', country: 'Singapore' })
                            setSelectedProvinceId('')
                            setSelectedCityId('')
                            setSelectedDistrictId('')
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (!newAddress.fullName || !newAddress.province) return
                            setSelectedAddressIndex(-1)
                            setIsAddingAddress(false)
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                          disabled={!newAddress.fullName || !newAddress.province}
                        >
                          Use This Address
                        </button>
                      </div>
                    </div>
                  ) : selectedAddressIndex === -1 ? (
                    /* New address selected — show summary */
                    <div className="border border-emerald-600 ring-2 ring-emerald-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> New Address Selected
                        </span>
                        <button
                          onClick={() => setIsAddingAddress(true)}
                          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm font-medium">{newAddress.fullName} · {newAddress.phone}</p>
                      {newAddress.street && <p className="text-sm text-gray-600">{newAddress.street}</p>}
                      <p className="text-sm text-gray-600">
                        {[newAddress.subdistrict, newAddress.district, newAddress.city, newAddress.province].filter(Boolean).join(', ')}
                        {newAddress.postalCode && ` ${newAddress.postalCode}`}
                      </p>
                      <p className="text-sm text-gray-600">{newAddress.country}</p>
                    </div>
                  ) : user.addresses?.length > 0 ? (
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
                      <button onClick={() => setIsAddingAddress(true)} className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="w-4 h-4" /> Add New Address
                      </button>
                    </div>
                  )}

                  {!isAddingAddress && user.addresses?.length > 0 && (
                    <button onClick={() => setIsAddingAddress(true)} className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Another Address
                    </button>
                  )}

                  {selectedAddressIndex !== null && selectedAddressIndex >= -1 && !isAddingAddress && (
                    <button 
                      onClick={() => setStep('shipping')}
                      className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Continue to Shipping
                    </button>
                  )}
                </div>
              )}
               {step !== 'address' && selectedAddressIndex !== null && (
                 <div className="text-sm text-gray-600">
                    <p className="font-medium">{selectedAddressIndex === -1 ? newAddress.fullName : user.addresses[selectedAddressIndex].fullName}</p>
                    <p>{selectedAddressIndex === -1 ? newAddress.street : user.addresses[selectedAddressIndex].street}</p>
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
                     <label className={`border p-4 rounded-lg cursor-pointer flex justify-between items-center ${shippingMethod === 'Flat Rate Int' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                           <input type="radio" name="shipping" value="Flat Rate Int" checked={shippingMethod === 'Flat Rate Int'} onChange={(e) => setShippingMethod(e.target.value)} className="text-emerald-600 focus:ring-emerald-500" />
                           <span className="font-medium">Flat Rate (Singapore/Intl)</span>
                        </div>
                        <span className="font-bold">{formatPrice(15)}</span>
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
                 <p className="text-sm text-gray-600">{shippingMethod} - {formatPrice(15)}</p>
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
                       <label className={`border p-4 rounded-lg cursor-pointer flex items-center gap-3 ${paymentMethod === 'bank_transfer' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                           <input type="radio" name="payment" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-emerald-600 focus:ring-emerald-500" />
                           <div>
                              <span className="font-medium">Bank Transfer (Manual)</span>
                              <span className="text-sm text-gray-500">Upload proof of payment after checkout</span>
                           </div>
                       </label>
                       <label className={`border p-4 rounded-lg cursor-pointer flex items-center gap-3 ${paymentMethod === 'qris' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                           <input type="radio" name="payment" value="qris" checked={paymentMethod === 'qris'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-emerald-600 focus:ring-emerald-500" />
                           <div>
                              <span className="font-medium">QRIS</span>
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
                                  <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
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
                      <dd>{formatPrice(subtotal)}</dd>
                   </div>
                   <div className="flex items-center justify-between text-sm text-gray-600">
                      <dt>Shipping</dt>
                      <dd>{formatPrice(shippingCost)}</dd>
                   </div>
                   <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-base font-bold text-gray-900">
                      <dt>Total</dt>
                      <dd>{formatPrice(total)}</dd>
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
