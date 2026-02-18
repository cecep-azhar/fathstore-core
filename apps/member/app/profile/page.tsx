'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useLanguage } from '@/context/LanguageContext'
import { Plus, Edit2, Trash2, MapPin, Check, Phone, Mail, User as UserIcon, LogOut } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

interface Address {
  id?: string
  label: string
  recipient?: string // mapped from fullName in schema? schema uses fullName inside address array
  fullName: string
  phone?: string
  street: string
  city: string
  province: string
  postalCode: string
  isDefault?: boolean
}

export default function ProfilePage() {
  const { user, token, logout, login } = useAuth() // login needed? no. verify user update?
  // We need a way to refresh user data after update. 
  // AuthProvider fetchUser updates state. We can re-fetch?
  // AuthContext doesn't expose strict re-fetch, but if we call an API, we can manually update local user state if we want,
  // OR we can trigger a re-fetch if we expose it.
  // Actually, AuthProvider exposes `user` and `token`. 
  // If I update user via API, I should update the context.
  // But context update requires `fetchUser` or `setUser`. 
  // Current AuthContext `setUser` is internal.
  // I might need to reload the page or add `refreshUser` to context?
  // Or just rely on `router.refresh()`? 
  // Let's assume I can hack it by `window.location.reload()` for now or adding `refreshUser` in next step if needed.
  // Actually, checking AuthProvider... it handles `fetchUser` internally.
  // If I update `user`, I should probably reload to see changes if I don't have setData.
  
  const { t } = useLanguage()
  
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Address State
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null)
  
  // Address Form State
  const [addressForm, setAddressForm] = useState<Address>({
      label: 'Home',
      fullName: '',
      phone: '',
      street: '',
      city: '',
      province: '',
      postalCode: '',
      isDefault: false
  })

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
    }
  }, [user])

  const handleSaveProfile = async () => {
    setIsLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.errors?.[0]?.message || `Status ${res.status}`)
      }
      
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' })
      // Reload to update context
      window.location.reload()
      
    } catch (error: any) {
       console.error(error)
       setMessage({ type: 'error', text: `Gagal: ${error.message}` })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Construct new addresses array
    let newAddresses = [...(user?.addresses || [])]
    
    // Ensure shape matches Payload expected (fullName not recipient? Check Schema)
    // Schema in Users.ts: 
    // fields: [ {name: 'label'}, {name: 'fullName'}, {name: 'street'} ... ]
    
    const addressData = {
        label: addressForm.label,
        fullName: addressForm.fullName,
        phone: addressForm.phone,
        street: addressForm.street,
        city: addressForm.city,
        province: addressForm.province,
        postalCode: addressForm.postalCode,
        isDefault: addressForm.isDefault
    }

    if (editingAddressIndex !== null) {
        newAddresses[editingAddressIndex] = { ...newAddresses[editingAddressIndex], ...addressData }
    } else {
        newAddresses.push(addressData)
    }
    
    // If set to default, unset others?
    if (addressForm.isDefault) {
        newAddresses = newAddresses.map((addr, idx) => {
            if (editingAddressIndex !== null && idx === editingAddressIndex) return addr
            if (editingAddressIndex === null && idx === newAddresses.length - 1) return addr
            return { ...addr, isDefault: false }
        })
    }

    try {
        const res = await fetch(`${API_URL}/api/users/me`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ addresses: newAddresses }),
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.errors?.[0]?.message || `Status ${res.status}`)
        }

        setMessage({ type: 'success', text: 'Alamat berhasil disimpan!' })
        setIsAddingAddress(false)
        setEditingAddressIndex(null)
        window.location.reload()
    } catch (error: any) {
        console.error(error)
        setMessage({ type: 'error', text: `Gagal: ${error.message}` })
    } finally {
        setIsLoading(false)
    }
  }

  const handleDeleteAddress = async (index: number) => {
      if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return
      
      setIsLoading(true)
      const newAddresses = [...(user?.addresses || [])].filter((_, i) => i !== index)
      
      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ addresses: newAddresses }),
        })

        if (!res.ok) throw new Error('Failed to delete address')
        window.location.reload()
      } catch (error) {
          alert('Gagal menghapus alamat')
      } finally {
          setIsLoading(false)
      }
  }

  const resetForm = () => {
      setAddressForm({
        label: 'Home',
        fullName: user?.name || '',
        phone: user?.phone || '',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        isDefault: false
      })
  }

  const startEdit = (index: number) => {
      const addr = user?.addresses?.[index]
      if (addr) {
          setAddressForm({
              label: addr.label,
              fullName: addr.fullName,
              phone: addr.phone || '',
              street: addr.street,
              city: addr.city,
              province: addr.province,
              postalCode: addr.postalCode,
              isDefault: addr.isDefault || false
          })
          setEditingAddressIndex(index)
          setIsAddingAddress(true)
      }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{t('profile.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('profile.desc')}</p>
      </div>

      {message && (
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
          </div>
      )}

      {/* Personal Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <UserIcon className="w-5 h-5 text-emerald-600" />
            {t('profile.personalInfo')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.name')}</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm dark:bg-gray-700 dark:text-white"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.email')}</label>
            <div className="relative">
                <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            </div>
            <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.phone')}</label>
            <div className="relative">
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08..."
                    className="w-full pl-10 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm dark:bg-gray-700 dark:text-white"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Digunakan untuk konfirmasi pesanan via WhatsApp.</p>
            </div>
        </div>
        
        <div className="mt-6 flex justify-end">
            <button 
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
                {isLoading ? t('general.loading') : t('profile.save')}
            </button>
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPin className="w-5 h-5 text-emerald-600" />
                {t('profile.addresses')}
            </h2>
            {!isAddingAddress && (
                <button 
                    onClick={() => { resetForm(); setIsAddingAddress(true); setEditingAddressIndex(null); }}
                    className="flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                >
                    <Plus className="w-4 h-4" />
                    {t('profile.addAddress')}
                </button>
            )}
        </div>

        {isAddingAddress ? (
            <form onSubmit={handleAddressSubmit} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 animate-fadeIn">
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">{editingAddressIndex !== null ? t('address.editTitle') : t('address.addTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t('address.label')}</label>
                        <select 
                            value={addressForm.label}
                            onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                            className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        >
                            <option value="Home">Home (Rumah)</option>
                            <option value="Office">Office (Kantor)</option>
                            <option value="Other">Other (Lainnya)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t('address.recipient')}</label>
                        <input type="text" required value={addressForm.fullName} onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t('address.phone')}</label>
                        <input type="tel" required value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t('address.street')}</label>
                        <textarea required value={addressForm.street} onChange={(e) => setAddressForm({...addressForm, street: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white" rows={2} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t('address.city')}</label>
                        <input type="text" required value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t('address.province')}</label>
                        <input type="text" required value={addressForm.province} onChange={(e) => setAddressForm({...addressForm, province: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t('address.postalCode')}</label>
                        <input type="text" required value={addressForm.postalCode} onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="isDefault" 
                            checked={addressForm.isDefault} 
                            onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="isDefault" className="text-sm dark:text-gray-300">{t('profile.setDefault')}</label>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setIsAddingAddress(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800">{t('address.cancel')}</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:opacity-50">{t('address.save')}</button>
                </div>
            </form>
        ) : (
            <div className="space-y-4">
                {user?.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((addr: any, idx: number) => (
                        <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-start hover:shadow-md transition-shadow">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900 dark:text-white">{addr.label}</span>
                                    {addr.isDefault && (
                                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">{t('profile.default')}</span>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{addr.fullName} <span className="text-gray-400">|</span> {addr.phone}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {addr.street}, {addr.city}, {addr.province} {addr.postalCode}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(idx)} className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteAddress(idx)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 rounded-lg">
                        {t('profile.noAddresses')}
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Logout */}
         <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 font-semibold py-3 px-6 rounded-xl transition-colors border border-red-200 dark:border-red-800"
            >
            <LogOut className="w-5 h-5" />
            {t('profile.logout')}
            </button>
        </div>
    </div>
  )
}
