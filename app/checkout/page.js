'use client'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { MapPin, Phone, User, Mail, Calendar, Shield, Truck, Lock, Tag, ShoppingBag, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && items.length === 0) router.push('/cart')
  }, [items, router, mounted])

  const total = mounted ? getTotalPrice() : 0
  const shipping = total >= 499 ? 0 : 60
  const grandTotal = total + shipping
  const codAvailable = grandTotal >= 999

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address: '', city: '', state: '', pincode: '', booking_date: '',
  })

  useEffect(() => {
    if (profile) {
      setForm(f => ({
        ...f,
        name: profile.full_name || '',
        phone: profile.phone || '',
        email: user?.email || '',
      }))
    }
  }, [profile, user])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    if (!form.name.trim()) { toast.error('Please enter your name'); return false }
    if (!form.phone.trim() || form.phone.length < 10) { toast.error('Enter valid 10-digit phone'); return false }
    if (!form.address.trim()) { toast.error('Please enter your address'); return false }
    if (!form.city.trim()) { toast.error('Please enter your city'); return false }
    if (!form.state.trim()) { toast.error('Please enter your state'); return false }
    if (!form.pincode.trim() || form.pincode.length !== 6) { toast.error('Enter valid 6-digit pincode'); return false }
    return true
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
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#3a5a40' },
        handler: async (response) => {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customer: form,
              items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image_url: i.image_url })),
              subtotal: total,
              shipping,
              total: grandTotal,
              user_id: user?.id || null,
            }),
          })
          const { orderId: savedId, error: verifyError } = await verifyRes.json()
          if (verifyError) { toast.error('Payment verification failed'); return }
          clearCart()
          toast.success('Order placed successfully!')
          router.push(`/order-confirmation/${savedId}`)
        },
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'))
      rzp.open()
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    }
    setLoading(false)
  }

  const handleCOD = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cod: true,
          customer: form,
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image_url: i.image_url })),
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-surface)]">
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin border-[var(--brand-green)]" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--brand-surface)]">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-[var(--brand-muted)]" />
          <p className="font-medium mb-4 text-[var(--brand-text)]">Your cart is empty</p>
          <Link href="/products" className="btn-primary text-sm px-8">Browse Products</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <div className="flex items-center gap-2 mb-6 md:mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <span className="text-[var(--brand-muted)] text-sm">Cart</span>
            <ChevronRight size={14} className="text-[var(--brand-muted)]" />
            <span className="text-[var(--brand-text)] font-semibold text-sm">Checkout</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Forms */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Personal Details */}
              <div className="card p-4 md:p-6 shadow-sm border-[var(--brand-border)]">
                <h2 className="font-semibold mb-5 flex items-center gap-2 text-base text-[var(--brand-text)]">
                  <User size={18} className="text-[var(--brand-green)]" /> Personal Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1.5 text-[var(--brand-text)]">Full Name *</label>
                    <input className="w-full h-11 px-3 border rounded-md" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Priya Sharma" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1.5 text-[var(--brand-text)]">
                      <Phone size={13} className="inline mr-1" />Phone *
                    </label>
                    <input className="w-full h-11 px-3 border rounded-md" type="tel" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="9876543210" maxLength={10} />
                  </div>
                  <div className="sm:col-span-2 flex flex-col">
                    <label className="text-sm font-medium mb-1.5 text-[var(--brand-text)]">
                      <Mail size={13} className="inline mr-1" />Email Address
                    </label>
                    <input className="w-full h-11 px-3 border rounded-md" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="card p-4 md:p-6 shadow-sm border-[var(--brand-border)]">
                <h2 className="font-semibold mb-5 flex items-center gap-2 text-base text-[var(--brand-text)]">
                  <MapPin size={18} className="text-[var(--brand-green)]" /> Delivery Address
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1.5 text-[var(--brand-text)]">Full Address *</label>
                    <textarea className="w-full p-3 border rounded-md" value={form.address} onChange={e => set('address', e.target.value)}
                      placeholder="House/flat no, street, area, landmark..." rows={2} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1.5 text-[var(--brand-text)]">City *</label>
                      <input className="w-full h-11 px-3 border rounded-md" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Pune" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1.5 text-[var(--brand-text)]">State *</label>
                      <input className="w-full h-11 px-3 border rounded-md" value={form.state} onChange={e => set('state', e.target.value)} placeholder="Maharashtra" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1.5 text-[var(--brand-text)]">Pincode *</label>
                      <input className="w-full h-11 px-3 border rounded-md" value={form.pincode} onChange={e => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="411001" maxLength={6} />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1.5 text-[var(--brand-text)]">
                        <Calendar size={13} className="inline mr-1" />Preferred Delivery Date
                      </label>
                      <input className="w-full h-11 px-3 border rounded-md" type="date" value={form.booking_date}
                        onChange={e => set('booking_date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                </div>
              </div>

             {/* Payment method */}
<div className="card p-5 md:p-6 shadow-sm border-[var(--brand-border)]">
  <h2 className="font-semibold mb-5 flex items-center gap-2 text-base text-[var(--brand-text)]">
    <Lock size={18} className="text-[var(--brand-green)]" /> Payment Method
  </h2>
  
  <div className="space-y-3">
    {/* Online Payment Option */}
    <label 
      onClick={() => setPaymentMethod('razorpay')}
      className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        paymentMethod === 'razorpay' 
        ? 'border-[var(--brand-green)] bg-green-50/30' 
        : 'border-gray-100 hover:border-[var(--brand-border)] bg-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          paymentMethod === 'razorpay' ? 'border-[var(--brand-green)]' : 'border-gray-300'
        }`}>
          {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-green)]" />}
        </div>
        
        <div>
          <p className="text-sm font-bold text-[var(--brand-text)]">Pay Online</p>
          <p className="text-xs text-[var(--brand-muted)] mb-2">UPI, Cards, Net Banking, Wallets</p>
          <div className="flex gap-1.5 flex-wrap">
            {['UPI', 'Visa', 'GPay'].map(m => (
              <span key={m} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Shield size={20} className="text-blue-500 opacity-20 hidden sm:block" />
    </label>

    {/* COD Option */}
    <label 
      onClick={() => codAvailable && setPaymentMethod('cod')}
      className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
        !codAvailable 
          ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-100' 
          : paymentMethod === 'cod' 
            ? 'border-[var(--brand-green)] bg-green-50/30 cursor-pointer' 
            : 'border-gray-100 hover:border-[var(--brand-border)] bg-white cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          paymentMethod === 'cod' ? 'border-[var(--brand-green)]' : 'border-gray-300'
        }`}>
          {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-green)]" />}
        </div>
        
        <div>
          <p className="text-sm font-bold text-[var(--brand-text)]">Cash on Delivery</p>
          <p className={`text-xs ${!codAvailable ? 'text-orange-600 font-medium' : 'text-[var(--brand-muted)]'}`}>
            {codAvailable 
              ? 'Pay in cash upon delivery' 
              : 'Minimum order ₹999 required'
            }
          </p>
        </div>
      </div>
    </label>
  </div>
