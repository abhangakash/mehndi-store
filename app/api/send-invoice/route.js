import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET /api/send-invoice?orderId=xxx
// Returns HTML invoice — browser can print/save as PDF
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()

    if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const items = order.order_items || []
    const subtotal = Number(order.subtotal || 0)
    const shipping = Number(order.shipping_amount || 0)
    const total = Number(order.total_amount || 0)
    const date = new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    const ordNum = order.id.slice(0, 8).toUpperCase()

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${ordNum} — Shrilekha Mehndi Art</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f0e8; padding: 40px 20px; color: #0f1a0e; }
    .page { max-width: 680px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 32px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0f1a0e, #1a3020); padding: 32px; color: white; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { }
    .brand-name { font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; }
    .brand-sub { font-size: 9px; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; color: #c9a84c; margin-top: 4px; }
    .invoice-label { text-align: right; }
    .invoice-label h2 { font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; }
    .invoice-label p { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px; }
    .meta { padding: 24px 32px; background: #fef9ee; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.06); }
    .meta-box label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(15,26,14,0.4); }
    .meta-box p { font-size: 14px; font-weight: 700; color: #0f1a0e; margin-top: 4px; }
    .body { padding: 28px 32px; }
    .section-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(15,26,14,0.4); margin-bottom: 12px; }
    .address-box { background: #f0fdf4; border: 1px solid rgba(21,128,61,0.15); border-radius: 12px; padding: 16px; margin-bottom: 24px; }
    .address-box .name { font-size: 15px; font-weight: 700; }
    .address-box .details { font-size: 13px; color: rgba(15,26,14,0.6); margin-top: 4px; line-height: 1.6; }
    table.items { width: 100%; border-collapse: collapse; margin-bottom: 24px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0,0,0,0.06); }
    table.items th { background: #0f1a0e; color: white; padding: 12px 16px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; text-align: left; }
    table.items th:last-child { text-align: right; }
    table.items td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid rgba(0,0,0,0.04); }
    table.items td:last-child { text-align: right; font-weight: 700; color: #c9a84c; }
    table.items tr:last-child td { border-bottom: none; }
    table.items tr:nth-child(even) td { background: #fafaf7; }
    .totals { background: #fafaf7; border-radius: 12px; padding: 16px; border: 1px solid rgba(0,0,0,0.06); margin-bottom: 24px; }
    .total-row { display: flex; justify-content: space-between; font-size: 13px; color: rgba(15,26,14,0.5); margin-bottom: 8px; }
    .total-row.grand { font-size: 16px; font-weight: 900; color: #0f1a0e; border-top: 1px solid rgba(0,0,0,0.08); margin-top: 8px; padding-top: 12px; }
    .total-row.grand span:last-child { color: #c9a84c; }
    .payment-row { display: flex; gap: 12px; margin-bottom: 24px; }
    .pill { flex: 1; background: #fef9ee; border: 1px solid rgba(201,168,76,0.2); border-radius: 12px; padding: 12px 14px; }
    .pill label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(15,26,14,0.4); }
    .pill p { font-size: 13px; font-weight: 700; color: #0f1a0e; margin-top: 4px; }
    .note { background: #f0fdf4; border: 1px solid rgba(21,128,61,0.15); border-radius: 12px; padding: 14px 16px; font-size: 12px; color: rgba(15,26,14,0.6); line-height: 1.6; margin-bottom: 24px; }
    .footer { background: #0f1a0e; padding: 20px 32px; display: flex; justify-content: space-between; align-items: center; }
    .footer-brand { font-size: 10px; font-weight: 800; color: #c9a84c; text-transform: uppercase; letter-spacing: 0.3em; }
    .footer-info { font-size: 11px; color: rgba(255,255,255,0.3); text-align: right; }
    @media print {
      body { background: white; padding: 0; }
      .page { box-shadow: none; border-radius: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align:center;margin-bottom:20px;">
    <button onclick="window.print()" style="background:#0f1a0e;color:white;border:none;padding:12px 32px;border-radius:50px;font-size:13px;font-weight:800;cursor:pointer;letter-spacing:0.1em;text-transform:uppercase;">
      🖨️ Print / Save as PDF
    </button>
  </div>
  <div class="page">
    <div class="header">
      <div class="header-top">
        <div class="brand">
          <div class="brand-name">Shrilekha</div>
          <div class="brand-sub">Mehndi Art & Glowup Studio</div>
        </div>
        <div class="invoice-label">
          <h2>Invoice</h2>
          <p>#${ordNum}</p>
        </div>
      </div>
    </div>
    <div class="meta">
      <div class="meta-box"><label>Invoice Date</label><p>${date}</p></div>
      <div class="meta-box"><label>Order ID</label><p>#${ordNum}</p></div>
      <div class="meta-box" style="text-align:right"><label>Status</label><p style="color:#15803d">${order.order_status?.toUpperCase() || 'CONFIRMED'}</p></div>
    </div>
    <div class="body">
      <p class="section-label">Billed To</p>
      <div class="address-box">
        <div class="name">${order.customer_name}</div>
        <div class="details">
          ${order.address}, ${order.city}, ${order.state} — ${order.pincode}<br>
          📞 ${order.phone}
          ${order.email ? `<br>✉️ ${order.email}` : ''}
        </div>
      </div>
      <p class="section-label">Items</p>
      <table class="items">
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Unit Price</th>
            <th style="text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.product_name}</td>
              <td style="text-align:center">${item.quantity}</td>
              <td style="text-align:right;color:rgba(15,26,14,0.6)">₹${Number(item.unit_price).toFixed(0)}</td>
              <td>₹${Number(item.total_price).toFixed(0)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="totals">
        <div class="total-row"><span>Subtotal</span><span>₹${subtotal.toFixed(0)}</span></div>
        <div class="total-row"><span>Shipping</span><span style="color:${shipping === 0 ? '#15803d' : 'inherit'}">${shipping === 0 ? 'FREE' : '₹' + shipping.toFixed(0)}</span></div>
        <div class="total-row grand"><span>Total</span><span>₹${total.toFixed(0)}</span></div>
      </div>
      <div class="payment-row">
        <div class="pill"><label>Payment Method</label><p>${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online (Razorpay)'}</p></div>
        <div class="pill"><label>Payment Status</label><p style="color:${order.payment_status === 'paid' ? '#15803d' : '#d97706'}">${(order.payment_status || 'pending').toUpperCase()}</p></div>
      </div>
      <div class="note">
        🌿 Thank you for shopping with Shrilekha Mehndi Art! For any queries, WhatsApp us at +91 96237 40541 or email info@shrilekha.com. Returns accepted within 7 days for unused sealed products.
      </div>
    </div>
    <div class="footer">
      <div class="footer-brand">✦ Shrilekha Mehndi Art</div>
      <div class="footer-info">info@shrilekha.com<br>+91 96237 40541 · Pune, Maharashtra</div>
    </div>
  </div>
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('Invoice error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}