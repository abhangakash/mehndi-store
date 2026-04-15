'use client'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { MapPin, Phone, User, Mail, Calendar, Shield, Truck, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')

  const total = getTotalPrice()
  const shipping = total >= 3 ? 0 : 60
  const grandTotal = total + shipping
  const codAvailable = grandTotal >= 999

  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '',
    city: '', state: '', pincode: '', booking_date: '',
  })

  useEffect(() => {
    if (profile) {
      setForm(f => ({ ...f, name: profile.full_name || '', phone: profile.phone || '', email: user?.email || '' }))
    }
  }, [profile, user])

  useEffect(() => {
    if (items.length === 0) router.push('/cart')
  }, [items, router])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const required = ['name', 'phone', 'address', 'city', 'state', 'pincode']
    for (const f of required) {
      if (!form[f].trim()) { toast.error(`Please enter your ${f}`); return false }
    }
    if (form.phone.length < 10) { toast.error('Enter valid phone number'); return false }
    if (form.pincode.length !== 6) { toast.error('Enter valid 6-digit pincode'); return false }
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
              customer: form, items, subtotal: total, shipping, total: grandTotal,
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
        body: JSON.stringify({ cod: true, customer: form, items, subtotal: total, shipping, total: grandTotal, user_id: user?.id || null }),
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

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="section-title mb-8">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* Personal info */}
              <div className="card p-5">
                <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--brand-text)' }}>
                  <User size={16} style={{ color: 'var(--brand-green)' }} /> Personal Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Full Name *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Priya Sharma" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Phone *</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="9876543210" maxLength={10} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Email (optional)</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="card p-5">
                <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--brand-text)' }}>
                  <MapPin size={16} style={{ color: 'var(--brand-green)' }} /> Delivery Address
                </h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Full Address *</label>
                    <textarea value={form.address} onChange={e => set('address', e.target.value)} placeholder="House/flat no, street, area..." rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>City *</label>
                      <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Pune" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>State *</label>
                      <input value={form.state} onChange={e => set('state', e.target.value)} placeholder="Maharashtra" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Pincode *</label>
                      <input value={form.pincode} onChange={e => set('pincode', e.target.value)} placeholder="411001" maxLength={6} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Preferred Date</label>
                      <input type="date" value={form.booking_date} onChange={e => set('booking_date', e.target.value)} min={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="card p-5">
                <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--brand-text)' }}>
                  <Lock size={16} style={{ color: 'var(--brand-green)' }} /> Payment Method
                </h2>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer"
                    style={{ borderColor: paymentMethod === 'razorpay' ? 'var(--brand-green)' : 'var(--brand-border)', backgroundColor: paymentMethod === 'razorpay' ? '#f0fdf4' : 'white' }}>
                    <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="w-auto" />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>Pay Online</p>
                      <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>UPI, Cards, Net Banking via Razorpay</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-lg border ${codAvailable ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                    style={{ borderColor: paymentMethod === 'cod' ? 'var(--brand-green)' : 'var(--brand-border)', backgroundColor: paymentMethod === 'cod' ? '#f0fdf4' : 'white' }}>
                    <input type="radio" name="payment" value="cod" disabled={!codAvailable} checked={paymentMethod === 'cod'} onChange={() => codAvailable && setPaymentMethod('cod')} className="w-auto" />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>Cash on Delivery</p>
                      <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>{codAvailable ? 'Pay when your order arrives' : 'Available on orders above ₹999'}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="md:col-span-1">
              <div className="card p-5 sticky top-20">
                <h2 className="font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Order Summary</h2>
                <div className="flex flex-col gap-2 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="truncate mr-2" style={{ color: 'var(--brand-text)' }}>{item.name} × {item.quantity}</span>
                      <span className="flex-shrink-0" style={{ color: 'var(--brand-brown)' }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 flex flex-col gap-2 mb-4" style={{ borderColor: 'var(--brand-border)' }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--brand-muted)' }}>Subtotal</span><span>₹{total.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--brand-muted)' }}>Shipping</span>
                    <span style={{ color: shipping === 0 ? '#15803d' : 'var(--brand-text)' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-1 border-t" style={{ borderColor: 'var(--brand-border)' }}>
                    <span style={{ color: 'var(--brand-text)' }}>Total</span>
                    <span style={{ color: 'var(--brand-brown)' }}>₹{grandTotal.toFixed(0)}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm mb-3">
                  {loading ? 'Processing...' : paymentMethod === 'razorpay' ? `🔒 Pay ₹${grandTotal.toFixed(0)}` : 'Place COD Order'}
                </button>
                <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: 'var(--brand-muted)' }}>
                  <Shield size={11} /> Secure checkout by Razorpay
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}