</div>

            {/* Right Column: Order Summary - Sticky */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-4">
                <div className="card p-5 md:p-6 shadow-md border-[var(--brand-border)] bg-white">
                  <h2 className="font-bold text-lg mb-4 text-[var(--brand-text)]">Order Summary</h2>

                  <div className="divide-y divide-[var(--brand-border)]">
                    <div className="py-3 max-h-60 overflow-y-auto space-y-3 mb-2">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm items-start gap-3">
                          <span className="text-[var(--brand-text)] leading-tight flex-1">
                            {item.name} <span className="text-[var(--brand-muted)] ml-1">× {item.quantity}</span>
                          </span>
                          <span className="font-semibold text-[var(--brand-brown)] whitespace-nowrap">
                            ₹{(item.price * item.quantity).toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="py-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--brand-muted)]">Subtotal</span>
                        <span className="text-[var(--brand-text)]">₹{total.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--brand-muted)]">Shipping</span>
                        <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-[var(--brand-text)]'}`}>
                          {shipping === 0 ? 'FREE' : `₹${shipping}`}
                        </span>
                      </div>
                      
                      {shipping > 0 && (
                        <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs flex gap-2 items-center mt-2 border border-amber-100">
                          <Tag size={14} className="flex-shrink-0" />
                          <span>Add <b>₹{(499 - total).toFixed(0)}</b> more for <b>Free Shipping</b></span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-[var(--brand-text)]">Total Amount</span>
                        <span className="font-bold text-xl text-[var(--brand-brown)]">₹{grandTotal.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-transform active:scale-[0.98]"
                    style={{ opacity: loading ? 0.7 : 1 }}>
                    {loading ? (
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : paymentMethod === 'razorpay' 
                      ? `Pay ₹${grandTotal.toFixed(0)}` 
                      : 'Confirm COD Order'}
                  </button>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-[var(--brand-muted)] font-bold">
                      <Shield size={12} className="text-blue-500" /> 100% Secure Transaction
                    </div>
                  </div>
                </div>

                {/* Additional Info Cards for Trust */}
                <div className="hidden lg:block p-4 bg-[var(--brand-surface)] rounded-xl border border-dashed border-[var(--brand-border)]">
                    <div className="flex gap-3 items-center text-xs text-[var(--brand-muted)]">
                        <Truck size={16} />
                        <span>Expected delivery: 3-5 business days</span>
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
