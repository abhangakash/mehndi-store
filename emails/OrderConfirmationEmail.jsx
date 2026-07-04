import * as React from 'react'

// Beautiful HTML email template for order confirmation
// Works with Resend + react-email
export function OrderConfirmationEmail({ order = {}, items = [] }) {
  const subtotal = Number(order?.subtotal || 0)
  const shipping = Number(order?.shipping_amount || 0)
  const total = Number(order?.total_amount || 0)
  const safeItems = Array.isArray(items) ? items : []

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Confirmed — CrabVeda</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f5f0e8', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ backgroundColor: '#f5f0e8', padding: '32px 16px' }}>
          <tr>
            <td align="center">
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ maxWidth: '560px', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

                {/* Header */}
                <tr>
                  <td style={{ background: 'linear-gradient(135deg, #0f1a0e, #1a3020)', padding: '32px 32px 24px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, letterSpacing: '0.3em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '8px' }}>
                      ✦ CrabVeda ✦
                    </p>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                      Order Confirmed!
                    </h1>
                    <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                      Thank you for shopping with us 🌿
                    </p>
                  </td>
                </tr>

                {/* Order ID + Date */}
                <tr>
                  <td style={{ padding: '24px 32px', backgroundColor: '#fef9ee', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                      <tr>
                        <td>
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: 'rgba(15,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Order ID</p>
                          <p style={{ margin: '4px 0 0', fontSize: '16px', fontWeight: 900, color: '#0f1a0e' }}>
                            #{ (order?.id || '').slice(0, 8).toUpperCase() }
                          </p>
                        </td>
                        <td align="right">
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: 'rgba(15,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Date</p>
                          <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600, color: '#0f1a0e' }}>
                            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Greeting */}
                <tr>
                  <td style={{ padding: '28px 32px 16px' }}>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f1a0e' }}>
                      Hi {order?.customer_name || 'Customer'} 👋
                    </p>
                    <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'rgba(15,26,14,0.6)', lineHeight: '1.6' }}>
                      Your order has been confirmed and is being prepared for dispatch. We'll send you another update when it's shipped!
                    </p>
                  </td>
                </tr>

                {/* Items */}
                <tr>
                  <td style={{ padding: '0 32px 24px' }}>
                    <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 800, color: 'rgba(15,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      Items Ordered
                    </p>
                    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
                      {safeItems.map((item, i) => (
                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#fafaf7' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f1a0e' }}>{item?.product_name || 'Ayurvedic Treatment Item'}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(15,26,14,0.4)' }}>Qty: {item?.quantity || 1}</p>
                          </td>
                          <td align="right" style={{ padding: '12px 16px' }}>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#c9a84c' }}>
                              ₹{Number(item?.total_price || 0).toFixed(0)}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </td>
                </tr>

                {/* Price summary */}
                <tr>
                  <td style={{ padding: '0 32px 24px' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ backgroundColor: '#fafaf7', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <tr>
                        <td><p style={{ margin: '0 0 6px', fontSize: '13px', color: 'rgba(15,26,14,0.5)' }}>Subtotal</p></td>
                        <td align="right"><p style={{ margin: '0 0 6px', fontSize: '13px', color: '#0f1a0e' }}>₹{subtotal.toFixed(0)}</p></td>
                      </tr>
                      <tr>
                        <td><p style={{ margin: '0 0 12px', fontSize: '13px', color: 'rgba(15,26,14,0.5)' }}>Shipping</p></td>
                        <td align="right">
                          <p style={{ margin: '0 0 12px', fontSize: '13px', color: shipping === 0 ? '#15803d' : '#0f1a0e', fontWeight: shipping === 0 ? 700 : 400 }}>
                            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(0)}`}
                          </p>
                        </td>
                      </tr>
                      <tr style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                        <td style={{ paddingTop: '12px' }}><p style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0f1a0e' }}>Total</p></td>
                        <td align="right" style={{ paddingTop: '12px' }}>
                          <p style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#c9a84c' }}>₹{total.toFixed(0)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Delivery address */}
                <tr>
                  <td style={{ padding: '0 32px 24px' }}>
                    <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 800, color: 'rgba(15,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      Delivery Address
                    </p>
                    <div style={{ backgroundColor: '#f0fdf4', borderRadius: '12px', padding: '16px', border: '1px solid rgba(21,128,61,0.15)' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f1a0e' }}>{order?.customer_name || 'Customer'}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(15,26,14,0.6)', lineHeight: '1.5' }}>
                        {order?.address}<br />
                        {order?.city}, {order?.state} — {order?.pincode}<br />
                        📞 {order?.phone}
                      </p>
                    </div>
                  </td>
                </tr>

                {/* Payment + delivery */}
                <tr>
                  <td style={{ padding: '0 32px 24px' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                      <tr>
                        <td style={{ width: '48%', backgroundColor: '#fef9ee', borderRadius: '12px', padding: '14px', border: '1px solid rgba(201,168,76,0.2)' }}>
                          <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 800, color: 'rgba(15,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Payment</p>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f1a0e' }}>
                            {order?.payment_method === 'cod' ? '💵 Cash on Delivery' : '✅ Paid Online'}
                          </p>
                        </td>
                        <td style={{ width: '4%' }} />
                        <td style={{ width: '48%', backgroundColor: '#e0f2fe', borderRadius: '12px', padding: '14px', border: '1px solid rgba(3,105,161,0.15)' }}>
                          <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 800, color: 'rgba(15,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Est. Delivery</p>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f1a0e' }}>🚚 3–7 Business Days</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* CTA Button */}
                <tr>
                  <td style={{ padding: '0 32px 32px', textAlign: 'center' }}>
                    <a href="https://crabveda.com/track-order"
                      style={{ display: 'inline-block', backgroundColor: '#0f1a0e', color: '#ffffff', textDecoration: 'none', padding: '14px 32px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      Track Your Order →
                    </a>
                    <p style={{ margin: '12px 0 0', fontSize: '12px', color: 'rgba(15,26,14,0.4)' }}>
                      Or WhatsApp us at{' '}
                      <a href="https://wa.me/919921297518" style={{ color: '#c9a84c', fontWeight: 700, textDecoration: 'none' }}>+91 99212 97518</a>
                    </p>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ backgroundColor: '#0f1a0e', padding: '20px 32px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                      CrabVeda Joint & Muscle Care
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                      crabveda.com · crabveda@gmail.com
                    </p>
                    <p style={{ margin: '8px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
                      ✦ Ayurvedic Crab Oil for Natural Healing ✦
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}