import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const BASE = 'https://crabveda.com'
const FROM = 'CrabVeda <orders@crabveda.com>'

function header(title, subtitle) {
  return `<tr>
    <td style="background-color: #0f1a0e; padding: 40px 40px 36px; text-align: center;">
      <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto 16px auto;">
        <tr>
          <td style="text-align: center;">
            <img 
              src="https://crabveda.com/logo.jpeg" 
              width="72" 
              height="72" 
              alt="CrabVeda Logo" 
              style="display: block; border-radius: 50%; border: 2px solid #93731e; background-color: #ffffff; object-fit: cover;" 
            />
          </td>
        </tr>
      </table>
      <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 0.25em; color: #93731e; text-transform: uppercase; margin-bottom: 10px;">
        ✦ CRABVEDA AYURVEDA ✦
      </p>
      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.02em;">
        ${title}
      </h1>
      <p style="margin: 8px 0 0; font-size: 14px; color: #a3b899;">
        ${subtitle}
      </p>
    </td>
  </tr>`
}

function footer() {
  return `<tr>
    <td style="padding: 32px 40px; text-align: center; background-color: #faf8f5;">
      <p style="margin: 0 0 16px; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.05em;">
        Follow Our Channels
      </p>
      <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto;">
        <tr>
          <td style="padding: 0 10px;">
            <a href="https://www.instagram.com/crabveda" target="_blank" rel="noreferrer" style="text-decoration: none; display: inline-block;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="vertical-align: middle; padding-right: 6px;">
                    <img src="https://cdn-icons-png.flaticon.com/32/174/174855.png" width="16" height="16" alt="Instagram" style="display: block; border: 0;" />
                  </td>
                  <td style="vertical-align: middle; font-size: 13px; color: #525252; font-weight: 500;">Instagram</td>
                </tr>
              </table>
            </a>
          </td>
          <td style="padding: 0 10px;">
            <a href="https://www.facebook.com/share/1BE5Lhjuqk/" target="_blank" rel="noreferrer" style="text-decoration: none; display: inline-block;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="vertical-align: middle; padding-right: 6px;">
                    <img src="https://cdn-icons-png.flaticon.com/32/733/733547.png" width="16" height="16" alt="Facebook" style="display: block; border: 0;" />
                  </td>
                  <td style="vertical-align: middle; font-size: 13px; color: #525252; font-weight: 500;">Facebook</td>
                </tr>
              </table>
            </a>
          </td>
          <td style="padding: 0 10px;">
            <a href="https://wa.me/919921297518" target="_blank" rel="noreferrer" style="text-decoration: none; display: inline-block;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="vertical-align: middle; padding-right: 6px;">
                    <img src="https://cdn-icons-png.flaticon.com/32/733/733585.png" width="16" height="16" alt="WhatsApp" style="display: block; border: 0;" />
                  </td>
                  <td style="vertical-align: middle; font-size: 13px; color: #525252; font-weight: 500;">WhatsApp</td>
                </tr>
              </table>
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="background-color: #0f1a0e; padding: 24px 40px; text-align: center;">
      <p style="margin: 0; font-size: 11px; font-weight: 600; color: #93731e; text-transform: uppercase; letter-spacing: 0.15em;">
        CrabVeda Joint & Muscle Care
      </p>
      <p style="margin: 6px 0 0; font-size: 12px; color: #8a9e85;">
        crabveda.com · +91 99212 97518
      </p>
      <p style="margin: 14px 0 0; font-size: 11px; color: #52634d; line-height: 1.4;">
        This automated notification layout was dispatched safely to your profile context.<br />
        © ${new Date().getFullYear()} CrabVeda. All rights reserved.
      </p>
    </td>
  </tr>`
}

