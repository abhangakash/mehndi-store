'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/clientApi'
import { inr, num, fmtDate } from '@/lib/format'
import { Card, PageHeader, Spinner, inputCls, labelCls, btnPrimary, btnGhost } from '@/components/admin/OfflineUI'

const LOW_STOCK = 10 // products at or below this are flagged "Low"

const REASON = {
  offline_sale: 'Offline sale',
  offline_cancel: 'Sale cancelled',
  restock: 'Restock',
  adjustment: 'Correction',
}

function StockPill({ stock }) {
  const s = num(stock)
  if (s <= 0) return <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">Out of stock</span>
  if (s <= LOW_STOCK) return <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">Low</span>
  return <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">In stock</span>
}

export default function OfflineStockPage() {
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(null) // product id with the adjust form open
  const [form, setForm] = useState({ mode: 'add', qty: '', note: '' })
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try { setData(await api('/api/offline/stock')) } catch (e) { toast.error(e.message); setData({ products: [], movements: [] }) }
  }, [])
  useEffect(() => { load() }, [load])

  async function submit(e, product) {
    e.preventDefault()
    if (busy) return
    const q = parseInt(form.qty, 10)
    if (!(q > 0)) return toast.error('Enter a quantity')
    setBusy(true)
    try {
      const res = await api('/api/offline/stock', {
        method: 'POST',
        body: JSON.stringify({
          product_id: product.id,
          change: form.mode === 'add' ? q : -q,
          reason: form.mode === 'add' ? 'restock' : 'adjustment',
          note: form.note,
        }),
      })
      toast.success(`${product.name}: stock is now ${res.stock}`)
      setOpen(null)
      setForm({ mode: 'add', qty: '', note: '' })
      await load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!data) return <div className="min-h-screen bg-slate-50"><Spinner /></div>

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-6 lg:py-8">
        <Link href="/admin/offline-orders" className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft size={14} /> All offline sales
        </Link>
        <PageHeader title="Stock" subtitle="One shared stock for online and offline sales. Every change made here is logged." />

        <div className="space-y-3">
          {data.products.map((p) => (
            <div key={p.id} className="rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500">List price {inr(p.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StockPill stock={p.stock} />
                  <p className="min-w-[3.5rem] text-right text-2xl font-bold text-slate-900">{num(p.stock)}</p>
                  <button type="button" onClick={() => { setOpen(open === p.id ? null : p.id); setForm({ mode: 'add', qty: '', note: '' }) }} className={btnGhost}>
                    {open === p.id ? 'Close' : 'Adjust'}
                  </button>
                </div>
              </div>

              {open === p.id && (
                <form onSubmit={(e) => submit(e, p)} className="grid gap-3 border-t border-slate-100 bg-slate-50 p-4 sm:grid-cols-4">
                  <div>
                    <label className={labelCls}>Action</label>
                    <select className={inputCls} value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                      <option value="add">Add stock (restock)</option>
                      <option value="remove">Remove (correction)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Quantity</label>
                    <input className={inputCls} inputMode="numeric" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value.replace(/\D/g, '') })} autoFocus />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Note (optional)</label>
                    <input className={inputCls} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. New batch from factory" />
                  </div>
                  <div className="sm:col-span-4">
                    <button type="submit" disabled={busy} className={btnPrimary}>{busy ? 'Saving…' : 'Update stock'}</button>
                  </div>
                </form>
              )}
            </div>
          ))}
          {data.products.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No products found.</p>}
        </div>

        <Card title="Recent stock movements" className="mt-5">
          {data.movements.length === 0 ? (
            <p className="text-sm text-slate-400">No movements yet. Sales, cancellations and adjustments made here will appear in this list.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.movements.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{m.product_name}</p>
                    <p className="text-xs text-slate-500">
                      {REASON[m.reason] || m.reason} · {fmtDate(m.created_at)}
                      {m.note ? ` · ${m.note}` : ''}
                      {m.order_id ? <> · <Link href={`/admin/offline-orders/${m.order_id}`} className="underline">view sale</Link></> : null}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`font-bold ${m.change > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{m.change > 0 ? `+${m.change}` : m.change}</p>
                    <p className="text-[11px] text-slate-400">now {m.stock_after}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
