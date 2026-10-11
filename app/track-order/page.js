'use client'
import { useState, useEffect } from 'react'
import OrderTrackingCard from '@/components/OrderTrackingCard'
import {
  Phone, Search, Hash,
  ArrowRight, ShoppingBag,
  ShieldCheck, Zap
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function TrackOrderPage() {
  const [searchType, setSearchType] = useState('contact')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState(null)
  const [searched, setSearched] = useState(false)

  // Opened from the shipped email link: /track-order?order=A1B2C3D4
  useEffect(() => {
    const o = new URLSearchParams(window.location.search).get('order')
    if (o && /^[0-9a-fA-F]{8}$/.test(o.trim())) {
      const v = o.trim().toUpperCase()
      setSearchType('order_id')
      setSearchValue(v)
      runSearch('order_id', v)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    runSearch(searchType, searchValue)
  }

  const runSearch = async (tab, raw) => {
    const value = (raw || '').trim()
    let type = tab
    let query = value

    if (tab === 'contact') {
      if (value.includes('@')) {
        type = 'email'
      } else {
        const digits = value.replace(/\D/g, '')
        const ten = digits.length > 10 && digits.startsWith('91') ? digits.slice(-10) : digits
        if (ten.length !== 10) {
          return toast.error('Enter a valid 10-digit mobile number or email address')
        }
        type = 'phone'
        query = ten
      }
    } else if (!/^#?[0-9a-fA-F]{8}$/.test(value)) {
      return toast.error('Order ID has 8 characters, for example A1B2C3D4')
    }

    setLoading(true)
    setOrders(null)
    let data = null, error = null
    try {
      const res = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value: query }),
      })
      const json = await res.json()
      if (!res.ok) error = json.error || 'error'
      else data = json.orders
    } catch (err) {
      error = err.message
    }
    if (error) {
      toast.error(typeof error === 'string' && error.startsWith('Invalid') ? error : 'Something went wrong. Please try again.')
    } else if (!data || data.length === 0) {
      setOrders([])
      toast.error('No order found')
    } else {
      setOrders(data)
    }
    setSearched(true)
    setLoading(false)
  }

  return (
    <div className="bg-slate-50 min-h-screen text-[#0a0f0d] antialiased pb-12">

      {/* ===== COMPACT HEADER ===== */}
      <div className="max-w-xl mx-auto px-4 pt-6 pb-4 text-center">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-tight">
          Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93731e] to-[#a48434]">Order</span>
        </h1>
        <p className="text-gray-500 text-[11px] sm:text-xs mt-1 font-medium">
          Look up your active shipment status instantly
        </p>
      </div>

      {/* ===== SEARCH CARD GRID BOX ===== */}
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-200/80">
         
          {/* Toggle buttons: Mobile/Email on left, Order ID on right */}
          <div className="grid grid-cols-2 gap-1.5 mb-4 p-1 rounded-xl bg-slate-100">
            {[
              { key: 'contact', label: 'Mobile / Email' },
              { key: 'order_id', label: 'Order ID' },
            ].map(t => (
              <button key={t.key}
                type="button"
                onClick={() => { setSearchType(t.key); setSearchValue(''); setOrders(null); setSearched(false) }}
                className="py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-200"
                style={{
                  backgroundColor: searchType === t.key ? '#0a0f0d' : 'transparent',
                  color: searchType === t.key ? 'white' : 'rgba(10,15,13,0.5)',
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Input Field Elements */}
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            <div className="relative w-full">
              {searchType === 'order_id'
                ? <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#93731e]" />
                : <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#93731e]" />
              }
              <input
                type="text"
                autoComplete="off"
                value={searchValue}
                onChange={e => setSearchValue(
                  searchType === 'order_id'
                    ? e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 8).toUpperCase()
                    : e.target.value
                )}
                placeholder={searchType === 'order_id' ? 'Order ID, e.g. A1B2C3D4' : 'Enter mobile number or email'}
                className="w-full py-3 pr-3 rounded-xl text-xs font-bold outline-none border transition-all bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#93731e]/20"
                style={{
                  paddingLeft: '2.5rem',
                  borderColor: 'rgba(15,26,14,0.1)',
                  color: '#0a0f0d',
                }}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all active:scale-[0.99] bg-[#0a0f0d] hover:bg-[#141d1a] disabled:opacity-40 shadow-xs">
              {loading ? 'Searching...' : <><Search size={13} /> Track order</>}
            </button>
          </form>
        </div>

        {/* ===== LOGIN HISTORY NUDGE ===== */}
        <div className="mt-2.5">
          <Link href="/login"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all bg-white border border-gray-200/80 shadow-xs group">
            <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
              🔐 View dashboard order history
            </span>
            <ArrowRight size={13} className="text-[#93731e] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ===== LIVE RESULTS CONTAINER ===== */}
        {searched && orders !== null && (
          <div className="mt-5 flex flex-col gap-3 w-full">
            {orders.length === 0 ? (
              <div className="rounded-2xl p-5 text-center bg-white border border-gray-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2.5 bg-slate-50 border border-gray-100">
                  <ShoppingBag size={18} className="text-gray-300" />
                </div>
                <p className="font-black text-xs uppercase tracking-wide text-[#0a0f0d]">
                  No order found
                </p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5 mb-3">
                  We could not find an order with those details. Please check them and try again.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchType(searchType === 'contact' ? 'order_id' : 'contact'); setSearchValue(''); setOrders(null); setSearched(false) }}
                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-[#0a0f0d] hover:bg-[#141d1a]"
                >
                  Search by {searchType === 'contact' ? 'Order ID' : 'mobile or email'} instead
                </button>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-black uppercase tracking-widest text-center text-gray-400">
                  {orders.length} order{orders.length > 1 ? 's' : ''} found
                </p>
                {orders.map((order, i) => (
                  <OrderTrackingCard key={order.id} order={order} defaultOpen={i === 0} />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* ===== MINI TRUST BAR ===== */}
      <div className="max-w-xl mx-auto px-4 mt-5">
        <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 px-1">
            <ShieldCheck size={15} className="text-[#93731e] shrink-0" />
            <span className="text-[10px] font-black tracking-tight text-gray-700 uppercase">100% Ayurvedic Purity</span>
          </div>
          <div className="flex items-center gap-1.5 px-1 border-l border-gray-100">
            <Zap size={15} className="text-[#93731e] shrink-0" />
            <span className="text-[10px] font-black tracking-tight text-gray-700 uppercase">Fast Delivery India</span>
          </div>
        </div>
      </div>

    </div>
  )
}