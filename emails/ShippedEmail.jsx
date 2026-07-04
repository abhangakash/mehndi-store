import * as React from 'react'

export function ShippedEmail({ order = {}, trackingNumber = '' }) {
  const orderIdShort = (order.id || '').slice(0, 8).toUpperCase()
  const trackLink = trackingNumber 
    ? `https://crabveda.com/track-order?number=${encodeURIComponent(trackingNumber)}`
    : 'https://crabveda.com/track-order'

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Order is Shipped!</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f5f0e8', fontFamily: "'Segoe UI', Arial, sans-serif", WebkitTextSizeAdjust: '100%', msTextSizeAdjust: '100%' }}>
        <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation" style={{ backgroundColor: '#f5f0e8', padding: '32px 16px' }}>
          <tr>
            <td align="center" valign="top">
              <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation" style={{ maxWidth: '560px', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                
                {/* Header Banner */}
                <tr>
                  <td align="center" valign="top" style={{ background: 'linear-gradient(135deg, #0f1a0e, #1a3020)', padding: '32px' }}>
                    <p style={{ margin: 0, fontSize: '32px' }}>🚚</p>
                    <h1 style={{ margin: '12px 0 0', fontSize: '24px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                      Your Order is on the Way!
                    </h1>
                    {orderIdShort && (
                      <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                        Order #{orderIdShort}
                      </p>
                    )}
                  </td>
                </tr>

                {/* Main Content Body */}
                <tr>
                  <td valign="top" style={{ padding: '28px 32px' }}>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f1a0e' }}>
                      Hi {order.customer_name || 'there'} 👋
                    </p>
                    <p style={{ margin: '8px 0 20px', fontSize: '14px', color: 'rgba(15,26,14,0.6)', lineHeight: '1.6' }}>
                      Great news! Your order has been shipped and is on its way to you. Expected delivery within 3–7 business days.
                    </p>

                    {/* Tracking Section */}
                    {trackingNumber && (
                      <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation" style={{ backgroundColor: '#fef9ee', borderRadius: '12px', border: '1px solid rgba(201,168,76,0.2)', marginBottom: '20px' }}>
                        <tr>
                          <td style={{ padding: '16px' }}>
                            <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 800, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tracking Number</p>
                            <p style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0f1a0e', letterSpacing: '0.02em' }}>{trackingNumber}</p>
                          </td>
                        </tr>
                      </table>
                    )}

                    {/* Order Summary Table */}
                    {order.order_items && order.order_items.length > 0 && (
                      <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation" style={{ marginBottom: '20px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', overflow: 'hidden', borderCollapse: 'separate' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#fafaf7' }}>
                            <th align="left" style={{ padding: '12px 16px', fontWeight: 800, color: 'rgba(15,26,14,0.5)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Item Summary</th>
                            <th align="right" style={{ padding: '12px 16px', fontWeight: 800, color: 'rgba(15,26,14,0.5)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.order_items.map((item, idx) => {
                            const isLast = idx === order.order_items.length - 1
                            return (
                              <tr key={idx}>
                                <td valign="middle" style={{ padding: '12px 16px', color: '#0f1a0e', fontWeight: 600, fontSize: '13px', borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.04)' }}>
                                  {item.products?.name || item.product_name}
                                </td>
                                <td align="right" valign="middle" style={{ padding: '12px 16px', color: 'rgba(15,26,14,0.6)', fontWeight: 700, fontSize: '13px', borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.04)' }}>
                                  {item.quantity}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )}

                    {/* Delivery Address Block */}
                    {(order.address || order.city) && (
                      <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation" style={{ backgroundColor: '#fafaf7', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                        <tr>
                          <td style={{ padding: '16px' }}>
                            <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 800, color: 'rgba(15,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Delivering To</p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#0f1a0e', lineHeight: '1.5', fontWeight: 500 }}>
                              {order.address}{order.city ? `, ${order.city}` : ''}{order.state ? `, ${order.state}` : ''}{order.pincode ? ` — ${order.pincode}` : ''}
                            </p>
                          </td>
                        </tr>
                      </table>
                    )}
                  </td>
                </tr>

                {/* Interactive Action Button */}
                <tr>
                  <td align="center" valign="top" style={{ padding: '0 32px 32px' }}>
                    <a href={trackLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-block', backgroundColor: '#0f1a0e', color: '#ffffff', textDecoration: 'none', padding: '14px 32px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      Track Order →
                    </a>
                  </td>
                </tr>

                {/* Footer Brand Banner */}
                <tr>
                  <td align="center" valign="top" style={{ backgroundColor: '#0f1a0e', padding: '20px 32px' }}>
                    <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.3em' }}>CrabVeda Joint & Muscle Care</p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>crabveda.com · +91 99212 97518</p>
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