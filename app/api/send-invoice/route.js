import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET /api/send-invoice?orderId=xxx
// Returns a premium, print-ready HTML invoice matching the brand aesthetic
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
  <title>Invoice #${ordNum} — CrabVeda</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #fafafa; padding: 40px 20px; color: #0a0f0d; -webkit-font-smoothing: antialiased; }
    .page { max-width: 720px; margin: 0 auto; background: white; border: 1px solid #f0f0f0; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.02); }
    
    /* Luxury Header Layout */
    .header { padding: 40px 40px 32px 40px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; background: white; }
    .brand-identity { display: flex; align-items: center; gap: 16px; }
    .brand-logo { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 1px solid #f0f0f0; }
    .brand-name { font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #0a0f0d; }
    .brand-sub { font-size: 10px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #93731e; margin-top: 3px; }
    
    .invoice-title-box { text-align: right; }
    .invoice-title-box h2 { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #0a0f0d; }
    .invoice-title-box p { font-size: 12px; font-weight: 700; color: #93731e; margin-top: 4px; letter-spacing: 0.05em; }
    
    /* Meta Information Bar */
    .meta-bar { padding: 20px 40px; background: #fafafa; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; }
    .meta-box label { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #9ca3af; }
    .meta-box p { font-size: 13px; font-weight: 800; color: #0a0f0d; margin-top: 5px; }
    
    /* Main Layout Details */
    .body-content { padding: 32px 40px; }
    .section-heading { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #9ca3af; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .section-heading::after { content: ''; flex: 1; height: 1px; background: #f3f4f6; }
    
    .address-details-card { border: 1px solid #f0f0f0; border-radius: 16px; padding: 20px; margin-bottom: 32px; background: white; }
    .address-details-card .customer-name { font-size: 15px; font-weight: 800; color: #0a0f0d; text-transform: uppercase; letter-spacing: 0.02em; }
    .address-details-card .address-text { font-size: 13px; color: #4b5563; margin-top: 6px; line-height: 1.6; font-weight: 500; }
    
    /* Modern Clean Invoice Table */
    table.items-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    table.items-table th { padding: 12px 16px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: #9ca3af; text-align: left; border-bottom: 2px solid #0a0f0d; }
    table.items-table th:last-child { text-align: right; }
    table.items-table td { padding: 18px 16px; font-size: 13px; font-weight: 600; color: #0a0f0d; border-bottom: 1px solid #f3f4f6; }
    table.items-table td.qty-col { text-align: center; color: #4b5563; }
    table.items-table td.price-col { text-align: right; color: #4b5563; }
    table.items-table td.total-col { text-align: right; font-weight: 800; color: #0a0f0d; }
    
    /* Summary Deck */
    .invoice-breakdown { display: flex; justify-content: flex-end; margin-bottom: 32px; }
    .totals-wrapper { width: 100%; max-width: 320px; border: 1px solid #f0f0f0; border-radius: 16px; padding: 20px; background: #fafafa; }
    .breakdown-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 10px; }
    .breakdown-row.grand-total { font-size: 16px; font-weight: 900; color: #0a0f0d; border-top: 1px solid #e5e7eb; margin-top: 12px; padding-top: 14px; text-transform: uppercase; letter-spacing: 0.02em; }
    .breakdown-row.grand-total span:last-child { color: #93731e; font-size: 18px; }
    
    /* Info Badges */
    .status-container { display: flex; gap: 12px; margin-bottom: 32px; }
    .info-badge { flex: 1; border: 1px solid #f0f0f0; border-radius: 16px; padding: 14px 18px; background: white; }
    .info-badge label { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: #9ca3af; }
    .info-badge p { font-size: 13px; font-weight: 800; color: #0a0f0d; margin-top: 4px; }
    
    /* Brand Message Box */
    .brand-notice-box { border-left: 3px solid #93731e; background: #fafafa; border-radius: 0 16px 16px 0; padding: 18px 20px; font-size: 12px; font-weight: 500; color: #4b5563; line-height: 1.65; margin-bottom: 8px; }
    
    /* Premium Minimalist Footer */
    .footer-section { background: #0a0f0d; padding: 28px 40px; display: flex; justify-content: space-between; align-items: center; }
    .footer-logo-text { font-size: 11px; font-weight: 900; color: white; text-transform: uppercase; letter-spacing: 0.2em; }
    .footer-logo-text span { color: #93731e; }
    .footer-contact-data { font-size: 11px; font-weight: 600; color: #9ca3af; text-align: right; line-height: 1.6; }
    
    /* Top Menu Bar Styles */
    .action-bar { text-align: center; margin-bottom: 24px; }
    .print-trigger-btn { background: #0a0f0d; color: white; border: none; padding: 14px 36px; border-radius: 12px; font-size: 12px; font-weight: 900; cursor: pointer; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.2s; box-shadow: 0 4px 12px rgba(10,15,13,0.15); }
    .print-trigger-btn:hover { background: #1a2320; transform: translateY(-1px); }
    
    @media print {
      body { background: white; padding: 0; }
      .page { box-shadow: none; border: none; border-radius: 0; }
      .action-bar { display: none; }
    }
  </style>
</head>
<body>

  <div class="action-bar">
    <button onclick="window.print()" class="print-trigger-btn">
      Print / Save as PDF
    </button>
  </div>

  <div class="page">
    <div class="header">
      <div class="brand-identity">
        <!-- Rendered with circular logo profile image fallback asset -->
        <img src="/logo.jpeg" alt="CrabVeda Logo" class="brand-logo" onerror="this.style.display='none'" />
        <div>
          <div class="brand-name">CrabVeda</div>
          <div class="brand-sub">Ayurvedic Care & Vitality</div>
        </div>
      </div>
      <div class="invoice-title-box">
        <h2>Invoice</h2>
        <p>#${ordNum}</p>
      </div>
    </div>
    
    <div class="meta-bar">
      <div class="meta-box"><label>Date Issued</label><p>${date}</p></div>
      <div class="meta-box"><label>Reference ID</label><p>#${ordNum}</p></div>
      <div class="meta-box" style="text-align:right">
        <label>Order Status</label>
        <p style="color:#16a34a">${order.order_status?.toUpperCase() || 'CONFIRMED'}</p>
      </div>
    </div>
    
    <div class="body-content">
      <p class="section-heading">Billed To</p>
      <div class="address-details-card">
        <div class="customer-name">${order.customer_name}</div>
        <div class="address-text">
          ${order.address}, ${order.city}, ${order.state} — ${order.pincode}<br>
          <strong>Phone:</strong> ${order.phone}
          ${order.email ? `<br><strong>Email:</strong> ${order.email}` : ''}
        </div>
      </div>
      
      <p class="section-heading">Order Contents</p>
      <table class="items-table">
        <thead>
          <tr>
            <th>Product Description</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Unit Rate</th>
            <th style="text-align:right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.product_name}</td>
              <td class="qty-col">${item.quantity}</td>
              <td class="price-col">₹${Number(item.unit_price).toFixed(0)}</td>
              <td class="total-col">₹${Number(item.total_price).toFixed(0)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="invoice-breakdown">
        <div class="totals-wrapper">
          <div class="breakdown-row">
            <span>Subtotal</span>
            <span>₹${subtotal.toFixed(0)}</span>
          </div>
          <div class="breakdown-row">
            <span>Shipping & Handling</span>
            <span style="color:#16a34a; font-weight:800;">FREE</span>
          </div>
          <div class="breakdown-row grand-total">
            <span>Total Amount</span>
            <span>₹${total.toFixed(0)}</span>
          </div>
        </div>
      </div>
      
      <div class="status-container">
        <div class="info-badge">
          <label>Payment Method</label>
          <p>${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
        </div>
        <div class="info-badge">
          <label>Payment Status</label>
          <p style="color:${order.payment_status === 'paid' ? '#16a34a' : '#d97706'}">
            ${(order.payment_status || 'pending').toUpperCase()}
          </p>
        </div>
      </div>
      
      <div class="brand-notice-box">
        <strong>Thank you for choosing CrabVeda.</strong> Our authentic Ayurvedic formulations are crafted using premium natural herbs to optimize body health. For targeted joint relief, massage softly over the affected region twice daily. For priority support, reach out directly on WhatsApp at <strong>+91 99212 97518</strong> or email us at <strong>crabveda@gmail.com</strong>.
      </div>
    </div>
    
    <div class="footer-section">
      <div class="footer-logo-text">✦ CrabVeda <span>Ayurveda</span></div>
      <div class="footer-contact-data">
        crabveda.com<br>
        +91 99212 97518 · crabveda@gmail.com
      </div>
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