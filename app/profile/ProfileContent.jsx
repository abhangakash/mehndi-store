'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { User, Package, LogOut, Edit2, Save, X, MapPin, Clock, Truck, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#854F0B', bg: '#FAEEDA', icon: <Clock size={13} /> },
  confirmed: { label: 'Confirmed', color: '#185FA5', bg: '#E6F1FB', icon: <CheckCircle size={13} /> },
  shipped:   { label: 'Shipped',   color: '#534AB7', bg: '#EEEDFE', icon: <Truck size={13} /> },
  delivered: { label: 'Delivered', color: '#15803d', bg: '#dcfce7', icon: <CheckCircle size={13} /> },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fee2e2', icon: <XCircle size={13} /> },
}

export default function ProfileContent() {
  const { user, profile, loading, signOut, fetchProfile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') === 'orders' ? 'orders' : 'profile')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ full_name: '', phone: '' })

  useEffect(() => { if (!loading && !user) router.push('/login') }, [user, loading, router])
  useEffect(() => { if (profile) setForm({ full_name: profile.full_name || '', phone: profile.phone || '' }) }, [profile])

  const loadOrders = useCallback(async () => {
    if (!user) return
    setOrdersLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setOrdersLoading(false)
  }, [user])

  useEffect(() => { if (tab === 'orders' && user) loadOrders() }, [tab, user, loadOrders])

  const handleSaveProfile = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, phone: form.phone })
      .eq('id', user.id)
    if (error) toast.error('Failed to save')
    else { toast.success('Profile updated!'); fetchProfile(user.id); setEditing(false) }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--brand-surface)' }}>
      <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--brand-green)' }} />
    </div>
  )
  if (!user) return null

  const initials = (profile?.full_name || user.email || 'U').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: 'var(--brand-surface)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="card p-6 mb-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0"
            style={{ backgroundColor: 'var(--brand-green)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate" style={{ color: 'var(--brand-text)' }}>
              {profile?.full_name || 'My Account'}
            </h1>
            <p className="text-sm truncate" style={{ color: 'var(--brand-muted)' }}>
              {user.email || user.phone}
            </p>
          </div>
          <button onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border hover:bg-red-50 text-red-500"
            style={{ borderColor: '#fca5a5' }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: 'profile', label: 'Profile', icon: <User size={15} /> },
            { key: 'orders', label: 'My Orders', icon: <Package size={15} /> },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: tab === t.key ? 'var(--brand-green)' : 'white',
                color: tab === t.key ? 'white' : 'var(--brand-muted)',
                border: `1px solid ${tab === t.key ? 'var(--brand-green)' : 'var(--brand-border)'}`,
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === 'profile' && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold" style={{ color: 'var(--brand-text)' }}>Account Details</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg"
                  style={{ color: 'var(--brand-green)', border: '1px solid var(--brand-green)' }}>
                  <Edit2 size={13} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)}
                    className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-muted)' }}>
                    <X size={13} /> Cancel
                  </button>
                  <button onClick={handleSaveProfile} disabled={saving}
                    className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg text-white"
                    style={{ backgroundColor: 'var(--brand-green)' }}>
                    <Save size={13} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Full Name</label>
                {editing
                  ? <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Your name" />
                  : <p className="text-sm py-2.5 px-4 rounded-lg" style={{ backgroundColor: 'var(--brand-surface)', color: 'var(--brand-text)' }}>{profile?.full_name || '—'}</p>
                }
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Email</label>
                <p className="text-sm py-2.5 px-4 rounded-lg" style={{ backgroundColor: 'var(--brand-surface)', color: 'var(--brand-muted)' }}>
                  {user.email || '—'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>Phone</label>
                {editing
                  ? <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="9876543210" />
                  : <p className="text-sm py-2.5 px-4 rounded-lg" style={{ backgroundColor: 'var(--brand-surface)', color: 'var(--brand-text)' }}>{profile?.phone || user.phone || '—'}</p>
                }
              </div>
            </div>
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div className="card p-10 text-center">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto"
                  style={{ borderColor: 'var(--brand-green)' }} />
              </div>
            ) : orders.length === 0 ? (
              <div className="card p-10 text-center">
                <Package size={40} className="mx-auto mb-3" style={{ color: 'var(--brand-muted)' }} />
                <p className="font-medium mb-1" style={{ color: 'var(--brand-text)' }}>No orders yet</p>
                <Link href="/products" className="btn-primary text-sm mt-3 inline-flex">Start Shopping</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map(order => {
                  const status = order.order_status || 'pending'
                  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
                  return (
                    <div key={order.id} className="card overflow-hidden">
                      <div className="p-4 border-b flex items-start justify-between gap-3" style={{ borderColor: 'var(--brand-border)' }}>
                        <div>
                          <p className="text-xs mb-0.5" style={{ color: 'var(--brand-muted)' }}>#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="font-semibold" style={{ color: 'var(--brand-text)' }}>₹{Number(order.total_amount).toFixed(0)}</p>
                          <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>
                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: config.bg, color: config.color }}>
                          {config.icon} {config.label}
                        </span>
                      </div>
                      <div className="p-4 border-b" style={{ borderColor: 'var(--brand-border)' }}>
                        {order.order_items?.map(item => (
                          <div key={item.id} className="flex justify-between py-0.5">
                            <span className="text-sm" style={{ color: 'var(--brand-text)' }}>{item.product_name} × {item.quantity}</span>
                            <span className="text-sm font-medium" style={{ color: 'var(--brand-brown)' }}>₹{Number(item.total_price).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 flex items-start gap-2">
                        <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-muted)' }} />
                        <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>
                          {order.address}, {order.city} — {order.pincode}
                        </p>
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