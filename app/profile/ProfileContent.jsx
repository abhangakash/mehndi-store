'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import {
  User, Package, LogOut, Edit2, Save, X, MapPin,
  Clock, Truck, CheckCircle, XCircle, Plus, Home,
  Briefcase, Trash2, Check, Phone, ArrowRight,
  ShoppingBag, Download, ChevronDown, ChevronUp
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#d97706', bg: '#fef3c7', icon: Clock },
  confirmed: { label: 'Confirmed', color: '#1d4ed8', bg: '#dbeafe', icon: CheckCircle },
  shipped:   { label: 'Shipped',   color: '#7c3aed', bg: '#ede9fe', icon: Truck },
  delivered: { label: 'Delivered', color: '#15803d', bg: '#dcfce7', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fee2e2', icon: XCircle },
}

const STEPS = ['pending', 'confirmed', 'shipped', 'delivered']
const STEP_LABELS = ['Placed', 'Confirmed', 'Shipped', 'Delivered']

const LABEL_ICONS = { Home, Office: Briefcase, Other: MapPin }
const LABEL_OPTIONS = ['Home', 'Office', 'Other']
const EMPTY_ADDR = { label: 'Home', full_name: '', phone: '', address: '', city: '', state: '', pincode: '', is_default: false }

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.pending
  const StatusIcon = status.icon
  const stepIdx = STEPS.indexOf(order.order_status)
  const isCancelled = order.order_status === 'cancelled'

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: status.bg }}>
            <StatusIcon size={16} style={{ color: status.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wider text-gray-400">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="font-black text-base text-[#c9a84c]">₹{Number(order.total_amount).toFixed(0)}</p>
            <p className="text-xs text-gray-400">
              {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black"
            style={{ backgroundColor: status.bg, color: status.color }}>
            <StatusIcon size={11} /> {status.label}
          </span>
          <button onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold flex items-center gap-1 text-[#c9a84c] hover:opacity-80 transition-opacity">
            {expanded ? 'Hide' : 'Details'}
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>
      </div>

      {/* Progress Line container */}
      {!isCancelled && (
        <div className="px-4 py-4 border-t border-gray-50 bg-gray-50/20">
          {/* Responsive Stepper Container */}
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-0">
            
            {/* Desktop Horizontal Line */}
            <div className="hidden sm:block absolute left-0 right-0 top-3.5 h-0.5 z-0 mx-4 bg-gray-100">
              <div className="h-full transition-all duration-700 rounded-full"
                style={{
                  width: stepIdx >= 0 ? `${(stepIdx / 3) * 100}%` : '0%',
                  background: 'linear-gradient(90deg, #0f1a0e, #3a5a40)',
                }} />
            </div>

            {/* Mobile Vertical Line */}
            <div className="sm:hidden absolute left-3.5 top-3.5 bottom-3.5 w-0.5 z-0 bg-gray-100">
              <div className="w-full transition-all duration-700 rounded-full"
                style={{
                  height: stepIdx >= 0 ? `${(stepIdx / 3) * 100}%` : '0%',
                  background: 'linear-gradient(180deg, #0f1a0e, #3a5a40)',
                }} />
            </div>

            {/* Render Stepper Nodes */}
            {STEP_LABELS.map((label, i) => {
              const done = i <= stepIdx
              return (
                <div key={label} className="flex flex-row sm:flex-col items-center gap-3 sm:gap-1.5 z-10 sm:flex-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all flex-shrink-0"
                    style={{
                      backgroundColor: done ? '#0f1a0e' : 'white',
                      color: done ? 'white' : 'rgba(15,26,14,0.25)',
                      border: `2px solid ${done ? '#0f1a0e' : '#f3f4f6'}`,
                    }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className="text-[10px] sm:text-[9px] uppercase tracking-widest font-bold"
                    style={{ color: done ? '#0f1a0e' : 'rgba(15,26,14,0.3)' }}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-5 px-3 py-2 rounded-xl text-xs font-black text-center uppercase tracking-wide"
            style={{ backgroundColor: status.bg, color: status.color }}>
            {order.order_status === 'pending' && '⏳ Processing your order'}
            {order.order_status === 'confirmed' && '✅ Confirmed — preparing to ship'}
            {order.order_status === 'shipped' && '🚚 On the way! 2–3 days'}
            {order.order_status === 'delivered' && '🎉 Delivered! Enjoy your purchase'}
          </div>
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 flex flex-col gap-3">
          <div className="mt-3 divide-y divide-gray-50">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex justify-between items-start py-2 text-xs gap-4">
                <span className="text-gray-700 font-medium break-words">{item.product_name} × {item.quantity}</span>
                <span className="font-black text-[#c9a84c] flex-shrink-0">₹{Number(item.total_price).toFixed(0)}</span>
              </div>
            ))}
            <div className="pt-2.5 flex justify-between text-sm font-black mt-1">
              <span className="text-black">Total</span>
              <span className="text-[#c9a84c]">₹{Number(order.total_amount).toFixed(0)}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-400">
            <MapPin size={13} className="mt-0.5 flex-shrink-0 text-[#c9a84c]" />
            <span className="break-words">{order.address}, {order.city} — {order.pincode}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-1">
            <a href={`/api/send-invoice?orderId=${order.id}`} target="_blank" rel="noreferrer"
              className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-[0.98] bg-[#0f1a0e] shadow-md shadow-black/5">
              <Download size={12} /> Invoice
            </a>
            <a href={`https://wa.me/919921297518?text=Hi! I need help with my order %23${order.id.slice(0,8).toUpperCase()}`}
              target="_blank" rel="noreferrer"
              className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-[0.98] bg-[#25D366] shadow-md shadow-black/5">
              <Phone size={12} /> Help
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProfileContent() {
  const { user, profile, loading, signOut, fetchProfile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'profile'
  const [tab, setTab] = useState(['profile','orders','addresses'].includes(initialTab) ? initialTab : 'profile')

  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ full_name: '', phone: '' })

  const [addresses, setAddresses] = useState([])
  const [addrLoading, setAddrLoading] = useState(false)
  const [showAddrForm, setShowAddrForm] = useState(false)
  const [addrForm, setAddrForm] = useState(EMPTY_ADDR)
  const [editingAddrId, setEditingAddrId] = useState(null)
  const [addrSaving, setAddrSaving] = useState(false)

  useEffect(() => { if (!loading && !user) router.push('/login') }, [user, loading, router])
  useEffect(() => { if (profile) setForm({ full_name: profile.full_name || '', phone: profile.phone || '' }) }, [profile])

  const loadOrders = useCallback(async () => {
    if (!user) return
    setOrdersLoading(true)
    const { data } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', user.id).order('created_at', { ascending: false })
    setOrders(data || [])
    setOrdersLoading(false)
  }, [user])

  const loadAddresses = useCallback(async () => {
    if (!user) return
    setAddrLoading(true)
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }).order('created_at', { ascending: false })
    setAddresses(data || [])
    setAddrLoading(false)
  }, [user])

  useEffect(() => { if (tab === 'orders' && user) loadOrders() }, [tab, user, loadOrders])
  useEffect(() => { if (tab === 'addresses' && user) loadAddresses() }, [tab, user, loadAddresses])

  const handleSaveProfile = async () => {
    if (!user) { router.push('/login'); return }
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ full_name: form.full_name, phone: form.phone }).eq('id', user.id)
    if (error) toast.error('Failed to save')
    else { toast.success('Profile updated!'); fetchProfile(user.id); setEditing(false) }
    setSaving(false)
  }

  const handleSaveAddress = async () => {
    if (!addrForm.full_name || !addrForm.phone || !addrForm.address || !addrForm.city || !addrForm.state || !addrForm.pincode) {
      toast.error('Please fill all address fields'); return
    }
    setAddrSaving(true)
    try {
      if (addrForm.is_default) await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
      if (editingAddrId) {
        await supabase.from('addresses').update({ ...addrForm }).eq('id', editingAddrId)
        toast.success('Address updated!')
      } else {
        await supabase.from('addresses').insert({ ...addrForm, user_id: user.id, is_default: addresses.length === 0 || addrForm.is_default })
        toast.success('Address saved!')
      }
      setShowAddrForm(false); setEditingAddrId(null); setAddrForm(EMPTY_ADDR); loadAddresses()
    } catch { toast.error('Failed to save address') }
    setAddrSaving(false)
  }

  const handleDeleteAddress = async (id) => {
    await supabase.from('addresses').delete().eq('id', id)
    toast.success('Address deleted'); loadAddresses()
  }

  const handleSetDefault = async (id) => {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
    await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    toast.success('Default address updated!'); loadAddresses()
  }

  const handleSignOut = async () => { await signOut(); toast.success('Signed out'); router.push('/') }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin border-[#c9a84c]" />
    </div>
  )
  if (!user) return null

  const initials = (profile?.full_name || user.email || 'U').slice(0, 2).toUpperCase()
  const TABS = [
    { key: 'profile', label: 'Profile', icon: <User size={14} /> },
    { key: 'orders', label: 'Orders', icon: <Package size={14} /> },
    { key: 'addresses', label: 'Addresses', icon: <MapPin size={14} /> },
  ]

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* Top Banner Header Block */}
      <div className="px-4 pt-8 pb-4 text-center">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black">My Account</h1>
        <p className="text-xs font-bold uppercase tracking-widest mt-1 style-title max-w-md mx-auto" style={{ color: '#c9a84c' }}>
          Manage your personal records, profiles & secure dynamic settings
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-4">
        {/* Profile Card Header Block */}
        <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 mb-5 border border-gray-100 bg-white shadow-sm">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-black flex-shrink-0 bg-[#0f1a0e] mx-auto sm:mx-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="font-black text-base truncate text-black">
              {profile?.full_name || 'User Account'}
            </h2>
            <p className="text-xs truncate text-gray-400 font-medium mt-0.5">{user.email}</p>
            {profile?.phone && (
              <p className="text-xs text-gray-400 font-medium mt-0.5">📞 {profile.phone}</p>
            )}
          </div>
          <button onClick={handleSignOut}
            className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl border border-red-200 bg-red-50/20 hover:bg-red-50 text-red-500 transition-all active:scale-[0.98] sm:w-auto w-full mt-2 sm:mt-0">
            <LogOut size={13} /> Sign out
          </button>
        </div>

        {/* Quick actions dynamic grids */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          {[
            { href: '/track-order', icon: <MapPin size={18} />, label: 'Track Order', color: '#7c3aed', bg: '#ede9fe' },
            { href: '/products', icon: <ShoppingBag size={18} />, label: 'Shop Now', color: '#15803d', bg: '#dcfce7' },
            { href: 'https://wa.me/919921297518', icon: <Phone size={18} />, label: 'Get Help', color: '#1d4ed8', bg: '#dbeafe', external: true },
          ].map(a => (
            <Link key={a.label} href={a.href} target={a.external ? '_blank' : undefined} rel={a.external ? 'noreferrer' : undefined}
              className="flex flex-col items-center gap-2 p-2.5 sm:p-3 rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-md active:scale-[0.98]">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: a.bg, color: a.color }}>
                {a.icon}
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-center text-gray-500 break-words line-clamp-1">
                {a.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Dynamic Nav Tabs Group */}
        <div className="flex gap-1.5 p-1 border border-gray-100 rounded-2xl bg-gray-50/50 mb-6">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200"
              style={{
                backgroundColor: tab === t.key ? '#0f1a0e' : 'transparent',
                color: tab === t.key ? 'white' : '#6b7280',
              }}>
              {t.icon} <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-12">

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/50">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">Account Details</p>
              {!editing
                ? <button onClick={() => setEditing(true)}
                    className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-widest w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-black transition-all active:scale-[0.98]">
                    <Edit2 size={12} /> Edit Profile
                  </button>
                : <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => setEditing(false)} className="flex-1 sm:flex-none text-center text-xs font-black uppercase tracking-widest px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all active:scale-[0.98]">
                      Cancel
                    </button>
                    <button onClick={handleSaveProfile} disabled={saving}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl text-white transition-all active:scale-[0.98] bg-[#0f1a0e]">
                      <Save size={12} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
              }
            </div>
            <div className="p-5 flex flex-col gap-4">
              {[
                { label: 'Full Name', value: profile?.full_name, field: 'full_name', type: 'text', placeholder: 'Your name' },
                { label: 'Email Address', value: user.email, readonly: true },
                { label: 'Phone Number', value: profile?.phone || user.phone, field: 'phone', type: 'tel', placeholder: '9876543210' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-gray-400">{f.label}</label>
                  {editing && !f.readonly && f.field
                    ? <input type={f.type} value={form[f.field]} placeholder={f.placeholder}
                        className="w-full text-sm font-semibold p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-white text-black"
                        onChange={e => setForm(fm => ({ ...fm, [f.field]: e.target.value }))} />
                    : <p className="text-sm font-semibold py-3 px-4 rounded-xl border border-gray-50 bg-gray-50/50 text-black break-words">
                        {f.value || '—'}
                      </p>
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="rounded-2xl p-10 border border-gray-100 text-center bg-white">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto border-[#c9a84c]" />
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl p-10 border border-gray-100 text-center bg-white">
                <ShoppingBag size={36} className="mx-auto mb-3 text-gray-200" />
                <p className="font-black text-sm mb-1 text-black uppercase tracking-wider">No orders yet</p>
                <Link href="/products" className="inline-flex items-center gap-2 mt-3 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-[#0f1a0e] transition-all active:scale-[0.98]">
                  Start Shopping <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map(order => <OrderCard key={order.id} order={order} />)}
              </div>
            )}
          </div>
        )}

        {/* ADDRESSES TAB */}
        {tab === 'addresses' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 text-center sm:text-left">
                {addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}
              </p>
              <button onClick={() => { setShowAddrForm(true); setEditingAddrId(null); setAddrForm(EMPTY_ADDR) }}
                className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-widest px-4 py-3 sm:py-2.5 rounded-xl bg-[#0f1a0e] text-white transition-all active:scale-[0.98] w-full sm:w-auto">
                <Plus size={13} /> Add Address
              </button>
            </div>

            {showAddrForm && (
              <div className="rounded-2xl border border-gray-100 overflow-hidden mb-5 bg-white shadow-sm">
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                    {editingAddrId ? 'Edit Address' : 'New Address'}
                  </p>
                  <button onClick={() => { setShowAddrForm(false); setEditingAddrId(null) }} className="text-gray-400 hover:text-black transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">Label Tag</label>
                    <div className="flex gap-2">
                      {LABEL_OPTIONS.map(l => {
                        const LI = LABEL_ICONS[l] || MapPin
                        const isSelected = addrForm.label === l
                        return (
                          <button key={l} type="button" onClick={() => setAddrForm(f => ({ ...f, label: l }))}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all"
                            style={{ 
                              borderColor: isSelected ? '#0f1a0e' : '#e5e7eb', 
                              backgroundColor: isSelected ? '#0f1a0e' : 'white', 
                              color: isSelected ? 'white' : '#6b7280' 
                            }}>
                            <LI size={12} /> {l}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-gray-400">Full Name *</label>
                      <input value={addrForm.full_name} className="w-full text-sm font-semibold p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-white text-black" onChange={e => setAddrForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Priya Sharma" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-gray-400">Phone Number *</label>
                      <input type="tel" value={addrForm.phone} className="w-full text-sm font-semibold p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-white text-black" onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value.replace(/\D/g,'').slice(0,10) }))} placeholder="9876543210" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-gray-400">Street Address *</label>
                    <textarea value={addrForm.address} className="w-full text-sm font-semibold p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-white text-black" onChange={e => setAddrForm(f => ({ ...f, address: e.target.value }))} placeholder="House/flat, street, area..." rows={2} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-gray-400">City *</label>
                      <input value={addrForm.city} className="w-full text-sm font-semibold p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-white text-black" onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} placeholder="Pune" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-gray-400">State *</label>
                      <input value={addrForm.state} className="w-full text-sm font-semibold p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-white text-black" onChange={e => setAddrForm(f => ({ ...f, state: e.target.value }))} placeholder="Maharashtra" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-gray-400">Pincode *</label>
                      <input value={addrForm.pincode} className="w-full text-sm font-semibold p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-white text-black" onChange={e => setAddrForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g,'').slice(0,6) }))} placeholder="411001" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2.5 cursor-pointer mt-1 py-1">
                    <input type="checkbox" checked={addrForm.is_default} onChange={e => setAddrForm(f => ({ ...f, is_default: e.target.checked }))} className="w-4 h-4 accent-[#0f1a0e]" />
                    <span className="text-xs font-bold text-gray-500">Set as default delivery address</span>
                  </label>
                  <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2">
                    <button onClick={() => { setShowAddrForm(false); setEditingAddrId(null) }}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs font-black uppercase border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all active:scale-[0.98]">
                      Cancel
                    </button>
                    <button onClick={handleSaveAddress} disabled={addrSaving}
                      className="w-full flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-[0.98] bg-[#0f1a0e]">
                      {addrSaving ? 'Saving...' : editingAddrId ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {addrLoading ? (
              <div className="rounded-2xl p-10 border border-gray-100 text-center bg-white">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto border-[#c9a84c]" />
              </div>
            ) : addresses.length === 0 && !showAddrForm ? (
              <div className="rounded-2xl p-10 border border-gray-100 text-center bg-white">
                <MapPin size={36} className="mx-auto mb-3 text-gray-200" />
                <p className="font-black text-sm mb-1 text-black uppercase tracking-wider">No saved addresses</p>
                <button onClick={() => setShowAddrForm(true)}
                  className="inline-flex items-center gap-2 mt-3 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-[#0f1a0e] transition-all active:scale-[0.98]">
                  <Plus size={12} /> Add Address
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {addresses.map(addr => {
                  const LI = LABEL_ICONS[addr.label] || MapPin
                  return (
                    <div key={addr.id} className="rounded-2xl p-4 border transition-all bg-white"
                      style={{ borderColor: addr.is_default ? '#0f1a0e' : '#f3f4f6', borderWidth: addr.is_default ? '1.5px' : '1px' }}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <LI size={13} className="text-[#c9a84c]" />
                          <span className="text-xs font-black uppercase tracking-wider text-black">{addr.label}</span>
                          {addr.is_default && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full font-black text-white bg-[#0f1a0e]">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {!addr.is_default && (
                            <button onClick={() => handleSetDefault(addr.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-black transition-colors text-xs font-black"
                              title="Set Default">
                              <Check size={14} />
                            </button>
                          )}
                          <button onClick={() => { setAddrForm({ label: addr.label, full_name: addr.full_name, phone: addr.phone, address: addr.address, city: addr.city, state: addr.state, pincode: addr.pincode, is_default: addr.is_default }); setEditingAddrId(addr.id); setShowAddrForm(true) }}
                            className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-black transition-colors" title="Edit">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-black">{addr.full_name}</p>
                      <p className="text-xs leading-relaxed text-gray-500 mt-0.5 break-words">
                        {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                      <p className="text-xs font-medium text-gray-400 mt-1">📞 {addr.phone}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}