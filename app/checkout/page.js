'use client'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  MapPin, Phone, User, Mail, Calendar,
  Shield, Truck, Lock, Tag, ShoppingBag,
  CheckCircle, Plus, ChevronDown, ChevronUp, Home, Briefcase
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const LABEL_ICONS = { Home: Home, Office: Briefcase, Other: MapPin }

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user, profile } = useAuth()
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [saveThisAddress, setSaveThisAddress] = useState(false)
  const [addressesLoading, setAddressesLoading] = useState(false)

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address: '', city: '', state: '', pincode: '', booking_date: '',
  })

  useEffect(() => { setMounted(true) }, [])

  // Redirect if cart empty
  useEffect(() => {
    if (mounted && items.length === 0) router.push('/cart')
  }, [items, mounted, router])

  // Pre-fill personal info from profile
  useEffect(() => {
    if (profile || user) {
      setForm(f => ({
        ...f,
        name: profile?.full_name || '',
        phone: profile?.phone || '',
        email: user?.email || '',
      }))
    }
  }, [profile, user])

  // Load saved addresses for logged-in users
  useEffect(() => {
    if (user) {
      loadAddresses()
    } else {
      setShowNewForm(true)
    }
  }, [user])

  const loadAddresses = async () => {
    setAddressesLoading(true)
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })
    setSavedAddresses(data || [])
    // Auto-select default address
    const def = (data || []).find(a => a.is_default)
    if (def) {
      setSelectedAddressId(def.id)
      fillFormFromAddress(def)
      setShowNewForm(false)
    } else if ((data || []).length === 0) {
      setShowNewForm(true)
    }
    setAddressesLoading(false)
  }

  const fillFormFromAddress = (addr) => {
    setForm(f => ({
      ...f,
      name: addr.full_name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    }))
  }

  const selectAddress = (addr) => {
    setSelectedAddressId(addr.id)
    fillFormFromAddress(addr)
    setShowNewForm(false)
  }

  const handleAddNew = () => {
    setSelectedAddressId(null)
    setForm(f => ({
      ...f,
      address: '', city: '', state: '', pincode: '',
      name: profile?.full_name || '',
      phone: profile?.phone || '',
    }))
    setShowNewForm(true)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const total = mounted ? getTotalPrice() : 0
  const shipping = total >= 499 ? 0 : 0
  const grandTotal = total + shipping
  const codAvailable = grandTotal >= 999

  const validate = () => {
    if (!form.name.trim()) { toast.error('Please enter your name'); return false }
    if (!form.phone.trim() || form.phone.length < 10) { toast.error('Enter valid 10-digit phone number'); return false }
    if (!form.address.trim()) { toast.error('Please enter your address'); return false }
    if (!form.city.trim()) { toast.error('Please enter your city'); return false }
    if (!form.state.trim()) { toast.error('Please enter your state'); return false }
    if (!form.pincode.trim() || form.pincode.length !== 6) { toast.error('Enter valid 6-digit pincode'); return false }
    return true
  }

  const saveAddressIfNeeded = async () => {
    if (!user || !saveThisAddress || selectedAddressId) return
    try {
      await supabase.from('addresses').insert({
        user_id: user.id,
        label: 'Home',
        full_name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        is_default: savedAddresses.length === 0,
      })
    } catch (err) {
      console.error('Failed to save address:', err)
    }
  }

  const handleRazorpay = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      })
      const { orderId, error } = await res.json()
      if (error) throw new Error(error)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(grandTotal * 100),
        currency: 'INR',
        name: 'Shrilekha Mehndi Art',
        description: `Order for ${form.name}`,
        order_id: orderId,
        prefill: { name: form.name, email: form.email, contact: `+91${form.phone}` },
        theme: { color: '#0f1a0e' },
        handler: async (response) => {
          try {
            await saveAddressIfNeeded()
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer: form,
                items: items.map(i => ({
                  id: i.id, name: i.name, price: i.price,
                  quantity: i.quantity, image_url: i.image_url || null,
                })),
                subtotal: total,
                shipping,
                total: grandTotal,
                user_id: user?.id || null,
              }),
            })
            const { orderId: savedId, error: verifyError } = await verifyRes.json()
            if (verifyError) {
              toast.error(verifyError, { duration: 8000 })
              return
            }
            clearCart()
            toast.success('Order placed successfully!')
            router.push(`/order-confirmation/${savedId}`)
          } catch (err) {
            toast.error('Payment done but order save failed. WhatsApp us at +91 96237 40541')
          }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`)
      })
      rzp.open()
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    }
    setLoading(false)
  }

  const handleCOD = async () => {
    setLoading(true)
    try {
      await saveAddressIfNeeded()
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cod: true,
          customer: form,
          items: items.map(i => ({
            id: i.id, name: i.name, price: i.price,
            quantity: i.quantity, image_url: i.image_url || null,
          })),
          subtotal: total,
          shipping,
          total: grandTotal,
          user_id: user?.id || null,
        }),
      })
      const { orderId, error } = await res.json()
      if (error) throw new Error(error)
      clearCart()
      toast.success('Order placed! Pay on delivery.')
      router.push(`/order-confirmation/${orderId}`)
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    }
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    if (paymentMethod === 'razorpay') handleRazorpay()
    else handleCOD()
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin border-[#c9a84c]" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-black/10" />
          <p className="font-black text-black mb-4 uppercase tracking-widest">Cart is empty</p>
          <Link href="/products" className="btn-primary text-sm">Browse Products</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <div className="min-h-screen bg-white">

        {/* Header */}
        <div className="px-4 pt-8 pb-4 text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">Checkout</h1>
          <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: '#c9a84c' }}>
            Secure • Fast • Easy
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ===== LEFT: Forms ===== */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Personal info */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
                <div className="px-5 py-3.5 flex items-center gap-2 border-b border-gray-50 bg-gray-50/50">
                  <User size={14} style={{ color: '#c9a84c' }} />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                    Personal Details
                  </p>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">Full Name *</label>
                    <input className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#c9a84c]/20" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Priya Sharma" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">Phone *</label>
                    <input className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#c9a84c]/20" type="tel" value={form.phone}
                      onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210" maxLength={10} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">Email (for order updates)</label>
                    <input className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#c9a84c]/20" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>
              </div>

              {/* ===== DELIVERY ADDRESS ===== */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
                <div className="px-5 py-3.5 flex items-center gap-2 border-b border-gray-50 bg-gray-50/50">
                  <MapPin size={14} style={{ color: '#c9a84c' }} />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                    Delivery Address
                  </p>
                </div>

                <div className="p-5">
                  {/* Saved addresses */}
                  {user && (
                    <div className="mb-5">
                      {addressesLoading ? (
                        <div className="h-12 rounded-xl animate-pulse bg-gray-50" />
                      ) : savedAddresses.length > 0 ? (
                        <>
                          <p className="text-xs font-black uppercase tracking-widest mb-3 text-gray-400">
                            Saved Addresses
                          </p>
                          <div className="flex flex-col gap-3 mb-3">
                            {savedAddresses.map(addr => {
                              const LabelIcon = LABEL_ICONS[addr.label] || MapPin
                              const isSelected = selectedAddressId === addr.id
                              return (
                                <button key={addr.id} type="button"
                                  onClick={() => selectAddress(addr)}
                                  className="flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all"
                                  style={{
                                    borderColor: isSelected ? '#0f1a0e' : '#f3f4f6',
                                    backgroundColor: isSelected ? '#fafafa' : 'white',
                                  }}>
                                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ borderColor: isSelected ? '#0f1a0e' : '#d1d5db' }}>
                                    {isSelected && (
                                      <div className="w-2 h-2 rounded-full bg-[#0f1a0e]" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <LabelIcon size={12} style={{ color: '#c9a84c' }} />
                                      <span className="text-xs font-black uppercase tracking-wider text-black">
                                        {addr.label}
                                      </span>
                                      {addr.is_default && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-100 text-green-700">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm font-semibold text-black">{addr.full_name}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                      {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">📞 {addr.phone}</p>
                                  </div>
                                </button>
                              )
                            })}
                          </div>

                          <button type="button" onClick={() => showNewForm ? setShowNewForm(false) : handleAddNew()}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl border-2 border-dashed w-full justify-center transition-all bg-white hover:bg-gray-50"
                            style={{
                              borderColor: showNewForm ? '#0f1a0e' : '#e5e7eb',
                              color: showNewForm ? '#0f1a0e' : '#9ca3af',
                            }}>
                            <Plus size={13} /> {showNewForm ? 'Cancel new address' : 'Add new address'}
                          </button>
                        </>
                      ) : null}
                    </div>
                  )}

                  {(showNewForm || !user) && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">Full Address *</label>
                        <textarea className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#c9a84c]/20" value={form.address} onChange={e => set('address', e.target.value)}
                          placeholder="House/flat no, street, area, landmark..." rows={3} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">City *</label>
                          <input className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Pune" />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">State *</label>
                          <input className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" value={form.state} onChange={e => set('state', e.target.value)} placeholder="Maharashtra" />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">Pincode *</label>
                          <input className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" value={form.pincode}
                            onChange={e => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="411001" maxLength={6} />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">
                            <Calendar size={11} className="inline mr-1" />Preferred Date
                          </label>
                          <input className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" type="date" value={form.booking_date}
                            onChange={e => set('booking_date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]} />
                        </div>
                      </div>

                      {user && (
                        <label className="flex items-center gap-2.5 cursor-pointer mt-2">
                          <input type="checkbox" checked={saveThisAddress}
                            onChange={e => setSaveThisAddress(e.target.checked)} className="rounded border-gray-300 text-[#0f1a0e] focus:ring-[#0f1a0e]" />
                          <span className="text-xs font-bold text-gray-500">
                            Save this address for future orders
                          </span>
                        </label>
                      )}
                    </div>
                  )}

                  {!showNewForm && selectedAddressId && (
                    <div className="mt-4">
                      <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">
                        <Calendar size={11} className="inline mr-1" />Preferred Delivery Date
                      </label>
                      <input className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" type="date" value={form.booking_date}
                        onChange={e => set('booking_date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]} />
                    </div>
                  )}
                </div>
              </div>

              {/* Payment method */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
                <div className="px-5 py-3.5 flex items-center gap-2 border-b border-gray-50 bg-gray-50/50">
                  <Lock size={14} style={{ color: '#c9a84c' }} />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                    Payment Method
                  </p>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <label className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                    style={{
                      borderColor: paymentMethod === 'razorpay' ? '#0f1a0e' : '#f3f4f6',
                      backgroundColor: paymentMethod === 'razorpay' ? '#fafafa' : 'white',
                    }}>
                    <input type="radio" name="payment" value="razorpay"
                      checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="mt-1 text-[#0f1a0e] focus:ring-[#0f1a0e]" />
                    <div className="flex-1">
                      <p className="text-sm font-black text-black">Pay Online</p>
                      <p className="text-xs text-gray-500 mt-0.5">UPI, Cards, Net Banking via Razorpay</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {['UPI', 'GPay', 'PhonePe', 'Card', 'Net Banking'].map(m => (
                          <span key={m} className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">{m}</span>
                        ))}
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${codAvailable ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
                    style={{
                      borderColor: paymentMethod === 'cod' ? '#0f1a0e' : '#f3f4f6',
                      backgroundColor: paymentMethod === 'cod' ? '#fafafa' : 'white',
                    }}>
                    <input type="radio" name="payment" value="cod" disabled={!codAvailable}
                      checked={paymentMethod === 'cod'} onChange={() => codAvailable && setPaymentMethod('cod')} className="mt-1 text-[#0f1a0e] focus:ring-[#0f1a0e]" />
                    <div>
                      <p className="text-sm font-black text-black">Cash on Delivery</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {codAvailable ? 'Pay when your order arrives' : 'Available on orders above ₹999'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* ===== RIGHT: Order summary ===== */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-gray-100 overflow-hidden lg:sticky lg:top-24 bg-white shadow-lg">
                <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500">Order Summary</p>
                </div>
                <div className="p-5">
                  <div className="flex flex-col gap-3 mb-6 max-h-60 overflow-y-auto pr-1">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between gap-4">
                        <span className="text-xs text-black font-medium leading-tight">
                          {item.name} <span className="text-gray-400">× {item.quantity}</span>
                        </span>
                        <span className="text-xs font-black text-[#c9a84c] flex-shrink-0">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 pt-4 border-t border-gray-50">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-black">₹{total.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-black font-medium'}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <div className="flex items-start gap-2 p-2.5 rounded-xl text-[10px] bg-amber-50 text-amber-700 font-bold border border-amber-100/50">
                        <Tag size={12} className="flex-shrink-0" />
                        Add ₹{(499 - total).toFixed(0)} more for free shipping
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                      <span className="font-black text-xs uppercase tracking-widest text-black">Total Amount</span>
                      <span className="font-black text-lg text-[#c9a84c]">₹{grandTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] mb-4 shadow-xl shadow-black/10"
                    style={{ backgroundColor: loading ? '#9ca3af' : '#0f1a0e' }}>
                    {loading ? (
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : paymentMethod === 'razorpay' ? `🔒 Pay ₹${grandTotal.toFixed(0)}` : 'Place COD Order'}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    <Shield size={12} className="text-green-500" /> 100% Secured by Razorpay
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </>
  )
}