import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const BASE = 'https://crabveda.com'
const FROM = 'CrabVeda <orders@crabveda.com>'

function header(title, subtitle, bgColor = 'linear-gradient(135deg,#2c1a11,#42281b)', emoji = '') {
  return `<div style="background:${bgColor};padding:32px;text-align:center">
    ${emoji ? `<p style="font-size:40px;margin:0 0 8px">${emoji}</p>` : ''}
    <p style="margin:0 0 6px;font-size:10px;font-weight:800;letter-spacing:0.3em;color:#d4a373;text-transform:uppercase">✦ CrabVeda Ayurveda ✦</p>
    <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;text-transform:uppercase">${title}</h1>
    <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.5)">${subtitle}</p>
  </div>`
}

function footer() {
  return `<div style="background:#2c1a11;padding:20px 32px;text-align:center">
    <p style="margin:0;font-size:10px;font-weight:800;color:#d4a373;text-transform:uppercase;letter-spacing:0.3em">CrabVeda — Joint & Muscle Care</p>
    <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.35)">crabveda.com · crabveda@gmail.com · +91 99212 97518</p>
    <p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.2)">✦ Authentic Ayurvedic Wellness ✦</p>
  </div>`
}

function wrap(content) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#fbf9f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fbf9f4;padding:32px 16px">
  <tr><td align="center">
  <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  ${content}
  ${footer()}
  </table></td></tr></table></body></html>`
}

function itemRows(items) {
  return (items || []).map((item, i) => `
    <tr style="background:${i % 2 === 0 ? '#fff' : '#faf7f2'}">
      <td style="padding:12px 16px;font-size:13px;color:#2c1a11;font-weight:600">${item.product_name}</td>
      <td style="padding:12px 16px;font-size:12px;color:rgba(44,26,17,0.5);text-align:center">${item.quantity}</td>
      <td style="padding:12px 16px;font-size:14px;font-weight:800;color:#bc7d44;text-align:right">₹${Number(item.total_price).toFixed(0)}</td>
    </tr>`).join('')
}

function buildConfirmationEmail(order, items) {
  const ordNum = order.id.slice(0, 8).toUpperCase()
  const total = Number(order.total_amount || 0)
  const shipping = Number(order.shipping_amount || 0)
  const subtotal = Number(order.subtotal || 0)

  return wrap(`
    ${header('Order Confirmed!', `Thank you for shopping with us 🌿`)}
    <tr><td style="padding:20px 32px;background:#faf4ed;border-bottom:1px solid rgba(0,0,0,0.06)">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td><p style="margin:0;font-size:10px;font-weight:800;color:rgba(44,26,17,0.4);text-transform:uppercase;letter-spacing:0.15em">Order ID</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:900;color:#2c1a11">#${ordNum}</p></td>
        <td align="right"><p style="margin:0;font-size:10px;font-weight:800;color:rgba(44,26,17,0.4);text-transform:uppercase;letter-spacing:0.15em">Payment</p>
            <p style="margin:4px 0 0;font-size:13px;font-weight:700;color:#2c1a11">${order.payment_method === 'cod' ? '💵 Cash on Delivery' : '✅ Paid Online'}</p></td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:24px 32px 16px">
      <p style="margin:0;font-size:15px;font-weight:700;color:#2c1a11">Hi ${order.customer_name} 👋</p>
      <p style="margin:8px 0 0;font-size:14px;color:rgba(44,26,17,0.6);line-height:1.6">Your order is confirmed and being prepared for dispatch!</p>
    </td></tr>
    <tr><td style="padding:0 32px 20px">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid rgba(0,0,0,0.06)">
        <thead><tr style="background:#2c1a11"><th style="padding:10px 16px;font-size:10px;color:white;text-align:left;text-transform:uppercase">Product</th><th style="padding:10px 16px;font-size:10px;color:white;text-align:center">Qty</th><th style="padding:10px 16px;font-size:10px;color:white;text-align:right">Total</th></tr></thead>
        <tbody>${itemRows(items)}</tbody>
      </table>
    </td></tr>
    <tr><td style="padding:0 32px 20px">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;border-radius:12px;padding:16px;border:1px solid rgba(0,0,0,0.06)">
        <tr><td><p style="margin:0 0 6px;font-size:13px;color:rgba(44,26,17,0.5)">Subtotal</p></td><td align="right"><p style="margin:0 0 6px;font-size:13px;color:#2c1a11">₹${subtotal.toFixed(0)}</p></td></tr>
        <tr><td><p style="margin:0 0 10px;font-size:13px;color:rgba(44,26,17,0.5)">Shipping</p></td><td align="right"><p style="margin:0 0 10px;font-size:13px;color:#15803d;font-weight:700">FREE</p></td></tr>
        <tr style="border-top:1px solid rgba(0,0,0,0.08)"><td style="padding-top:10px"><p style="margin:0;font-size:15px;font-weight:900;color:#2c1a11">Total</p></td><td align="right" style="padding-top:10px"><p style="margin:0;font-size:18px;font-weight:900;color:#bc7d44">₹${total.toFixed(0)}</p></td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:0 32px 20px">
      <div style="background:#faf7f2;border-radius:12px;padding:16px;border:1px solid rgba(66,40,27,0.1)">
        <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:rgba(44,26,17,0.4);text-transform:uppercase">Delivery Address</p>
        <p style="margin:0;font-size:14px;font-weight:700;color:#2c1a11">${order.customer_name}</p>
        <p style="margin:4px 0 0;font-size:13px;color:rgba(44,26,17,0.6);line-height:1.5">${order.address}, ${order.city}, ${order.state} — ${order.pincode}<br>📞 ${order.phone}</p>
      </div>
    </td></tr>
    <tr><td style="padding:0 32px 32px;text-align:center">
      <a href="${BASE}/track-order" style="display:inline-block;background:#2c1a11;color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em">Track Your Order →</a>
      <p style="margin:12px 0 0;font-size:12px;color:rgba(44,26,17,0.4)">Need help? <a href="https://wa.me/919921297518" style="color:#bc7d44;font-weight:700">WhatsApp +91 99212 97518</a></p>
    </td></tr>
  `)
}

function buildShippedEmail(order) {
  const ordNum = order.id.slice(0, 8).toUpperCase()
  return wrap(`
    ${header('Your Order is Shipped!', `Order #${ordNum} is on the way`, 'linear-gradient(135deg,#bc7d44,#d4a373)', '🚚')}
    <tr><td style="padding:28px 32px">
      <p style="font-size:15px;font-weight:700;color:#2c1a11">Hi ${order.customer_name} 👋</p>
      <p style="color:rgba(44,26,17,0.6);line-height:1.6;font-size:14px">Great news! Your order is packed and on its way. Expected delivery in <strong>2–3 business days</strong>.</p>
      <div style="background:#faf4ed;border-radius:12px;padding:16px;margin:16px 0;border:1px solid rgba(188,125,68,0.2)">
        <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:rgba(44,26,17,0.6);text-transform:uppercase">Delivering To</p>
        <p style="margin:0;font-size:13px;color:#2c1a11;line-height:1.5">${order.address}, ${order.city}, ${order.state} — ${order.pincode}</p>
      </div>
      <div style="text-align:center;margin-top:20px">
        <a href="${BASE}/track-order" style="display:inline-block;background:#2c1a11;color:white;padding:14px 32px;border-radius:50px;font-size:11px;font-weight:900;text-transform:uppercase;text-decoration:none">Track My Order →</a>
      </div>
    </td></tr>
  `)
}

function buildDeliveredEmail(order) {
  const ordNum = order.id.slice(0, 8).toUpperCase()
  return wrap(`
    ${header('Order Delivered! 🎉', `Your order #${ordNum} has arrived`, 'linear-gradient(135deg,#15803d,#16a34a)', '🎁')}
    <tr><td style="padding:28px 32px">
      <p style="font-size:15px;font-weight:700;color:#2c1a11">Hi ${order.customer_name} 👋</p>
      <p style="color:rgba(44,26,17,0.6);line-height:1.6;font-size:14px">Your order has been safely delivered! We hope CrabVeda Ayurvedic Crab Oil brings wellness and relief to your joint & muscle care routing. 🌿</p>
      <div style="background:#faf7f2;border-radius:12px;padding:20px;margin:16px 0;border:1px solid rgba(66,40,27,0.1);text-align:center">
        <p style="margin:0 0 4px;font-size:28px">⭐⭐⭐⭐⭐</p>
        <p style="margin:0;font-size:14px;font-weight:700;color:#2c1a11">Enjoyed your experience?</p>
        <p style="margin:4px 0 12px;font-size:13px;color:rgba(44,26,17,0.5)">Leave a review to help other find relief</p>
        <a href="${BASE}/products" style="display:inline-block;background:#2c1a11;color:white;padding:12px 24px;border-radius:50px;font-size:11px;font-weight:900;text-transform:uppercase;text-decoration:none">Write a Review →</a>
      </div>
      <p style="color:rgba(44,26,17,0.6);line-height:1.6;font-size:13px;text-align:center">Want to order again? <a href="${BASE}/products" style="color:#bc7d44;font-weight:700">Shop more products</a></p>
      <p style="color:rgba(44,26,17,0.6);line-height:1.6;font-size:13px;text-align:center;margin-top:8px">Need help? <a href="https://wa.me/919921297518" style="color:#bc7d44;font-weight:700">WhatsApp +91 99212 97518</a></p>
    </td></tr>
  `)
}

function buildCancelledEmail(order) {
  const ordNum = order.id.slice(0, 8).toUpperCase()
  const total = Number(order.total_amount || 0)
  return wrap(`
    ${header('Order Cancelled', `Order #${ordNum}`, 'linear-gradient(135deg,#dc2626,#ef4444)', '❌')}
    <tr><td style="padding:28px 32px">
      <p style="font-size:15px;font-weight:700;color:#2c1a11">Hi ${order.customer_name},</p>
      <p style="color:rgba(44,26,17,0.6);line-height:1.6;font-size:14px">Your order #${ordNum} has been cancelled.</p>
      ${order.payment_method !== 'cod' ? `
      <div style="background:#fef3c7;border-radius:12px;padding:16px;margin:16px 0;border:1px solid rgba(217,119,6,0.2)">
        <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:#d97706;text-transform:uppercase">Refund Info</p>
        <p style="margin:0;font-size:14px;font-weight:700;color:#2c1a11">₹${total.toFixed(0)} will be refunded in 5–7 business days</p>
        <p style="margin:4px 0 0;font-size:12px;color:rgba(44,26,17,0.5)">Refund goes back to your original online payment channel</p>
      </div>` : ''}
      <p style="color:rgba(44,26,17,0.6);line-height:1.6;font-size:13px">If this was a mistake or you have questions, please contact us immediately:</p>
      <div style="text-align:center;margin-top:16px">
        <a href="https://wa.me/919921297518" style="display:inline-block;background:#25D366;color:white;padding:14px 32px;border-radius:50px;font-size:11px;font-weight:900;text-transform:uppercase;text-decoration:none">WhatsApp Us →</a>
      </div>
      <div style="text-align:center;margin-top:12px">
        <a href="${BASE}/products" style="display:inline-block;background:#2c1a11;color:white;padding:12px 24px;border-radius:50px;font-size:11px;font-weight:900;text-transform:uppercase;text-decoration:none">Shop Again →</a>
      </div>
    </td></tr>
  `)
}

export async function POST(req) {
  try {
    const { type, orderId } = await req.json()

    if (!type || !orderId) return NextResponse.json({ error: 'Missing type or orderId' }, { status: 400 })
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set')
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 })
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders').select('*, order_items(*)').eq('id', orderId).single()

    if (orderError || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (!order.email) {
      console.log(`No email on order ${orderId} — skipping`)
      return NextResponse.json({ success: true, skipped: true })
    }

    const items = order.order_items || []
    const ordNum = order.id.slice(0, 8).toUpperCase()

    const templates = {
      confirmation: { subject: `✅ Order Confirmed #${ordNum} — CrabVeda`, html: buildConfirmationEmail(order, items) },
      shipped:      { subject: `🚚 Order Shipped #${ordNum} — CrabVeda`,   html: buildShippedEmail(order) },
      delivered:    { subject: `🎉 Order Delivered #${ordNum} — CrabVeda`, html: buildDeliveredEmail(order) },
      cancelled:    { subject: `❌ Order Cancelled #${ordNum} — CrabVeda`, html: buildCancelledEmail(order) },
    }

    const template = templates[type]
    if (!template) return NextResponse.json({ error: 'Unknown email type' }, { status: 400 })

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [order.email],
      subject: template.subject,
      html: template.html,
    })

    if (error) { console.error('Resend error:', error); return NextResponse.json({ error: error.message }, { status: 500 }) }
    console.log(`Email sent [${type}] to ${order.email}, ID:`, data?.id)
    return NextResponse.json({ success: true, emailId: data?.id })
  } catch (err) {
    console.error('Email API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}