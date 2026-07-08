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
      <body style={{ margin: 0, padding: 0, backgroundColor: '#fdfbf7', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", WebkitFontSmoothing: 'antialiased' }}>
        <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation" style={{ backgroundColor: '#fdfbf7', padding: '40px 16px' }}>
          <tr>
            <td align="center" valign="top">
              <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation" style={{ maxWidth: '560px', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e4dc', boxShadow: '0 1px 3px rgba(15,26,14,0.05)' }}>
                
                {/* Header Banner with Circular Logo */}
                <tr>
                  <td align="center" valign="top" style={{ backgroundColor: '#0f1a0e', padding: '40px 40px 36px' }}>
                    {/* Circular Logo */}
                    <table align="center" cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto 16px auto' }}>
                      <tr>
                        <td style={{ textAlign: 'center' }}>
                          <img 
                            src="https://crabveda.com/logo.jpeg" 
                            width="72" 
                            height="72" 
                            alt="CrabVeda Logo" 
                            style={{ 
                              display: 'block', 
                              borderRadius: '50%', 
                              border: '2px solid #c9a84c',
                              backgroundColor: '#ffffff',
                              objectFit: 'cover'
                            }} 
                          />
                        </td>
                      </tr>
                    </table>

                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '10px' }}>
                      ✦ CRABVEDA AYURVEDA ✦
                    </p>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                      Order Shipped
                    </h1>
                    <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#a3b899' }}>
                      Your natural healing items are on their way! 🚚
                    </p>
                  </td>
                </tr>

                {/* Meta Identifiers */}
                <tr>
                  <td style={{ padding: '20px 40px', backgroundColor: '#faf8f5', borderBottom: '1px solid #e8e4dc' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation">
                      <tr>
                        <td>
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order ID</p>
                          {orderIdShort && (
                            <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 700, color: '#0f1a0e' }}>
                              #{orderIdShort}
                            </p>
                          )}
                        </td>
                        <td align="right">
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</p>
                          <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600, color: '#16a34a' }}>
                            Dispatched
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Main Content Body */}
                <tr>
                  <td valign="top" style={{ padding: '36px 40px 24px' }}>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f1a0e' }}>
                      Hello {order.customer_name || 'Customer'},
                    </p>
                    <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#404040', lineHeight: '1.6' }}>
                      Great news! Your package has cleared our sorting facility and is officially handed over to our shipping partner. Your items are expected to reach your location within the next 3–7 business days.
                    </p>
                  </td>
                </tr>

                {/* Tracking Section */}
                {trackingNumber && (
                  <tr>
                    <td style={{ padding: '0 40px 24px' }}>
                      <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation" style={{ backgroundColor: '#fef9ee', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.15)' }}>
                        <tr>
                          <td style={{ padding: '16px' }}>
                            <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Awb Tracking Number</p>
                            <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f1a0e', letterSpacing: '0.02em' }}>{trackingNumber}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                )}

                {/* Order Summary Table */}
                {order.order_items && order.order_items.length > 0 && (
                  <tr>
                    <td style={{ padding: '0 40px 24px' }}>
                      <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e8e4dc' }}>
                            <th align="left" style={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 700, color: '#737373', textTransform: 'uppercase' }}>Items Transferred</th>
                            <th align="right" style={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 700, color: '#737373', textTransform: 'uppercase' }}>Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.order_items.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f5f2eb' }}>
                              <td style={{ padding: '14px 0' }}>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0f1a0e' }}>
                                  {item.products?.name || item.product_name}
                                </p>
                              </td>
                              <td align="right" style={{ padding: '14px 0', verticalAlign: 'middle' }}>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f1a0e' }}>
                                  {item.quantity}
                                </p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}

                {/* Delivery Address Block */}
                {(order.address || order.city) && (
                  <tr>
                    <td style={{ padding: '0 40px 32px' }}>
                      <table width="100%" cellPadding="0" cellSpacing="0" border={0} role="presentation" style={{ border: '1px solid #e8e4dc', borderRadius: '8px', padding: '20px' }}>
                        <tr>
                          <td>
                            <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shipping Destination</p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#525252', lineHeight: '1.5' }}>
                              <strong>{order.customer_name}</strong><br />
                              {order.address}{order.city ? `, ${order.city}` : ''}{order.state ? `, ${order.state}` : ''}{order.pincode ? ` — ${order.pincode}` : ''}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                )}

                {/* Primary Fulfillment Action Tracker Button */}
                <tr>
                  <td align="center" valign="top" style={{ padding: '0 40px 40px', textAlign: 'center', borderBottom: '1px solid #e8e4dc' }}>
                    <a href={trackLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-block', backgroundColor: '#0f1a0e', color: '#ffffff', textDecoration: 'none', padding: '14px 32px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Track Live Delivery Package
                    </a>
                  </td>
                </tr>

                {/* Social Directory Footer Panel Using Official CDN Assets */}
                <tr>
                  <td style={{ padding: '32px 40px', textAlign: 'center', backgroundColor: '#faf8f5' }}>
                    <p style={{ margin: '0 0 16px', fontSize: '11px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Follow Our Channels
                    </p>
                    
                    <table align="center" cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
                      <tr>
                        {/* Instagram */}
                        <td style={{ padding: '0 10px' }}>
                          <a href="https://www.instagram.com/crabveda" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'inline-block' }}>
                            <table cellPadding="0" cellSpacing="0" role="presentation">
                              <tr>
                                <td style={{ verticalAlign: 'middle', paddingRight: '6px' }}>
                                  <img src="https://cdn-icons-png.flaticon.com/32/174/174855.png" width="16" height="16" alt="Instagram" style={{ display: 'block', border: 0 }} />
                                </td>
                                <td style={{ verticalAlign: 'middle', fontSize: '13px', color: '#525252', fontWeight: 500 }}>Instagram</td>
                              </tr>
                            </table>
                          </a>
                        </td>

                        {/* Facebook */}
                        <td style={{ padding: '0 10px' }}>
                          <a href="https://www.facebook.com/share/1BE5Lhjuqk/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'inline-block' }}>
                            <table cellPadding="0" cellSpacing="0" role="presentation">
                              <tr>
                                <td style={{ verticalAlign: 'middle', paddingRight: '6px' }}>
                                  <img src="https://cdn-icons-png.flaticon.com/32/733/733547.png" width="16" height="16" alt="Facebook" style={{ display: 'block', border: 0 }} />
                                </td>
                                <td style={{ verticalAlign: 'middle', fontSize: '13px', color: '#525252', fontWeight: 500 }}>Facebook</td>
                              </tr>
                            </table>
                          </a>
                        </td>

                        {/* WhatsApp (Original Brand Icon Asset) */}
                        <td style={{ padding: '0 10px' }}>
                          <a href="https://wa.me/919921297518" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'inline-block' }}>
                            <table cellPadding="0" cellSpacing="0" role="presentation">
                              <tr>
                                <td style={{ verticalAlign: 'middle', paddingRight: '6px' }}>
                                  <img src="https://cdn-icons-png.flaticon.com/32/733/733585.png" width="16" height="16" alt="WhatsApp" style={{ display: 'block', border: 0 }} />
                                </td>
                                <td style={{ verticalAlign: 'middle', fontSize: '13px', color: '#525252', fontWeight: 500 }}>WhatsApp</td>
                              </tr>
                            </table>
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Sub-Footer Declarations */}
                <tr>
                  <td align="center" valign="top" style={{ backgroundColor: '#0f1a0e', padding: '24px 40px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      CrabVeda Joint & Muscle Care
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#8a9e85' }}>
                      crabveda.com · +91 99212 97518
                    </p>
                    <p style={{ margin: '14px 0 0', fontSize: '11px', color: '#52634d', lineHeight: '1.4' }}>
                      This transactional automated notification layout was dispatched safely to your profile context.<br />
                      © {new Date().getFullYear()} CrabVeda. All rights reserved.
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