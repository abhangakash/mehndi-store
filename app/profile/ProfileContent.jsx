'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import {
  User, Package, LogOut, Edit2, Save, X, MapPin,
  Clock, Truck, CheckCircle, XCircle, Plus, Home,
  Briefcase, Star, Trash2, Check
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#854F0B', bg: '#FAEEDA', icon: <Clock size={13} /> },
  confirmed: { label: 'Confirmed', color: '#185FA5', bg: '#E6F1FB', icon: <CheckCircle size={13} /> },
  shipped:   { label: 'Shipped',   color: '#534AB7', bg: '#EEEDFE', icon: <Truck size={13} /> },
  delivered: { label: 'Delivered', color: '#15803d', bg: '#dcfce7', icon: <CheckCircle size={13} /> },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fee2e2', icon: <XCircle size={13} /> },
}

const LABEL_OPTIONS = ['Home', 'Office', 'Other']
const LABEL_ICONS = { Home, Office: Briefcase, Other: MapPin }

function AddressCard({ addr, onEdit, onDelete, onSetDefault }) {
  const LabelIcon = LABEL_ICONS[addr.label] || MapPin
  return (
    <div className="rounded-xl border-2 p-4 relative transition-all"
      style={{
        borderColor: addr.is_default ? '#0f1a0e' : 'rgba(15,26,14,0.08)',
        backgroundColor: addr.is_default ? 'rgba(15,26,14,0.02)' : 'white',
      }}>
      {addr.is_default && (
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-black"
            style={{ backgroundColor: '#0f1a0e', color: '#c9a84c', fontSize: '9px' }}>
            <Star size={8} fill="#c9a84c" /> DEFAULT
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <LabelIcon size={13} style={{ color: '#c9a84c' }} />
        <span className="text-xs font-black uppercase tracking-wider" style={{ color: '#0f1a0e' }}>
          {addr.label}
        </span>
      </div>
      <p className="text-sm font-semibold mb-0.5" style={{ color: '#0f1a0e' }}>{addr.full_name}</p>
      <p className="text-xs leading-relaxed mb-0.5" style={{ color: 'rgba(15,26,14,0.5)' }}>
        {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
      </p>
      <p className="text-xs" style={{ color: 'rgba(15,26,14,0.4)' }}>📞 {addr.phone}</p>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(15,26,14,0.06)' }}>
        {!addr.is_default && (
          <button onClick={() => onSetDefault(addr.id)}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors hover:bg-gray-50"
            style={{ color: 'rgba(15,26,14,0.4)' }}>
            <Check size={11} /> Set Default
          </button>
        )}
        <button onClick={() => onEdit(addr)}
          className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors hover:bg-gray-50"
          style={{ color: 'rgba(15,26,14,0.5)' }}>
          <Edit2 size={11} /> Edit
        </button>
        <button onClick={() => onDelete(addr.id)}
          className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors hover:bg-red-50 ml-auto"
          style={{ color: '#dc2626' }}>
          <Trash2 size={11} /> Delete
        </button>
      </div>
    </div>
  )
}

const EMPTY_ADDR = { label: 'Home', full_name: '', phone: '', address: '', city: '', state: '', pincode: '', is_default: false }

export default function ProfileContent() {
  const { user, profile, loading, signOut, fetchProfile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') === 'orders' ? 'orders' : searchParams.get('tab') === 'addresses' ? 'addresses' : 'profile')

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
      if (addrForm.is_default) {
        await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
      }
      if (editingAddrId) {
        await supabase.from('addresses').update({ ...addrForm }).eq('id', editingAddrId)
        toast.success('Address updated!')
      } else {
        const isFirst = addresses.length === 0
        await supabase.from('addresses').insert({ ...addrForm, user_id: user.id, is_default: isFirst || addrForm.is_default })
        toast.success('Address saved!')
      }
      setShowAddrForm(false)
      setEditingAddrId(null)
      setAddrForm(EMPTY_ADDR)
      loadAddresses()
    } catch (err) {
      toast.error('Failed to save address')
    }
    setAddrSaving(false)
  }

  const handleEditAddress = (addr) => {
    setAddrForm({ label: addr.label, full_name: addr.full_name, phone: addr.phone, address: addr.address, city: addr.city, state: addr.state, pincode: addr.pincode, is_default: addr.is_default })
    setEditingAddrId(addr.id)
    setShowAddrForm(true)
  }

  const handleDeleteAddress = async (id) => {
    await supabase.from('addresses').delete().eq('id', id)
    toast.success('Address deleted')
    loadAddresses()
  }

  const handleSetDefault = async (id) => {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
    await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    toast.success('Default address updated!')
    loadAddresses()
  }

  const handleSignOut = async () => { await signOut(); toast.success('Signed out'); router.push('/') }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin border-[#c9a84c]" />
    </div>
  )
  if (!user) return null

  const initials = (profile?.full_name || user.email || 'U').slice(0, 2).toUpperCase()

  const TABS = [
    { key: 'profile', label: 'Profile', icon: <User size={14} /> },
    { key: 'addresses', label: 'Addresses', icon: <MapPin size={14} /> },
    { key: 'orders', label: 'Orders', icon: <Package size={14} /> },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div className="px-4 pt-8 pb-5 max-w-3xl mx-auto">
        <div className="rounded-2xl p-5 flex items-center gap-4 border" style={{ backgroundColor: '#fcfaf6', borderColor: 'rgba(15,26,14,0.06)' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-black flex-shrink-0"
            style={{ backgroundColor: '#0f1a0e' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-base truncate" style={{ color: '#0f1a0e' }}>
              {profile?.full_name || 'My Account'}
            </h1>
            <p className="text-xs truncate" style={{ color: 'rgba(15,26,14,0.4)' }}>{user.email}</p>
          </div>
          <button onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs font-black px-3 py-2 rounded-xl border transition-colors hover:bg-red-50 text-red-500 flex-shrink-0"
            style={{ borderColor: '#fca5a5' }}>
            <LogOut size={13} /> Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all whitespace-nowrap"
              style={{
                backgroundColor: tab === t.key ? '#c9a84c' : 'rgba(15,26,14,0.05)',
                color: tab === t.key ? '#0f1a0e' : 'rgba(15,26,14,0.5)',
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-10 max-w-3xl mx-auto">
        {tab === 'profile' && (
          <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: '#fcfaf6', borderColor: 'rgba(15,26,14,0.06)' }}>
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
                  <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(15,26,14,0.4)' }}>
                    {f.label}
                  </label>
                  {editing && !f.readonly && f.field
                    ? <input type={f.type || 'text'} value={form[f.field]} placeholder={f.placeholder}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:border-[#0f1a0e] outline-none transition-all text-sm font-medium"
                        style={{ borderColor: 'rgba(15,26,14,0.1)' }}
                        onChange={e => setForm(fm => ({ ...fm, [f.field]: e.target.value }))} />
                    : <p className="text-sm font-medium py-2.5 px-4 rounded-xl border"
                        style={{ backgroundColor: 'white', borderColor: 'rgba(15,26,14,0.04)', color: f.readonly ? 'rgba(15,26,14,0.4)' : '#0f1a0e' }}>
                        {f.value || '—'}
                      </p>
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'addresses' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.4)' }}>
                {addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}
              </p>
              <button onClick={() => { setShowAddrForm(true); setEditingAddrId(null); setAddrForm(EMPTY_ADDR) }}
                className="flex items-center gap-1.5 text-xs font-black px-4 py-2.5 rounded-xl transition-all"
                style={{ backgroundColor: '#c9a84c', color: '#0f1a0e' }}>
                <Plus size={13} /> Add Address
              </button>
            </div>

            {showAddrForm && (
              <div className="rounded-2xl overflow-hidden mb-6 border shadow-sm" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(15,26,14,0.08)' }}>
                <div className="px-5 py-4 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(15,26,14,0.06)', backgroundColor: '#fef9ee' }}>
                  <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#0f1a0e' }}>
                    {editingAddrId ? 'Edit Address' : 'New Address'}
                  </p>
                  <button onClick={() => { setShowAddrForm(false); setEditingAddrId(null) }}>
                    <X size={16} style={{ color: 'rgba(15,26,14,0.4)' }} />
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(15,26,14,0.5)' }}>Label</label>
                    <div className="flex flex-wrap gap-2">
                      {LABEL_OPTIONS.map(l => {
                        const LI = LABEL_ICONS[l] || MapPin
                        return (
                          <button key={l} type="button" onClick={() => setAddrForm(f => ({ ...f, label: l }))}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide border-2 transition-all"
                            style={{
                              borderColor: addrForm.label === l ? '#0f1a0e' : 'rgba(15,26,14,0.06)',
                              backgroundColor: addrForm.label === l ? '#0f1a0e' : 'transparent',
                              color: addrForm.label === l ? 'white' : 'rgba(15,26,14,0.4)',
                            }}>
                            <LI size={11} /> {l}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.5)' }}>Full Name *</label>
                      <input className="w-full px-4 py-2.5 rounded-xl border-2 focus:border-[#0f1a0e] outline-none text-sm transition-all"
                             style={{ borderColor: 'rgba(15,26,14,0.06)' }}
                             value={addrForm.full_name} onChange={e => setAddrForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Full Name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.5)' }}>Phone *</label>
                      <input className="w-full px-4 py-2.5 rounded-xl border-2 focus:border-[#0f1a0e] outline-none text-sm transition-all"
                             style={{ borderColor: 'rgba(15,26,14,0.06)' }}
                             type="tel" value={addrForm.phone} onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} placeholder="Phone Number" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.5)' }}>Address *</label>
                    <textarea className="w-full px-4 py-2.5 rounded-xl border-2 focus:border-[#0f1a0e] outline-none text-sm transition-all resize-none"
                              style={{ borderColor: 'rgba(15,26,14,0.06)' }}
                              value={addrForm.address} onChange={e => setAddrForm(f => ({ ...f, address: e.target.value }))} placeholder="House/flat no, street, area..." rows={2} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.5)' }}>City *</label>
                      <input className="w-full px-4 py-2.5 rounded-xl border-2 focus:border-[#0f1a0e] outline-none text-sm transition-all"
                             style={{ borderColor: 'rgba(15,26,14,0.06)' }}
                             value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} placeholder="City" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.5)' }}>State *</label>
                      <input className="w-full px-4 py-2.5 rounded-xl border-2 focus:border-[#0f1a0e] outline-none text-sm transition-all"
                             style={{ borderColor: 'rgba(15,26,14,0.06)' }}
                             value={addrForm.state} onChange={e => setAddrForm(f => ({ ...f, state: e.target.value }))} placeholder="State" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(15,26,14,0.5)' }}>Pincode *</label>
                      <input className="w-full px-4 py-2.5 rounded-xl border-2 focus:border-[#0f1a0e] outline-none text-sm transition-all"
                             style={{ borderColor: 'rgba(15,26,14,0.06)' }}
                             value={addrForm.pincode} onChange={e => setAddrForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))} placeholder="Pincode" />
                    </div>
                  </div>
                  
                  {/* ALIGNMENT FIX: items-center and w-auto */}
                  <label className="flex items-center gap-2 cursor-pointer w-max">
                    <input type="checkbox" checked={addrForm.is_default} onChange={e => setAddrForm(f => ({ ...f, is_default: e.target.checked }))} 
                      className="w-4 h-4 rounded border-gray-300 text-[#0f1a0e] focus:ring-[#0f1a0e]" />
                    <span className="text-xs font-bold leading-none" style={{ color: 'rgba(15,26,14,0.6)' }}>Set as default address</span>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button onClick={handleSaveAddress} disabled={addrSaving}
                      className="flex-1 order-2 sm:order-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-md active:scale-95"
                      style={{ backgroundColor: '#0f1a0e' }}>
                      {addrSaving ? 'Saving...' : editingAddrId ? 'Update Address' : 'Save Address'}
                    </button>
                    <button onClick={() => { setShowAddrForm(false); setEditingAddrId(null) }}
                      className="flex-1 order-1 sm:order-2 px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all hover:bg-gray-50"
                      style={{ borderColor: 'rgba(15,26,14,0.08)', color: 'rgba(15,26,14,0.5)' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {addrLoading ? (
              <div className="rounded-2xl p-10 text-center border" style={{ backgroundColor: '#fcfaf6' }}>
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto border-[#c9a84c]" />
              </div>
            ) : addresses.length === 0 && !showAddrForm ? (
              <div className="rounded-2xl p-10 text-center border" style={{ backgroundColor: '#fcfaf6' }}>
                <MapPin size={36} className="mx-auto mb-3" style={{ color: 'rgba(15,26,14,0.1)' }} />
                <p className="font-black text-sm mb-1" style={{ color: '#0f1a0e' }}>No saved addresses</p>
                <p className="text-xs mb-4" style={{ color: 'rgba(15,26,14,0.4)' }}>Add an address for faster checkout</p>
                <button onClick={() => setShowAddrForm(true)}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white"
                  style={{ backgroundColor: '#0f1a0e' }}>
                  <Plus size={12} className="inline mr-1" /> Add Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <AddressCard key={addr.id} addr={addr}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                    onSetDefault={handleSetDefault} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div className="rounded-2xl p-10 text-center border" style={{ backgroundColor: '#fcfaf6' }}>
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto border-[#c9a84c]" />
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl p-10 text-center border" style={{ backgroundColor: '#fcfaf6' }}>
                <Package size={36} className="mx-auto mb-3" style={{ color: 'rgba(15,26,14,0.1)' }} />
                <p className="font-black text-sm mb-1" style={{ color: '#0f1a0e' }}>No orders yet</p>
                <Link href="/products" className="inline-block mt-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white"
                  style={{ backgroundColor: '#0f1a0e' }}>Start Shopping</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map(order => {
                  const status = order.order_status || 'pending'
                  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
                  return (
                    <div key={order.id} className="rounded-2xl overflow-hidden border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(15,26,14,0.06)' }}>
                      <div className="p-4 flex items-start justify-between gap-3" style={{ borderBottom: '1px solid rgba(15,26,14,0.06)', backgroundColor: '#fcfaf6' }}>
                        <div>
                          <p className="text-xs mb-0.5 font-black uppercase tracking-wider" style={{ color: 'rgba(15,26,14,0.4)' }}>
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="font-black text-base" style={{ color: '#c9a84c' }}>₹{Number(order.total_amount).toFixed(0)}</p>
                          <p className="text-xs" style={{ color: 'rgba(15,26,14,0.4)' }}>
                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-black flex-shrink-0"
                          style={{ backgroundColor: config.bg, color: config.color }}>
                          {config.icon} {config.label}
                        </span>
                      </div>
                      <div className="p-4 border-b bg-white" style={{ borderColor: 'rgba(15,26,14,0.06)' }}>
                        {order.order_items?.map(item => (
                          <div key={item.id} className="flex justify-between py-1">
                            <span className="text-xs" style={{ color: '#0f1a0e' }}>{item.product_name} × {item.quantity}</span>
                            <span className="text-xs font-black" style={{ color: '#c9a84c' }}>₹{Number(item.total_price).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between bg-white">
                        <div className="flex items-start gap-2">
                          <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: 'rgba(15,26,14,0.3)' }} />
                          <p className="text-xs" style={{ color: 'rgba(15,26,14,0.4)' }}>
                            {order.city}, {order.state}
                          </p>
                        </div>
                        <a href={`/api/send-invoice?orderId=${order.id}`} target="_blank" rel="noreferrer"
                          className="text-xs font-black uppercase tracking-wide underline"
                          style={{ color: '#c9a84c' }}>Invoice</a>
                      </div>
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