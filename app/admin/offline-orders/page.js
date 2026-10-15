'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Users, Boxes } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/clientApi'
import { inr, fmtDate } from '@/lib/format'
import { PageHeader, SummaryCard, StatusBadge, Spinner, inputCls, btnPrimary, btnGhost } from '@/components/admin/OfflineUI'

export default function OfflineOrdersPage() {
  const [filters, setFilters] = useState({ q: '', payment: '', status: 'active', from: '', to: '' })
  const [customerId, setCustomerId] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // ?customer_id=... comes from the Customers page ("View sales")
  useEffect(() => {
    setCustomerId(new URLSearchParams(window.location.search).get('customer_id') || '')
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v))
    if (customerId) params.set('customer_id', customerId)

    let cancelled = false
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await api(`/api/offline/orders?${params.toString()}`)
        if (!cancelled) setData(res)
      } catch (e) {
        if (!cancelled) toast.error(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 250)
    return () => { cancelled = true; clearTimeout(t) }
  }, [filters, customerId])

  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }))
  const orders = data?.orders || []
  const sum = data?.summary

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-6 lg:py-8">
        <PageHeader title="Offline sales" subtitle="Wholesale and counter sales, invoices and payments">
          <Link href="/admin/offline-customers" className={btnGhost}><Users size={14} /> Customers</Link>
          <Link href="/admin/offline-stock" className={btnGhost}><Boxes size={14} /> Stock</Link>
          <Link href="/admin/offline-orders/new" className={btnPrimary}><Plus size={14} /> New sale</Link>
        </PageHeader>

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard label="Today's sales" value={sum ? inr(sum.todaySales) : '—'} />
          <SummaryCard label="This month" value={sum ? inr(sum.monthSales) : '—'} hint={sum ? `${sum.monthCount} invoices` : ''} />
          <SummaryCard label="Total pending" value={sum ? inr(sum.totalDue) : '—'} hint={sum ? `${sum.dueCount} invoices unpaid` : ''} />
          <SummaryCard label="Showing" value={orders.length} hint="matching invoices" />
        </div>

        {/* Filters */}
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-3 lg:grid-cols-6">
          <div className="relative col-span-2 lg:col-span-2">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className={`${inputCls} pl-9`} placeholder="Search name, phone or invoice no." value={filters.q} onChange={set('q')} />
          </div>
          <select className={inputCls} value={filters.payment} onChange={set('payment')}>
            <option value="">All payments</option>
            <option value="paid">Paid</option>
            <option value="partial">Partially paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <select className={inputCls} value={filters.status} onChange={set('status')}>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="">All</option>
          </select>
          <input type="date" className={inputCls} value={filters.from} onChange={set('from')} aria-label="From date" />
          <input type="date" className={inputCls} value={filters.to} onChange={set('to')} aria-label="To date" />
        </div>

        {customerId && (
          <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
            <span>Showing sales for one customer.</span>
            <button className="font-semibold text-slate-900 underline" onClick={() => { setCustomerId(''); window.history.replaceState(null, '', '/admin/offline-orders') }}>
              Show all
            </button>
          </div>
        )}

        {loading && !data ? (
          <Spinner />
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-500">
            No sales found. <Link href="/admin/offline-orders/new" className="font-semibold text-slate-900 underline">Create the first one</Link>.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Paid</th>
                    <th className="px-4 py-3 text-right">Balance</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="cursor-pointer hover:bg-slate-50" onClick={() => (window.location.href = `/admin/offline-orders/${o.id}`)}>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <Link href={`/admin/offline-orders/${o.id}`} onClick={(e) => e.stopPropagation()}>{o.invoice_no}</Link>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(o.invoice_date)}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{o.customer_name}</div>
                        <div className="text-xs text-slate-500">{o.customer_phone || '—'}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{inr(o.total_amount)}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{inr(o.amount_paid)}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${o.status === 'active' && Number(o.balance_due) > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {inr(o.balance_due)}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={o.payment_status} cancelled={o.status === 'cancelled'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 md:hidden">
              {orders.map((o) => (
                <Link key={o.id} href={`/admin/offline-orders/${o.id}`} className="block rounded-xl border border-slate-200 bg-white p-3.5 active:bg-slate-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{o.customer_name}</p>
                      <p className="text-xs text-slate-500">{o.invoice_no} · {fmtDate(o.invoice_date)}</p>
                    </div>
                    <StatusBadge status={o.payment_status} cancelled={o.status === 'cancelled'} />
                  </div>
                  <div className="mt-3 flex items-end justify-between text-xs">
                    <div>
                      <p className="text-slate-500">Total</p>
                      <p className="text-base font-bold text-slate-900">{inr(o.total_amount)}</p>
                    </div>
                    {o.status === 'active' && Number(o.balance_due) > 0 && (
                      <div className="text-right">
                        <p className="text-slate-500">Balance due</p>
                        <p className="text-base font-bold text-rose-600">{inr(o.balance_due)}</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