function wrap(content) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
  <body style="margin:0;padding:0;background-color:#fdfbf7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fdfbf7;padding:40px 16px">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e4dc;box-shadow:0 1px 3px rgba(15,26,14,0.05)">
  ${content}
  ${footer()}
  </table></td></tr></table></body></html>`
}

function itemRows(items) {
  return (items || []).map((item) => `
    <tr style="border-bottom: 1px solid #f5f2eb;">
      <td style="padding: 14px 0;">
        <p style="margin: 0; font-size: 13px; font-weight: 600; color: #0f1a0e;">${item.product_name || 'Ayurvedic Treatment Item'}</p>
        <p style="margin: 4px 0 0; font-size: 12px; color: #737373;">Qty: ${item.quantity || 1}</p>
      </td>
      <td align="right" style="padding: 14px 0; vertical-align: middle;">
        <p style="margin: 0; font-size: 13px; font-weight: 700; color: #0f1a0e;">₹${Number(item.total_price || 0).toFixed(0)}</p>
      </td>
    </tr>`).join('')
}

function buildConfirmationEmail(order, items) {
  const ordNum = order.id.slice(0, 8).toUpperCase()
  const total = Number(order.total_amount || 0)
  const shipping = Number(order.shipping_amount || 0)
  const subtotal = Number(order.subtotal || 0)

  return wrap(`
    ${header('Order Confirmed', 'Your order is logged and in preparation for dispatch 🌿')}
    
    <tr>
      <td style="padding: 20px 40px; background-color: #faf8f5; border-bottom: 1px solid #e8e4dc;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td>
              <p style="margin: 0; font-size: 10px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.08em;">Order ID</p>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 700; color: #0f1a0e;">#${ordNum}</p>
            </td>
            <td align="right">
              <p style="margin: 0; font-size: 10px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.08em;">Order Date</p>
              <p style="margin: 4px 0 0; font-size: 13px; font-weight: 600; color: #0f1a0e;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 36px 40px 24px;">
        <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f1a0e;">Hello ${order.customer_name || 'Customer'},</p>
        <p style="margin: 10px 0 0; font-size: 14px; color: #404040; line-height: 1.6;">Thank you for choosing CrabVeda. We have securely received your package details and our fulfillment group is prioritizing packing operations.</p>
      </td>
    </tr>

    <tr>
      <td style="padding: 0 40px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid #e8e4dc;">
              <th align="left" style="padding-bottom: 10px; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase;">Items Ordered</th>
              <th align="right" style="padding-bottom: 10px; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase;">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows(items)}</tbody>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 0 40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-top: 2px solid #0f1a0e; padding-top: 16px;">
          <tr>
            <td style="padding-bottom: 8px;"><p style="margin: 0; font-size: 13px; color: #525252;">Subtotal</p></td>
            <td align="right" style="padding-bottom: 8px;"><p style="margin: 0; font-size: 13px; font-weight: 600; color: #0f1a0e;">₹${subtotal.toFixed(0)}</p></td>
          </tr>
          <tr>
            <td style="padding-bottom: 12px; border-bottom: 1px solid #e8e4dc;"><p style="margin: 0; font-size: 13px; color: #525252;">Shipping & Handling</p></td>
            <td align="right" style="padding-bottom: 12px; border-bottom: 1px solid #e8e4dc;">
              <p style="margin: 0; font-size: 13px; color: ${shipping === 0 ? '#16a34a' : '#0f1a0e'}; font-weight: 700;">${shipping === 0 ? 'FREE' : `₹${shipping.toFixed(0)}`}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 16px;"><p style="margin: 0; font-size: 14px; font-weight: 700; color: #0f1a0e;">Total Paid Amount</p></td>
            <td align="right" style="padding-top: 16px;"><p style="margin: 0; font-size: 18px; font-weight: 700; color: #0f1a0e;">₹${total.toFixed(0)}</p></td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 0 40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border: 1px solid #e8e4dc; border-radius: 8px; padding: 20px;">
          <tr>
            <td>
              <p style="margin: '0 0 8px'; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.05em;">Delivery Address</p>
              <p style="margin: 0; font-size: 14px; font-weight: 700; color: #0f1a0e;">${order.customer_name}</p>
              <p style="margin: 4px 0 0; font-size: 13px; color: #525252; line-height: 1.5;">${order.address}, ${order.city}, ${order.state} — ${order.pincode}<br>📞 ${order.phone}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 0 40px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td width="48%" style="border: 1px solid #e8e4dc; border-radius: 8px; padding: 14px;">
              <p style="margin: 0 0 4px; font-size: 10px; font-weight: 700; color: #737373; text-transform: uppercase;">Payment Details</p>
              <p style="margin: 0; font-size: 13px; font-weight: 600; color: #0f1a0e;">${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Gateway Paid'}</p>
            </td>
            <td width="4%"></td>
            <td width="48%" style="border: 1px solid #e8e4dc; border-radius: 8px; padding: 14px;">
              <p style="margin: 0 0 4px; font-size: 10px; font-weight: 700; color: #737373; text-transform: uppercase;">Delivery SLA</p>
              <p style="margin: 0; font-size: 13px; font-weight: 600; color: #0f1a0e;">3–7 Business Days</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 0 40px 40px; text-align: center; border-bottom: 1px solid #e8e4dc;">
        <a href="${BASE}/track-order" target="_blank" rel="noreferrer" style="display: inline-block; background-color: #0f1a0e; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Track Your Order</a>
      </td>
    </tr>
  `)
}

function buildShippedEmail(order) {
  const ordNum = order.id.slice(0, 8).toUpperCase()
  const trackLink = order.tracking_number 
    ? `${BASE}/track-order?number=${encodeURIComponent(order.tracking_number)}`
    : `${BASE}/track-order`

  return wrap(`
    ${header('Order Shipped', 'Your natural healing items are on their way! 🚚')}
    
    <tr>
      <td style="padding: 20px 40px; background-color: #faf8f5; border-bottom: 1px solid #e8e4dc;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td>
              <p style="margin: 0; font-size: 10px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.08em;">Order ID</p>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 700; color: #0f1a0e;">#${ordNum}</p>
            </td>
            <td align="right">
              <p style="margin: 0; font-size: 10px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.08em;">Status</p>
              <p style="margin: 4px 0 0; font-size: 13px; font-weight: 600; color: #16a34a;">Dispatched</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 36px 40px 24px;">
        <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f1a0e;">Hello ${order.customer_name || 'Customer'},</p>
        <p style="margin: 10px 0 0; font-size: 14px; color: #404040; line-height: 1.6;">Great news! Your package has cleared our sorting facility and is officially handed over to our shipping partner. Your items are expected to reach your location within the next 3–7 business days.</p>
      </td>
    </tr>

    ${order.tracking_number ? `
    <tr>
      <td style="padding: 0 40px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color: #fef9ee; border-radius: 8px; border: 1px solid rgba(201,168,76,0.15);">
          <tr>
            <td style="padding: 16px;">
              <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.05em;">Awb Tracking Number</p>
              <p style="margin: 0; font-size: 16px; font-weight: 700; color: #0f1a0e; letter-spacing: 0.02em;">${order.tracking_number}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>` : ''}

    <tr>
      <td style="padding: 0 40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border: 1px solid #e8e4dc; border-radius: 8px; padding: 20px;">
          <tr>
            <td>
              <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.05em;">Shipping Destination</p>
              <p style="margin: 0; font-size: 13px; color: #525252; line-height: 1.5;">${order.address}, ${order.city}, ${order.state} — ${order.pincode}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 0 40px 40px; text-align: center; border-bottom: 1px solid #e8e4dc;">
        <a href="${trackLink}" target="_blank" rel="noreferrer" style="display: inline-block; background-color: #0f1a0e; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Track Live Delivery Package</a>
      </td>
    </tr>
  `)
}

function buildDeliveredEmail(order) {
  const ordNum = order.id.slice(0, 8).toUpperCase()
  return wrap(`
    ${header('Order Delivered', 'Your packages have arrived safely at your doorstep! 🎉')}
    
    <tr>
      <td style="padding: 36px 40px 24px;">
        <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f1a0e;">Hello ${order.customer_name || 'Customer'},</p>
        <p style="margin: 10px 0 0; font-size: 14px; color: #404040; line-height: 1.6;">Your order has been safely delivered! We hope CrabVeda Ayurvedic Crab Oil brings wellness and relief to your joint & muscle care routine. 🌿</p>
      </td>
    </tr>

    <tr>
      <td style="padding: 0 40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #faf8f5; border: 1px solid #e8e4dc; border-radius: 8px; padding: 24px; text-align: center;">
          <tr>
            <td>
              <p style="margin: 0 0 12px; font-size: 15px; font-weight: 700; color: #0f1a0e;">Enjoyed your experience?</p>
              <p style="margin: 0 0 20px; font-size: 13px; color: #525252; line-height: 1.5;">Leave an honest review to help others find relief from muscle and joint pains.</p>
              <a href="${BASE}/products" target="_blank" rel="noreferrer" style="display: inline-block; background-color: #0f1a0e; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Write a Review</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 0 40px 40px; text-align: center; border-bottom: 1px solid #e8e4dc;">
        <p style="margin: 0; font-size: 13px; color: #525252;">Want to look for more wellness items? <a href="${BASE}/products" style="color: #93731e; font-weight: 700; text-decoration: none;">Shop Products Again</a></p>
      </td>
    </tr>
  `)
}

function buildCancelledEmail(order) {
  const ordNum = order.id.slice(0, 8).toUpperCase()
  const total = Number(order.total_amount || 0)
  return wrap(`
    ${header('Order Cancelled', `Updates regarding cancelled reference order #${ordNum}`)}
    
    <tr>
      <td style="padding: 36px 40px 24px;">
        <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f1a0e;">Hello ${order.customer_name || 'Customer'},</p>
        <p style="margin: 10px 0 0; font-size: 14px; color: #404040; line-height: 1.6;">Your order reference <strong>#${ordNum}</strong> has been cancelled and will not be managed further by our fulfillment desks.</p>
      </td>
    </tr>

    ${order.payment_method !== 'cod' ? `
    <tr>
      <td style="padding: 0 40px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px; padding: 16px;">
          <tr>
            <td>
              <p style="margin: 0 0 4px; font-size: 10px; font-weight: 700; color: #ef4444; text-transform: uppercase;">Refund Dispatched</p>
              <p style="margin: 0; font-size: 14px; font-weight: 700; color: #0f1a0e;">₹${total.toFixed(0)} will reverse into your original channel</p>
              <p style="margin: 4px 0 0; font-size: 12px; color: #737373;">Please allow 5–7 banking business days for setup clearings.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>` : ''}

    <tr>
      <td style="padding: 0 40px 40px; text-align: center; border-bottom: 1px solid #e8e4dc;">
        <p style="margin: 0 0 16px; font-size: 13px; color: #525252;">If this cancellation was unintended, please check back in with our desks:</p>
        <a href="${BASE}/products" target="_blank" rel="noreferrer" style="display: inline-block; background-color: #0f1a0e; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Shop Again</a>
      </td>
    </tr>
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