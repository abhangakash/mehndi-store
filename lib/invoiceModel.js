import { num, fmtDate, PAYMENT_METHODS, PAYMENT_STATUS_LABEL } from './format'
import { BUSINESS } from './business'

// Both invoice types (offline sale / online order) are converted into ONE shape,
// so a single PDF layout (lib/InvoicePdf.js) prints them identically.

const joinAddress = (...parts) => parts.filter(Boolean).join(', ')

// ----- Offline sale (offline_orders + items + payments) -----
export function modelFromOffline(o) {
  const items = (o.offline_order_items || []).map((i) => ({
    description: i.product_name,
    qty: i.quantity,
    rate: num(i.unit_price),
    amount: num(i.line_total),
  }))
  const payments = [...(o.offline_payments || [])]
    .sort((a, b) => String(a.paid_on).localeCompare(String(b.paid_on)) || String(a.created_at).localeCompare(String(b.created_at)))
    .map((p) => ({
      date: fmtDate(p.paid_on),
      method: PAYMENT_METHODS[p.method] || p.method,
      reference: p.reference,
      amount: num(p.amount),
    }))

  const cancelled = o.status === 'cancelled'
  const total = num(o.total_amount)
  const paid = num(o.amount_paid)
  const balance = Math.max(0, total - paid)

  const addr1 = o.customer_address
  const addr2 = joinAddress(o.customer_city, o.customer_state) + (o.customer_pincode ? ` - ${o.customer_pincode}` : '')

  return {
    number: o.invoice_no,
    date: fmtDate(o.invoice_date),
    status: cancelled ? 'CANCELLED' : (PAYMENT_STATUS_LABEL[o.payment_status] || o.payment_status).toUpperCase(),
    cancelled,
    billTo: {
      name: o.customer_name,
      lines: [addr1, addr2.trim() === '-' ? '' : addr2].filter((l) => l && l.trim()),
      phone: o.customer_phone,
      email: null,
      gstin: o.customer_gstin,
    },
    infoRows: [
      ['Customer type', o.customer_type === 'retail' ? 'Retail' : 'Wholesale'],
      ['Sale type', 'Offline'],
    ],
    items,
    totals: {
      subtotal: num(o.subtotal),
      discount: num(o.discount),
      shippingLabel: null,
      total,
      paid,
      balance,
    },
    showBalance: !cancelled,
    showPayTo: !cancelled && balance > 0,
    payments,
    notes: o.notes,
  }
}

// ----- Online order (orders + order_items) -----
export function modelFromOnline(order) {
  const items = (order.order_items || []).map((i) => ({
    description: i.product_name,
    qty: i.quantity,
    rate: num(i.unit_price),
    amount: num(i.total_price),
  }))
  const shipping = num(order.shipping_amount)
  const total = num(order.total_amount)
  const isPaid = order.payment_status === 'paid'
  const methodLabel = order.payment_method === 'cod' ? 'Cash on delivery' : 'Online payment'

  return {
    number: String(order.id).slice(0, 8).toUpperCase(),
    date: fmtDate(order.created_at),
    status: (isPaid ? 'PAID' : (order.payment_status || 'pending')).toString().toUpperCase(),
    cancelled: false,
    billTo: {
      name: order.customer_name,
      lines: [
        order.address,
        joinAddress(order.city, order.state) + (order.pincode ? ` - ${order.pincode}` : ''),
      ].filter((l) => l && l.trim()),
      phone: order.phone,
      email: order.email,
      gstin: null,
    },
    infoRows: [
      ['Payment method', methodLabel],
      ['Order status', String(order.order_status || 'confirmed').replace(/_/g, ' ').toUpperCase()],
      ['Sale type', 'Online'],
    ],
    items,
    totals: {
      subtotal: num(order.subtotal),
      discount: 0,
      shippingLabel: shipping > 0 ? '₹ ' + shipping.toFixed(2) : 'Free',
      total,
      paid: isPaid ? total : 0,
      balance: isPaid ? 0 : total,
    },
    showBalance: true,
    showPayTo: false,
    payments: [],
    notes: order.notes,
    terms: BUSINESS.onlineTerms,
  }
}
