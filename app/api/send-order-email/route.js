import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

function buildOrderConfirmationHTML(order, items) {
  const subtotal = Number(order.subtotal || 0)
  const shipping = Number(order.shipping_amount || 0)
  const total = Number(order.total_amount || 0)
  const ordNum = order.id.slice(0, 8).toUpperCase()
  const date = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const itemRows = (items || []).map((item, i) => `
    <tr style="background:${i % 2 === 0 ? '#ffffff' : '#fafaf7'}">
      <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#0f1a0e">${item.product_name}</td>
      <td style="padding:12px 16px;font-size:12px;color:rgba(15,26,14,0.5);text-align:center">${item.quantity}</td>
      <td style="padding:12px 16px;font-size:14px;font-weight:800;color:#c9a84c;text-align:right">₹${Number(item.total_price).toFixed(0)}</td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Order Confirmed</title></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px">
<tr><td align="center">
<table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#0f1a0e,#1a3020);padding:32px;text-align:center">
    <p style="margin:0 0 8px;font-size:10px;font-weight:800;letter-spacing:0.3em;color:#c9a84c;text-transform:uppercase">✦ Shrilekha Mehndi Art & Glowup ✦</p>
    <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:-0.02em">Order Confirmed!</h1>
    <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.5)">Thank you for shopping with us 🌿</p>
  </td></tr>

  <!-- Order meta -->
  <tr><td style="padding:20px 32px;background:#fef9ee;border-bottom:1px solid rgba(0,0,0,0.06)">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td><p style="margin:0;font-size:10px;font-weight:800;color:rgba(15,26,14,0.4);text-transform:uppercase;letter-spacing:0.15em">Order ID</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:900;color:#0f1a0e">#${ordNum}</p></td>
        <td align="right"><p style="margin:0;font-size:10px;font-weight:800;color:rgba(15,26,14,0.4);text-transform:uppercase;letter-spacing:0.15em">Date</p>
            <p style="margin:4px 0 0;font-size:13px;font-weight:600;color:#0f1a0e">${date}</p></td>
      </tr>
    </table>
  </td></tr>

  <!-- Greeting -->
  <tr><td style="padding:24px 32px 16px">
    <p style="margin:0;font-size:16px;font-weight:700;color:#0f1a0e">Hi ${order.customer_name} 👋</p>
    <p style="margin:8px 0 0;font-size:14px;color:rgba(15,26,14,0.6);line-height:1.6">
      Your order has been confirmed and is being prepared. We'll update you when it's shipped!
    </p>
  </td></tr>

  <!-- Items table -->
  <tr><td style="padding:0 32px 24px">
    <p style="margin:0 0 12px;font-size:10px;font-weight:800;color:rgba(15,26,14,0.4);text-transform:uppercase;letter-spacing:0.15em">Items Ordered</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid rgba(0,0,0,0.06)">
      <thead><tr style="background:#0f1a0e">
        <th style="padding:10px 16px;font-size:10px;color:white;text-align:left;text-transform:uppercase;letter-spacing:0.1em">Product</th>
        <th style="padding:10px 16px;font-size:10px;color:white;text-align:center">Qty</th>
        <th style="padding:10px 16px;font-size:10px;color:white;text-align:right">Total</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
  </td></tr>

  <!-- Price summary -->
  <tr><td style="padding:0 32px 24px">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf7;border-radius:12px;padding:16px;border:1px solid rgba(0,0,0,0.06)">
      <tr><td><p style="margin:0 0 6px;font-size:13px;color:rgba(15,26,14,0.5)">Subtotal</p></td>
          <td align="right"><p style="margin:0 0 6px;font-size:13px;color:#0f1a0e">₹${subtotal.toFixed(0)}</p></td></tr>
      <tr><td><p style="margin:0 0 10px;font-size:13px;color:rgba(15,26,14,0.5)">Shipping</p></td>
          <td align="right"><p style="margin:0 0 10px;font-size:13px;color:${shipping === 0 ? '#15803d' : '#0f1a0e'};font-weight:${shipping === 0 ? 700 : 400}">${shipping === 0 ? 'FREE' : '₹' + shipping.toFixed(0)}</p></td></tr>
      <tr style="border-top:1px solid rgba(0,0,0,0.08)">
        <td style="padding-top:10px"><p style="margin:0;font-size:15px;font-weight:900;color:#0f1a0e">Total</p></td>
        <td align="right" style="padding-top:10px"><p style="margin:0;font-size:18px;font-weight:900;color:#c9a84c">₹${total.toFixed(0)}</p></td>
      </tr>
    </table>
  </td></tr>

  <!-- Address -->
  <tr><td style="padding:0 32px 24px">
    <p style="margin:0 0 10px;font-size:10px;font-weight:800;color:rgba(15,26,14,0.4);text-transform:uppercase;letter-spacing:0.15em">Delivery Address</p>
    <div style="background:#f0fdf4;border-radius:12px;padding:16px;border:1px solid rgba(21,128,61,0.15)">
      <p style="margin:0;font-size:14px;font-weight:700;color:#0f1a0e">${order.customer_name}</p>
      <p style="margin:4px 0 0;font-size:13px;color:rgba(15,26,14,0.6);line-height:1.5">
        ${order.address}<br>${order.city}, ${order.state} — ${order.pincode}<br>📞 ${order.phone}
      </p>
    </div>
  </td></tr>

  <!-- Payment + delivery pills -->
  <tr><td style="padding:0 32px 24px">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="width:48%;background:#fef9ee;border-radius:12px;padding:14px;border:1px solid rgba(201,168,76,0.2)">
          <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:rgba(15,26,14,0.4);text-transform:uppercase">Payment</p>
          <p style="margin:0;font-size:13px;font-weight:700;color:#0f1a0e">${order.payment_method === 'cod' ? '💵 Cash on Delivery' : '✅ Paid Online'}</p>
        </td>
        <td style="width:4%"></td>
        <td style="width:48%;background:#e0f2fe;border-radius:12px;padding:14px;border:1px solid rgba(3,105,161,0.15)">
          <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:rgba(15,26,14,0.4);text-transform:uppercase">Est. Delivery</p>
          <p style="margin:0;font-size:13px;font-weight:700;color:#0f1a0e">🚚 3–7 Business Days</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding:0 32px 32px;text-align:center">
    <a href="https://mehndi.zevette.com/track-order" style="display:inline-block;background:#0f1a0e;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em">
      Track Your Order →
    </a>
    <p style="margin:12px 0 0;font-size:12px;color:rgba(15,26,14,0.4)">
      Need help? <a href="https://wa.me/919623740541" style="color:#c9a84c;font-weight:700">WhatsApp +91 96237 40541</a>
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#0f1a0e;padding:20px 32px;text-align:center">
    <p style="margin:0;font-size:10px;font-weight:800;color:#c9a84c;text-transform:uppercase;letter-spacing:0.3em">Shrilekha Mehndi Art & Glowup Studio</p>
    <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.35)">Pune, Maharashtra · info@shrilekha.com</p>
    <p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.2)">✦ Where Every Design Tells A Story ✦</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

export async function POST(req) {
  try {
    const { type, orderId, trackingNumber } = await req.json()

    if (!type || !orderId) {
      return NextResponse.json({ error: 'Missing type or orderId' }, { status: 400 })
    }

    // Check Resend key
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set!')
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 })
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // If no email on order — skip silently
    const recipientEmail = order.email
    if (!recipientEmail) {
      console.log(`Order ${orderId} has no email — skipping email send`)
      return NextResponse.json({ success: true, skipped: true })
    }

    const items = order.order_items || []

    if (type === 'confirmation') {
      const html = buildOrderConfirmationHTML(order, items)
      const subject = `✅ Order Confirmed #${order.id.slice(0, 8).toUpperCase()} — Shrilekha Mehndi Art`

      const { data, error } = await resend.emails.send({
        from: 'Shrilekha Mehndi Art <orders@resend.dev>', // use resend.dev until domain is verified
        to: [recipientEmail],
        subject,
        html,
      })

      if (error) {
        console.error('Resend error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log('Email sent! ID:', data?.id)
      return NextResponse.json({ success: true, emailId: data?.id })
    }

    if (type === 'shipped') {
      const ordNum = order.id.slice(0, 8).toUpperCase()
      const html = `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;background:#f5f0e8;padding:32px 16px">
<div style="max-width:560px;margin:0 auto;background:white;border-radius:16px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:32px;text-align:center">
    <p style="font-size:40px;margin:0">🚚</p>
    <h1 style="color:white;font-size:24px;margin:12px 0 0;text-transform:uppercase">Your Order is Shipped!</h1>
    <p style="color:rgba(255,255,255,0.7);margin:8px 0 0">Order #${ordNum}</p>
  </div>
  <div style="padding:28px 32px">
    <p style="font-size:15px;font-weight:700;color:#0f1a0e">Hi ${order.customer_name} 👋</p>
    <p style="color:rgba(15,26,14,0.6);line-height:1.6">Your order is on the way! Expected in 2–3 business days.</p>
    ${trackingNumber ? `<div style="background:#eff6ff;border-radius:12px;padding:16px;margin:16px 0;border:1px solid rgba(59,130,246,0.2)">
      <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:rgba(29,78,216,0.6);text-transform:uppercase">Tracking Number</p>
      <p style="margin:0;font-size:16px;font-weight:900;color:#1d4ed8">${trackingNumber}</p>
    </div>` : ''}
    <div style="background:#fafaf7;border-radius:12px;padding:16px;border:1px solid rgba(0,0,0,0.06)">
      <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:rgba(15,26,14,0.4);text-transform:uppercase">Delivering To</p>
      <p style="margin:0;color:#0f1a0e;line-height:1.5">${order.address}, ${order.city}, ${order.state} — ${order.pincode}</p>
    </div>
    <div style="text-align:center;margin-top:24px">
      <a href="https://mehndi.zevette.com/track-order" style="display:inline-block;background:#1d4ed8;color:white;padding:14px 32px;border-radius:50px;font-size:11px;font-weight:900;text-transform:uppercase;text-decoration:none">Track Order →</a>
    </div>
  </div>
  <div style="background:#0f1a0e;padding:16px 32px;text-align:center">
    <p style="margin:0;font-size:10px;color:#c9a84c;text-transform:uppercase;letter-spacing:0.3em">Shrilekha Mehndi Art</p>
    <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.3)">+91 96237 40541</p>
  </div>
</div>
</body></html>`

      const { data, error } = await resend.emails.send({
        from: 'Shrilekha Mehndi Art <orders@resend.dev>',
        to: [recipientEmail],
        subject: `🚚 Shipped! Order #${ordNum} — Shrilekha Mehndi Art`,
        html,
      })

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, emailId: data?.id })
    }

    return NextResponse.json({ error: 'Unknown email type' }, { status: 400 })
  } catch (err) {
    console.error('Email API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
