'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/clientApi'
import { inr, num } from '@/lib/format'
import { Card, PageHeader, Spinner, inputCls, labelCls, btnPrimary, btnGhost } from '@/components/admin/OfflineUI'

const EMPTY = { name: '', phone: '', customer_type: 'wholesale', address: '', city: '', state: 'Maharashtra', pincode: '', gstin: '' }

export default function OfflineCustomersPage() {
  const [q, setQ] = useState('')
  const [dueOnly, setDueOnly] = useState(false)
  const [customers, setCustomers] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (dueOnly) params.set('due', '1')
    try {
      const d = await api(`/api/offline/customers?${params.toString()}`)
      setCustomers(d.customers)
    } catch (e) {
      toast.error(e.message)
      setCustomers([])
    }
  }, [q, dueOnly])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function save(e) {
    e.preventDefault()
    if (saving) return
    if (!form.name.trim()) return toast.error('Enter the customer name')
    setSaving(true)
    try {
      await api('/api/offline/customers', { method: 'POST', body: JSON.stringify(form) })
      toast.success('Customer added')
      setForm(EMPTY)
      setShowForm(false)
      await load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const totalDue = (customers || []).reduce((t, c) => t + num(c.balance_due), 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-6 lg:py-8">
        <Link href="/admin/offline-orders" className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft size={14} /> All offline sales
        </Link>
        <PageHeader title="Customers" subtitle="Wholesale and retail buyers, with what each one still owes">
          <button type="button" onClick={() => setShowForm((s) => !s)} className={btnPrimary}><Plus size={14} /> Add customer</button>
        </PageHeader>

        {showForm && (
          <Card title="New customer" className="mb-4">
            <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
              <div><label className={labelCls}>Name / shop name *</label><input className={inputCls} value={form.name} onChange={set('name')} /></div>
              <div><label className={labelCls}>Phone</label><input className={inputCls} inputMode="tel" value={form.phone} onChange={set('phone')} /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Address</label><input className={inputCls} value={form.address} onChange={set('address')} /></div>
              <div><label className={labelCls}>City</label><input className={inputCls} value={form.city} onChange={set('city')} /></div>
              <div><label className={labelCls}>State</label><input className={inputCls} value={form.state} onChange={set('state')} /></div>
              <div><label className={labelCls}>Pincode</label><input className={inputCls} inputMode="numeric" value={form.pincode} onChange={set('pincode')} /></div>
              <div>
                <label className={labelCls}>Type</label>
                <select className={inputCls} value={form.customer_type} onChange={set('customer_type')}>
                  <option value="wholesale">Wholesale</option>
                  <option value="retail">Retail</option>
                </select>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <button type="submit" disabled={saving} className={btnPrimary}>{saving ? 'Saving…' : 'Save customer'}</button>
                <button type="button" onClick={() => setShowForm(false)} className={btnGhost}>Cancel</button>
              </div>
            </form>
          </Card>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className={`${inputCls} pl-9`} placeholder="Search name or phone" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600">
            <input type="checkbox" checked={dueOnly} onChange={(e) => setDueOnly(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Only customers with balance due
          </label>
        </div>

        {!customers ? (
          <Spinner />
        ) : customers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">
            No customers yet. They are added automatically when you make a sale with a phone number.
          </div>
        ) : (
          <>
            <p className="mb-2 text-xs text-slate-500">
              {customers.length} customers · total outstanding <b className="text-rose-600">{inr(totalDue)}</b>
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {customers.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.phone || 'No phone'}{c.city ? ` · ${c.city}` : ''}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold capitalize text-slate-600">{c.customer_type}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div><p className="text-slate-500">Sales</p><p className="font-bold text-slate-900">{c.orders_count}</p></div>
                    <div><p className="text-slate-500">Billed</p><p className="font-bold text-slate-900">{inr(c.total_billed)}</p></div>
                    <div><p className="text-slate-500">Owes</p><p className={`font-bold ${num(c.balance_due) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{inr(c.balance_due)}</p></div>
                  </div>
                  <Link href={`/admin/offline-orders?customer_id=${c.id}`} className="mt-3 inline-block text-xs font-semibold text-slate-900 underline">View sales</Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
