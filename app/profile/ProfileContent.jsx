'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import {
  User, Package, LogOut, Edit2, Save, X, MapPin,
  Clock, Truck, CheckCircle, XCircle, Plus, Home,
  Briefcase, Star, Trash2, Check, Phone, ArrowRight,
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
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#fcfaf6', border: '1.5px solid rgba(15,26,14,0.06)' }}>
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: status.bg }}>
            <StatusIcon size={16} style={{ color: status.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(15,26,14,0.4)' }}>
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="font-black text-base" style={{ color: '#c9a84c' }}>₹{Number(order.total_amount).toFixed(0)}</p>
            <p className="text-xs" style={{ color: 'rgba(15,26,14,0.4)' }}>
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
            className="text-xs font-bold flex items-center gap-1" style={{ color: '#c9a84c' }}>
            {expanded ? 'Hide' : 'Details'}
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {!isCancelled && (
        <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(15,26,14,0.06)' }}>
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-3.5 h-0.5 z-0 mx-4"
              style={{ backgroundColor: 'rgba(15,26,14,0.08)' }}>
              <div className="h-full transition-all duration-700 rounded-full"
                style={{
                  width: stepIdx >= 0 ? `${(stepIdx / 3) * 100}%` : '0%',
                  background: 'linear-gradient(90deg, #0f1a0e, #3a5a40)',
                }} />
            </div>
            {STEP_LABELS.map((label, i) => {
              const done = i <= stepIdx
              return (
                <div key={label} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all"
                    style={{
                      backgroundColor: done ? '#0f1a0e' : 'white',
                      color: done ? 'white' : 'rgba(15,26,14,0.25)',
                      border: `2px solid ${done ? '#0f1a0e' : 'rgba(15,26,14,0.1)'}`,
                    }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: done ? 800 : 500, color: done ? '#0f1a0e' : 'rgba(15,26,14,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-3 px-3 py-2 rounded-xl text-xs font-bold text-center uppercase tracking-wide"
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
        <div className="px-4 pb-4 border-t flex flex-col gap-3" style={{ borderColor: 'rgba(15,26,14,0.06)' }}>
          <div className="mt-3">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex justify-between py-1 text-xs">
                <span style={{ color: '#0f1a0e' }}>{item.product_name} × {item.quantity}</span>
                <span className="font-black" style={{ color: '#c9a84c' }}>₹{Number(item.total_price).toFixed(0)}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 flex justify-between text-sm font-black"
              style={{ borderColor: 'rgba(15,26,14,0.06)' }}>
              <span style={{ color: '#0f1a0e' }}>Total</span>
              <span style={{ color: '#c9a84c' }}>₹{Number(order.total_amount).toFixed(0)}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs" style={{ color: 'rgba(15,26,14,0.5)' }}>
            <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#c9a84c' }} />
            <span>{order.address}, {order.city} — {order.pincode}</span>
          </div>

          <div className="flex gap-2">
            <a href={`/api/send-invoice?orderId=${order.id}`} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide text-white"
              style={{ backgroundColor: '#0f1a0e' }}>
              <Download size={12} /> Invoice
            </a>
            <a href={`https://wa.me/919623740541?text=Hi! I need help with my order %23${order.id.slice(0,8).toUpperCase()}`}
              target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide text-white"
              style={{ backgroundColor: '#25D366' }}>
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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0f0d' }}>
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
    <div className="min-h-screen" style={{ backgroundColor: '#0a0f0d' }}>
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-4">
        {/* Profile header */}
        <div className="rounded-2xl p-5 flex items-center gap-4 mb-4" style={{ backgroundColor: '#fcfaf6' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-black flex-shrink-0"
            style={{ backgroundColor: '#0f1a0e' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-base truncate" style={{ color: '#0f1a0e' }}>
              {profile?.full_name || 'My Account'}
            </h1>
            <p className="text-xs truncate" style={{ color: 'rgba(15,26,14,0.4)' }}>{user.email}</p>
            {profile?.phone && (
              <p className="text-xs" style={{ color: 'rgba(15,26,14,0.4)' }}>📞 {profile.phone}</p>
            )}
          </div>
          <button onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs font-black px-3 py-2 rounded-xl border hover:bg-red-50 text-red-500 flex-shrink-0"
            style={{ borderColor: '#fca5a5' }}>
            <LogOut size={13} /> Sign out
          </button>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { href: '/track-order', icon: <MapPin size={18} />, label: 'Track Order', color: '#7c3aed', bg: '#ede9fe' },
            { href: '/products', icon: <ShoppingBag size={18} />, label: 'Shop Now', color: '#15803d', bg: '#dcfce7' },
            { href: 'https://wa.me/919623740541', icon: <Phone size={18} />, label: 'Get Help', color: '#15803d', bg: '#dcfce7', external: true },
          ].map(a => (
            <Link key={a.label} href={a.href} target={a.external ? '_blank' : undefined} rel={a.external ? 'noreferrer' : undefined}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all hover:shadow-md"
              style={{ backgroundColor: '#fcfaf6' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: a.bg, color: a.color }}>
                {a.icon}
              </div>
              <span className="text-xs font-black uppercase tracking-wide text-center" style={{ color: '#0f1a0e', fontSize: '9px' }}>
                {a.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all"
              style={{
                backgroundColor: tab === t.key ? '#c9a84c' : 'rgba(255,255,255,0.06)',
                color: tab === t.key ? '#0f1a0e' : 'rgba(255,255,255,0.5)',
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-10">

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#fcfaf6' }}>
            <div className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(15,26,14,0.06)', backgroundColor: '#fef9ee' }}>
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.5)' }}>Account Details</p>
              {!editing
                ? <button onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl"
                    style={{ color: '#0f1a0e', border: '1.5px solid #0f1a0e' }}>
                    <Edit2 size={12} /> Edit
                  </button>
                : <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="text-xs font-black px-3 py-1.5 rounded-xl border"
                      style={{ borderColor: 'rgba(15,26,14,0.1)', color: 'rgba(15,26,14,0.5)' }}>Cancel</button>
                    <button onClick={handleSaveProfile} disabled={saving}
                      className="flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-xl text-white"
                      style={{ backgroundColor: '#0f1a0e' }}>
                      <Save size={12} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
              }
            </div>
            <div className="p-5 flex flex-col gap-4">
              {[
                { label: 'Full Name', value: profile?.full_name, field: 'full_name', type: 'text', placeholder: 'Your name' },
                { label: 'Email', value: user.email, readonly: true },
                { label: 'Phone', value: profile?.phone || user.phone, field: 'phone', type: 'tel', placeholder: '9876543210' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.4)' }}>{f.label}</label>
                  {editing && !f.readonly && f.field
                    ? <input type={f.type} value={form[f.field]} placeholder={f.placeholder}
                        onChange={e => setForm(fm => ({ ...fm, [f.field]: e.target.value }))} />
                    : <p className="text-sm font-medium py-2.5 px-4 rounded-xl"
                        style={{ backgroundColor: 'rgba(15,26,14,0.04)', color: f.readonly ? 'rgba(15,26,14,0.4)' : '#0f1a0e' }}>
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
          <div>
            {ordersLoading ? (
              <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: '#fcfaf6' }}>
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto border-[#c9a84c]" />
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: '#fcfaf6' }}>
                <ShoppingBag size={36} className="mx-auto mb-3" style={{ color: 'rgba(15,26,14,0.2)' }} />
                <p className="font-black text-sm mb-1" style={{ color: '#0f1a0e' }}>No orders yet</p>
                <Link href="/products" className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white"
                  style={{ backgroundColor: '#0f1a0e' }}>
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
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}
              </p>
              <button onClick={() => { setShowAddrForm(true); setEditingAddrId(null); setAddrForm(EMPTY_ADDR) }}
                className="flex items-center gap-1.5 text-xs font-black px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: '#c9a84c', color: '#0f1a0e' }}>
                <Plus size={13} /> Add Address
              </button>
            </div>

            {showAddrForm && (
              <div className="rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: '#fcfaf6' }}>
                <div className="px-5 py-4 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(15,26,14,0.06)', backgroundColor: '#fef9ee' }}>
                  <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.5)' }}>
                    {editingAddrId ? 'Edit Address' : 'New Address'}
                  </p>
                  <button onClick={() => { setShowAddrForm(false); setEditingAddrId(null) }}>
                    <X size={16} style={{ color: 'rgba(15,26,14,0.4)' }} />
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(15,26,14,0.5)' }}>Label</label>
                    <div className="flex gap-2">
                      {LABEL_OPTIONS.map(l => {
                        const LI = LABEL_ICONS[l] || MapPin
                        return (
                          <button key={l} type="button" onClick={() => setAddrForm(f => ({ ...f, label: l }))}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wide border-2 transition-all"
                            style={{ borderColor: addrForm.label === l ? '#0f1a0e' : 'rgba(15,26,14,0.1)', backgroundColor: addrForm.label === l ? '#0f1a0e' : 'white', color: addrForm.label === l ? 'white' : 'rgba(15,26,14,0.4)' }}>
                            <LI size={11} /> {l}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Full Name *</label>
                      <input value={addrForm.full_name} onChange={e => setAddrForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Priya Sharma" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Phone *</label>
                      <input type="tel" value={addrForm.phone} onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value.replace(/\D/g,'').slice(0,10) }))} placeholder="9876543210" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Address *</label>
                    <textarea value={addrForm.address} onChange={e => setAddrForm(f => ({ ...f, address: e.target.value }))} placeholder="House/flat, street, area..." rows={2} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>City *</label>
                      <input value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} placeholder="Pune" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>State *</label>
                      <input value={addrForm.state} onChange={e => setAddrForm(f => ({ ...f, state: e.target.value }))} placeholder="Maharashtra" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.5)' }}>Pincode *</label>
                      <input value={addrForm.pincode} onChange={e => setAddrForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g,'').slice(0,6) }))} placeholder="411001" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={addrForm.is_default} onChange={e => setAddrForm(f => ({ ...f, is_default: e.target.checked }))} className="w-auto" />
                    <span className="text-xs font-bold" style={{ color: 'rgba(15,26,14,0.6)' }}>Set as default address</span>
                  </label>
                  <div className="flex gap-3">
                    <button onClick={handleSaveAddress} disabled={addrSaving}
                      className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white"
                      style={{ backgroundColor: '#0f1a0e' }}>
                      {addrSaving ? 'Saving...' : editingAddrId ? 'Update' : 'Save Address'}
                    </button>
                    <button onClick={() => { setShowAddrForm(false); setEditingAddrId(null) }}
                      className="px-5 py-3 rounded-xl text-xs font-black uppercase border"
                      style={{ borderColor: 'rgba(15,26,14,0.1)', color: 'rgba(15,26,14,0.5)' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {addrLoading ? (
              <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: '#fcfaf6' }}>
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto border-[#c9a84c]" />
              </div>
            ) : addresses.length === 0 && !showAddrForm ? (
              <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: '#fcfaf6' }}>
                <MapPin size={36} className="mx-auto mb-3" style={{ color: 'rgba(15,26,14,0.2)' }} />
                <p className="font-black text-sm mb-1" style={{ color: '#0f1a0e' }}>No saved addresses</p>
                <button onClick={() => setShowAddrForm(true)}
                  className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white"
                  style={{ backgroundColor: '#0f1a0e' }}>
                  <Plus size={12} /> Add Address
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {addresses.map(addr => {
                  const LI = LABEL_ICONS[addr.label] || MapPin
                  return (
                    <div key={addr.id} className="rounded-2xl p-4 border-2 transition-all"
                      style={{ backgroundColor: '#fcfaf6', borderColor: addr.is_default ? '#0f1a0e' : 'rgba(15,26,14,0.08)' }}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <LI size={13} style={{ color: '#c9a84c' }} />
                          <span className="text-xs font-black uppercase tracking-wider" style={{ color: '#0f1a0e' }}>{addr.label}</span>
                          {addr.is_default && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full font-black text-white" style={{ backgroundColor: '#0f1a0e' }}>
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {!addr.is_default && (
                            <button onClick={() => handleSetDefault(addr.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-xs font-bold"
                              style={{ color: 'rgba(15,26,14,0.4)' }}>
                              <Check size={12} />
                            </button>
                          )}
                          <button onClick={() => { setAddrForm({ label: addr.label, full_name: addr.full_name, phone: addr.phone, address: addr.address, city: addr.city, state: addr.state, pincode: addr.pincode, is_default: addr.is_default }); setEditingAddrId(addr.id); setShowAddrForm(true) }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                            <Edit2 size={12} style={{ color: 'rgba(15,26,14,0.4)' }} />
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 size={12} style={{ color: '#dc2626' }} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: '#0f1a0e' }}>{addr.full_name}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(15,26,14,0.5)' }}>
                        {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(15,26,14,0.4)' }}>📞 {addr.phone}</p>
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
