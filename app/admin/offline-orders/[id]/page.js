'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Download, ExternalLink, MessageCircle, Plus, Ban } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/clientApi'
import { inr, num, fmtDate, todayIST, PAYMENT_METHODS } from '@/lib/format'
import { Card, PageHeader, StatusBadge, Spinner, inputCls, labelCls, btnPrimary, btnGhost } from '@/components/admin/OfflineUI'

function whatsappNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '').replace(/^0+/, '')
  if (!digits) return ''
  return digits.length === 10 ? `91${digits}` : digits
}

export default function OfflineSaleDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [showPay, setShowPay] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [busy, setBusy] = useState(false)
  const [pay, setPay] = useState({ amount: '', method: 'cash', reference: '', note: '', paid_on: '' })
  const [reason, setReason] = useState('')

  const load = useCallback(async () => {
    try {
      const { order } = await api(`/api/offline/orders/${id}`)
      setOrder(order)
    } catch (e) {
      setError(e.message)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-600">{error}</p>
        <Link href="/admin/offline-orders" className="mt-3 inline-block text-sm font-semibold underline">Back to sales</Link>
      </div>
    )
  }
  if (!order) return <div className="min-h-screen bg-slate-50"><Spinner /></div>

  const cancelled = order.status === 'cancelled'
  const balance = num(order.balance_due)
  const pdfUrl = `/api/offline-invoice/${order.public_token}`

  function openPayForm() {
    setPay({ amount: String(balance), method: 'cash', reference: '', note: '', paid_on: todayIST() })
    setShowPay(true)
  }

  function shareWhatsApp() {
    const link = `${window.location.origin}${pdfUrl}`
    const text =
      `Hello ${order.customer_name},\n` +
      `Your invoice ${order.invoice_no} dated ${fmtDate(order.invoice_date)} from CrabVeda is ready.\n` +
      `Total: ${inr(order.total_amount)} | Paid: ${inr(order.amount_paid)}` +
      (balance > 0 ? ` | Balance due: ${inr(balance)}` : '') +
      `\nInvoice: ${link}\nThank you!`
    window.open(`https://wa.me/${whatsappNumber(order.customer_phone)}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  async function submitPayment(e) {
    e.preventDefault()
    if (busy) return
    if (!(num(pay.amount) > 0)) return toast.error('Enter a valid amount')
    if (num(pay.amount) > balance) return toast.error(`Amount is more than the balance due (${inr(balance)})`)
    setBusy(true)
    try {
      await api(`/api/offline/orders/${id}/payments`, { method: 'POST', body: JSON.stringify({ ...pay, amount: num(pay.amount) }) })
      toast.success('Payment recorded')
      setShowPay(false)
      await load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function submitCancel(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      await api(`/api/offline/orders/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) })
      toast.success('Sale cancelled and stock restored')
      setShowCancel(false)
      await load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  const address = [order.customer_address, [order.customer_city, order.customer_state].filter(Boolean).join(', ') + (order.customer_pincode ? ` - ${order.customer_pincode}` : '')]
    .filter((l) => l && l.trim() && l.trim() !== '-')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-6 lg:py-8">
        <Link href="/admin/offline-orders" className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft size={14} /> All offline sales
        </Link>

        <PageHeader title={order.invoice_no} subtitle={`${fmtDate(order.invoice_date)} · ${order.customer_type === 'retail' ? 'Retail' : 'Wholesale'}`}>
          <StatusBadge status={order.payment_status} cancelled={cancelled} />
        </PageHeader>

        {/* Invoice actions */}
        <div className="mb-4 flex flex-wrap gap-2">
          <a href={pdfUrl} target="_blank" rel="noreferrer" className={btnPrimary}><ExternalLink size={14} /> View / print</a>
          <a href={`${pdfUrl}?download=1`} className={btnGhost}><Download size={14} /> Download PDF</a>
          <button type="button" onClick={shareWhatsApp} className={btnGhost}><MessageCircle size={14} /> WhatsApp</button>
        </div>

        {cancelled && (
          <div className="mb-4 rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-600">
            <b>Cancelled</b>{order.cancelled_at ? ` on ${fmtDate(order.cancelled_at)}` : ''}. Stock was restored.
            {order.cancel_reason ? ` Reason: ${order.cancel_reason}.` : ''}
            {num(order.amount_paid) > 0 ? ` ${inr(order.amount_paid)} had been received — refund it manually.` : ''}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Card title="Items">
              <div className="-mx-4 overflow-x-auto px-4">
                <table className="w-full min-w-[420px] text-sm">
                  <thead className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <tr><th className="pb-2">Product</th><th className="pb-2 text-right">Qty</th><th className="pb-2 text-right">Rate</th><th className="pb-2 text-right">Amount</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.offline_order_items.map((i) => (
                      <tr key={i.id}>
                        <td className="py-2.5 pr-2 font-medium text-slate-900">{i.product_name}</td>
                        <td className="py-2.5 text-right">{i.quantity}</td>
                        <td className="py-2.5 text-right text-slate-600">{inr(i.unit_price)}</td>
                        <td className="py-2.5 text-right font-semibold">{inr(i.line_total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {order.notes ? <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"><b>Notes:</b> {order.notes}</p> : null}
            </Card>

            <Card
              title="Payments"
              right={!cancelled && balance > 0 && !showPay ? (
                <button type="button" onClick={openPayForm} className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 underline"><Plus size={13} /> Record payment</button>
              ) : null}
            >
              {showPay && (
                <form onSubmit={submitPayment} className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Amount (₹) — due {inr(balance)}</label>
                    <input className={inputCls} inputMode="decimal" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value.replace(/[^\d.]/g, '') })} autoFocus />
                  </div>
                  <div>
                    <label className={labelCls}>Date</label>
                    <input type="date" className={inputCls} value={pay.paid_on} onChange={(e) => setPay({ ...pay, paid_on: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Method</label>
                    <select className={inputCls} value={pay.method} onChange={(e) => setPay({ ...pay, method: e.target.value })}>
                      {Object.entries(PAYMENT_METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Reference</label>
                    <input className={inputCls} value={pay.reference} onChange={(e) => setPay({ ...pay, reference: e.target.value })} placeholder="UTR / cheque no." />
                  </div>
                  <div className="flex gap-2 sm:col-span-2">
                    <button type="submit" disabled={busy} className={btnPrimary}>{busy ? 'Saving…' : 'Save payment'}</button>
                    <button type="button" onClick={() => setShowPay(false)} className={btnGhost}>Cancel</button>
                  </div>
                </form>
              )}

              {order.offline_payments.length === 0 ? (
                <p className="text-sm text-slate-400">No payments received yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {order.offline_payments.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <div>
                        <p className="font-medium text-slate-900">{PAYMENT_METHODS[p.method] || p.method}{p.reference ? ` · ${p.reference}` : ''}</p>
                        <p className="text-xs text-slate-500">{fmtDate(p.paid_on)}{p.note ? ` · ${p.note}` : ''}</p>
                      </div>
                      <p className="font-semibold text-emerald-700">{inr(p.amount)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Amount">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600"><dt>Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>
                {num(order.discount) > 0 && <div className="flex justify-between text-slate-600"><dt>Discount</dt><dd>- {inr(order.discount)}</dd></div>}
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900"><dt>Total</dt><dd>{inr(order.total_amount)}</dd></div>
                <div className="flex justify-between text-slate-600"><dt>Paid</dt><dd>{inr(order.amount_paid)}</dd></div>
                <div className={`flex justify-between text-base font-bold ${!cancelled && balance > 0 ? 'text-rose-600' : 'text-slate-400'}`}><dt>Balance due</dt><dd>{inr(balance)}</dd></div>
              </dl>
            </Card>

            <Card title="Customer">
              <p className="text-sm font-semibold text-slate-900">{order.customer_name}</p>
              {address.map((l, i) => <p key={i} className="text-sm text-slate-600">{l}</p>)}
              {order.customer_phone && <p className="mt-1 text-sm text-slate-600">{order.customer_phone}</p>}
              {order.customer_gstin && <p className="text-xs text-slate-500">GSTIN: {order.customer_gstin}</p>}
              {order.customer_id && (
                <Link href={`/admin/offline-orders?customer_id=${order.customer_id}`} className="mt-2 inline-block text-xs font-semibold underline">All sales for this customer</Link>
              )}
            </Card>

            {!cancelled && (
              <Card title="Cancel sale">
                {!showCancel ? (
                  <button type="button" onClick={() => setShowCancel(true)} className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:underline">
                    <Ban size={14} /> Cancel this sale
                  </button>
                ) : (
                  <form onSubmit={submitCancel} className="space-y-3">
                    <p className="text-xs text-slate-500">The stock for all items will be added back. This cannot be undone.</p>
                    <input className={inputCls} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional)" />
                    <div className="flex gap-2">
                      <button type="submit" disabled={busy} className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 disabled:opacity-50">
                        {busy ? 'Cancelling…' : 'Confirm cancel'}
                      </button>
                      <button type="button" onClick={() => setShowCancel(false)} className={btnGhost}>Keep</button>
                    </div>
                  </form>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
