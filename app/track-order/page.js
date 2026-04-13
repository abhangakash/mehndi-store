'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Package, Phone, Mail, Search, MapPin, CheckCircle, Clock, Truck, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered']
const STATUS_CONFIG = {
  pending:   { label: 'Order Placed', icon: <Clock size={16} />,        color: '#854F0B', bg: '#FAEEDA' },
  confirmed: { label: 'Confirmed',    icon: <CheckCircle size={16} />,  color: '#185FA5', bg: '#E6F1FB' },
  shipped:   { label: 'Shipped',      icon: <Truck size={16} />,        color: '#534AB7', bg: '#EEEDFE' },
  delivered: { label: 'Delivered',    icon: <CheckCircle size={16} />,  color: '#15803d', bg: '#dcfce7' },
  cancelled: { label: 'Cancelled',    icon: <XCircle size={16} />,      color: '#dc2626', bg: '#fee2e2' },
}

export default function TrackOrderPage() {
  const [searchType, setSearchType] = useState('phone')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchValue.trim()) return toast.error('Please enter your ' + searchType)
    setLoading(true)
    setOrders(null)
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq(searchType, searchValue.trim())
      .order('created_at', { ascending: false })
      .limit(10)
    if (error) toast.error('Something went wrong')
    else if (!data || data.length === 0) { toast.error('No orders found'); setOrders([]) }
    else { setOrders(data); toast.success(`Found ${data.length} order(s)`) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--brand-surface)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--brand-green)' }}>
            <Package size={24} color="white" />
          </div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--brand-green)' }}>Track Your Order</h1>
          <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>Enter your phone number or email to see your orders</p>
        </div>

        <div className="card p-6 mb-6">
          <div className="flex rounded-lg p-1 mb-5" style={{ backgroundColor: 'var(--brand-surface)' }}>
            {[{ key: 'phone', label: 'Phone Number', icon: <Phone size={14} /> }, { key: 'email', label: 'Email', icon: <Mail size={14} /> }].map(t => (
              <button key={t.key} onClick={() => { setSearchType(t.key); setSearchValue(''); setOrders(null) }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all"
                style={{ backgroundColor: searchType === t.key ? 'white' : 'transparent', color: searchType === t.key ? 'var(--brand-green)' : 'var(--brand-muted)', boxShadow: searchType === t.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              {searchType === 'phone'
                ? <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--brand-muted)' }} />
                : <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--brand-muted)' }} />}
              <input type={searchType === 'email' ? 'email' : 'tel'} value={searchValue} onChange={e => setSearchValue(e.target.value)}
                placeholder={searchType === 'phone' ? '9876543210' : 'you@example.com'} style={{ paddingLeft: '2.5rem' }} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary px-4">{loading ? '...' : <Search size={18} />}</button>
          </form>
          <p className="text-xs mt-3 text-center" style={{ color: 'var(--brand-muted)' }}>
            Use the same contact you used during checkout.{' '}
            <Link href="/login" style={{ color: 'var(--brand-green)' }} className="underline">Login for full history</Link>
          </p>
        </div>

        {orders !== null && orders.length === 0 && (
          <div className="card p-8 text-center">
            <Package size={40} className="mx-auto mb-3" style={{ color: 'var(--brand-muted)' }} />
            <p className="font-medium mb-1" style={{ color: 'var(--brand-text)' }}>No orders found</p>
            <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>Try the other search option or check your contact details.</p>
          </div>
        )}

        {orders && orders.map(order => {
          const status = order.order_status || 'pending'
          const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
          const stepIndex = STATUS_STEPS.indexOf(status)
          return (
            <div key={order.id} className="card mb-4 overflow-hidden">
              <div className="p-4 border-b flex items-start justify-between gap-3" style={{ borderColor: 'var(--brand-border)' }}>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--brand-muted)' }}>Order #{order.id.slice(0,8).toUpperCase()}</p>
                  <p className="font-semibold" style={{ color: 'var(--brand-text)' }}>₹{Number(order.total_amount).toFixed(0)}</p>
                  <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: config.bg, color: config.color }}>
                  {config.icon} {config.label}
                </span>
              </div>
              {status !== 'cancelled' && (
                <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--brand-border)' }}>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-3.5 h-0.5 z-0" style={{ backgroundColor: 'var(--brand-border)' }}>
                      <div className="h-full" style={{ backgroundColor: 'var(--brand-green)', width: stepIndex >= 0 ? `${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%` : '0%' }} />
                    </div>
                    {STATUS_STEPS.map((step, i) => {
                      const done = i <= stepIndex
                      return (
                        <div key={step} className="flex flex-col items-center gap-1 z-10">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                            style={{ backgroundColor: done ? 'var(--brand-green)' : 'white', color: done ? 'white' : 'var(--brand-muted)', border: `2px solid ${done ? 'var(--brand-green)' : 'var(--brand-border)'}` }}>
                            {done ? '✓' : i + 1}
                          </div>
                          <span className="text-xs hidden sm:block" style={{ color: done ? 'var(--brand-green)' : 'var(--brand-muted)' }}>
                            {STATUS_CONFIG[step]?.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              <div className="p-4 border-b" style={{ borderColor: 'var(--brand-border)' }}>
                {order.order_items?.map(item => (
                  <div key={item.id} className="flex justify-between py-0.5">
                    <span className="text-sm" style={{ color: 'var(--brand-text)' }}>{item.product_name} × {item.quantity}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--brand-brown)' }}>₹{Number(item.total_price).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-muted)' }} />
                <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>{order.address}, {order.city}, {order.state} — {order.pincode}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}