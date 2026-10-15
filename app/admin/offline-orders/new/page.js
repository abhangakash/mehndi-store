'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/clientApi'
import { inr, num, todayIST, PAYMENT_METHODS } from '@/lib/format'
import { Card, PageHeader, Spinner, inputCls, labelCls, btnPrimary, btnGhost } from '@/components/admin/OfflineUI'

const EMPTY_CUSTOMER = { id: null, name: '', phone: '', address: '', city: '', state: 'Maharashtra', pincode: '', gstin: '', customer_type: 'wholesale' }
let keySeed = 1
const newLine = () => ({ key: keySeed++, product_id: '', qty: '1', rate: '' })

export default function NewOfflineSalePage() {
  const router = useRouter()
  const [products, setProducts] = useState(null)
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER)
  const [linked, setLinked] = useState(null) // existing customer summary chip
  const [suggestions, setSuggestions] = useState([])
  const [lines, setLines] = useState([newLine()])
  const [discount, setDiscount] = useState('')
  const [payMode, setPayMode] = useState('full') // full | partial | none
  const [partialAmt, setPartialAmt] = useState('')
  const [method, setMethod] = useState('cash')
  const [reference, setReference] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { setDate(todayIST()) }, [])

  useEffect(() => {
    api('/api/offline/stock')
      .then((d) => setProducts(d.products))
      .catch((e) => { toast.error(e.message); setProducts([]) })
  }, [])

  // customer search (by name or phone) while typing, until one is chosen
  useEffect(() => {
    const q = (customer.name.length >= 2 ? customer.name : customer.phone.length >= 3 ? customer.phone : '').trim()
    if (linked || !q) { setSuggestions([]); return }
    const t = setTimeout(() => {
      api(`/api/offline/customers?q=${encodeURIComponent(q)}`)
        .then((d) => setSuggestions((d.customers || []).slice(0, 5)))
        .catch(() => setSuggestions([]))
    }, 250)
    return () => clearTimeout(t)
  }, [customer.name, customer.phone, linked])

  const productById = useMemo(() => Object.fromEntries((products || []).map((p) => [String(p.id), p])), [products])

  const setC = (k) => (e) => setCustomer((c) => ({ ...c, [k]: e.target.value }))

  function chooseCustomer(c) {
    setCustomer({
      id: c.id, name: c.name || '', phone: c.phone || '', address: c.address || '', city: c.city || '',
      state: c.state || 'Maharashtra', pincode: c.pincode || '', gstin: c.gstin || '', customer_type: c.customer_type || 'wholesale',
    })
    setLinked(c)
    setSuggestions([])
  }
  function unlinkCustomer() { setLinked(null); setCustomer(EMPTY_CUSTOMER) }

  function updateLine(key, patch) {
    setLines((ls) => ls.map((l) => {
      if (l.key !== key) return l
      const next = { ...l, ...patch }
      // picking a product pre-fills the rate with its list price (edit freely for wholesale)
      if (patch.product_id !== undefined) {
        const p = productById[String(patch.product_id)]
        next.rate = p ? String(num(p.price)) : ''
      }
      return next
    }))
  }

  const subtotal = lines.reduce((t, l) => t + num(l.qty) * num(l.rate), 0)
  const disc = Math.max(0, num(discount))
  const total = Math.max(0, subtotal - disc)
  const paid = payMode === 'full' ? total : payMode === 'none' ? 0 : Math.max(0, num(partialAmt))
  const balance = total - paid

  async function submit(e) {
    e.preventDefault()
    if (saving) return

    if (!customer.name.trim()) return toast.error('Enter the customer name')
    const filled = lines.filter((l) => l.product_id)
    if (!filled.length) return toast.error('Add at least one product')

    // stock check per product (same product on two lines is added up)
    const need = {}
    for (const l of filled) {
      const q = parseInt(l.qty, 10)
      if (!(q > 0)) return toast.error('Quantity must be at least 1')
      if (!(num(l.rate) >= 0) || l.rate === '') return toast.error('Enter the rate for every item')
      need[l.product_id] = (need[l.product_id] || 0) + q
    }
    for (const [pid, q] of Object.entries(need)) {
      const p = productById[pid]
      if (p && q > num(p.stock)) return toast.error(`Only ${num(p.stock)} in stock for ${p.name}`)
    }
    if (disc > subtotal) return toast.error('Discount is more than the subtotal')
    if (paid > total) return toast.error('Paid amount is more than the total')
    if (payMode === 'partial' && !(paid > 0)) return toast.error('Enter the amount received')

    setSaving(true)
    try {
      const res = await api('/api/offline/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer,
          items: filled.map((l) => ({ product_id: l.product_id, quantity: parseInt(l.qty, 10), unit_price: num(l.rate) })),
          discount: disc,
          paid,
          method,
          reference,
          date,
          notes,
        }),
      })
      toast.success('Sale saved')
      router.push(`/admin/offline-orders/${res.id}`)
    } catch (err) {
      toast.error(err.message)
      setSaving(false)
    }
  }

  if (!products) return <div className="min-h-screen bg-slate-50"><Spinner /></div>

  return (
    <div className="min-h-screen bg-slate-50">
      <form onSubmit={submit} className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-6 lg:py-8">
        <Link href="/admin/offline-orders" className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft size={14} /> All offline sales
        </Link>
        <PageHeader title="New sale" subtitle="Stock is deducted and an invoice number is created when you save." />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {/* ---------- Customer ---------- */}
            <Card title="Customer">
              {linked ? (
                <div className="mb-3 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs">
                  <span className="text-emerald-800">
                    Existing customer{Number(linked.balance_due) > 0 ? ` · owes ${inr(linked.balance_due)}` : ''}
                  </span>
                  <button type="button" onClick={unlinkCustomer} className="inline-flex items-center gap-1 font-semibold text-emerald-900 underline">
                    <X size={12} /> Change
                  </button>
                </div>
              ) : null}

              <div className="mb-3 inline-flex rounded-lg border border-slate-300 p-0.5 text-xs font-semibold">
                {['wholesale', 'retail'].map((t) => (
                  <button
                    key={t} type="button"
                    onClick={() => setCustomer((c) => ({ ...c, customer_type: t }))}
                    className={`rounded-md px-3.5 py-1.5 capitalize transition ${customer.customer_type === t ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                  >{t}</button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="relative sm:col-span-1">
                  <label className={labelCls}>Name / shop name *</label>
                  <input className={inputCls} value={customer.name} onChange={setC('name')} placeholder="e.g. Shree Ganesh Medical" autoComplete="off" />
                  {suggestions.length > 0 && (
                    <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                      {suggestions.map((c) => (
                        <li key={c.id}>
                          <button type="button" onClick={() => chooseCustomer(c)} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50">
                            <span className="truncate font-medium text-slate-900">{c.name}</span>
                            <span className="shrink-0 text-xs text-slate-500">{c.phone}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input className={inputCls} inputMode="tel" value={customer.phone} onChange={setC('phone')} placeholder="10-digit mobile" autoComplete="off" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Address</label>
                  <input className={inputCls} value={customer.address} onChange={setC('address')} placeholder="Shop / street / area" />
                </div>
                <div><label className={labelCls}>City</label><input className={inputCls} value={customer.city} onChange={setC('city')} /></div>
                <div><label className={labelCls}>State</label><input className={inputCls} value={customer.state} onChange={setC('state')} /></div>
                <div><label className={labelCls}>Pincode</label><input className={inputCls} inputMode="numeric" value={customer.pincode} onChange={setC('pincode')} /></div>
                <div><label className={labelCls}>Customer GSTIN (optional)</label><input className={inputCls} value={customer.gstin} onChange={setC('gstin')} /></div>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Customers with a phone number are saved automatically for next time.</p>
            </Card>

            {/* ---------- Items ---------- */}
            <Card title="Items">
              <div className="space-y-3">
                {lines.map((l, idx) => {
                  const p = productById[String(l.product_id)]
                  const amount = num(l.qty) * num(l.rate)
                  return (
                    <div key={l.key} className="rounded-lg border border-slate-200 p-3">
                      <div className="grid grid-cols-12 items-end gap-2">
                        <div className="col-span-12 sm:col-span-5">
                          <label className={labelCls}>Product</label>
                          <select className={inputCls} value={l.product_id} onChange={(e) => updateLine(l.key, { product_id: e.target.value })}>
                            <option value="">Select product…</option>
                            {products.map((pr) => (
                              <option key={pr.id} value={pr.id} disabled={num(pr.stock) <= 0}>
                                {pr.name} — {num(pr.stock) > 0 ? `${num(pr.stock)} in stock` : 'out of stock'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                          <label className={labelCls}>Qty</label>
                          <input className={inputCls} inputMode="numeric" value={l.qty} onChange={(e) => updateLine(l.key, { qty: e.target.value.replace(/\D/g, '') })} />
                        </div>
                        <div className="col-span-8 sm:col-span-3">
                          <label className={labelCls}>Rate (₹)</label>
                          <input className={inputCls} inputMode="decimal" value={l.rate} onChange={(e) => updateLine(l.key, { rate: e.target.value.replace(/[^\d.]/g, '') })} />
                        </div>
                        <div className="col-span-10 sm:col-span-2 sm:text-right">
                          <p className={labelCls}>Amount</p>
                          <p className="py-2 text-sm font-bold text-slate-900">{inr(amount)}</p>
                        </div>
                        <div className="col-span-2 flex justify-end sm:hidden">
                          {lines.length > 1 && (
                            <button type="button" onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))} className="rounded-lg p-2.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove item">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{p && num(l.qty) > num(p.stock) ? <span className="font-semibold text-rose-600">Only {num(p.stock)} in stock</span> : p ? `List price ${inr(p.price)}` : `Item ${idx + 1}`}</span>
                        {lines.length > 1 && (
                          <button type="button" onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))} className="hidden items-center gap-1 font-semibold text-slate-400 hover:text-rose-600 sm:inline-flex">
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <button type="button" onClick={() => setLines((ls) => [...ls, newLine()])} className={`${btnGhost} mt-3`}>
                <Plus size={14} /> Add item
              </button>
            </Card>

            <Card title="Notes (printed on the invoice)">
              <textarea className={inputCls} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional — e.g. delivery date, remarks" />
            </Card>
          </div>

          {/* ---------- Summary + payment ---------- */}
          <div className="space-y-4">
            <Card title="Invoice">
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Invoice date</label>
                  <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Discount (₹)</label>
                  <input className={inputCls} inputMode="decimal" value={discount} onChange={(e) => setDiscount(e.target.value.replace(/[^\d.]/g, ''))} placeholder="0" />
                </div>
              </div>

              <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
                <div className="flex justify-between text-slate-600"><dt>Subtotal</dt><dd>{inr(subtotal)}</dd></div>
                {disc > 0 && <div className="flex justify-between text-slate-600"><dt>Discount</dt><dd>- {inr(disc)}</dd></div>}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900"><dt>Total</dt><dd>{inr(total)}</dd></div>
              </dl>
            </Card>

            <Card title="Payment">
              <div className="grid grid-cols-3 gap-1 rounded-lg border border-slate-300 p-0.5 text-xs font-semibold">
                {[['full', 'Paid in full'], ['partial', 'Partial'], ['none', 'Not paid']].map(([v, label]) => (
                  <button key={v} type="button" onClick={() => setPayMode(v)}
                    className={`rounded-md px-2 py-2 transition ${payMode === v ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>{label}</button>
                ))}
              </div>

              {payMode === 'partial' && (
                <div className="mt-3">
                  <label className={labelCls}>Amount received now (₹)</label>
                  <input className={inputCls} inputMode="decimal" value={partialAmt} onChange={(e) => setPartialAmt(e.target.value.replace(/[^\d.]/g, ''))} />
                </div>
              )}

              {payMode !== 'none' && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Method</label>
                    <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)}>
                      {Object.entries(PAYMENT_METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Reference</label>
                    <input className={inputCls} value={reference} onChange={(e) => setReference(e.target.value)} placeholder="UTR / cheque no." />
                  </div>
                </div>
              )}

              <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
                <div className="flex justify-between text-slate-600"><dt>Paid now</dt><dd>{inr(paid)}</dd></div>
                <div className={`flex justify-between font-bold ${balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}><dt>Balance due</dt><dd>{inr(balance)}</dd></div>
              </dl>
            </Card>

            <button type="submit" disabled={saving} className={`${btnPrimary} w-full py-3.5`}>
              {saving ? 'Saving…' : 'Save sale & create invoice'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
