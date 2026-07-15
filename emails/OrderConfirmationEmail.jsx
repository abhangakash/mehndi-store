import * as React from 'react'

// Professional HTML email template for order confirmation
// Pure inline-styles optimized to bypass Spam/Promotions algorithms
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
      <body style={{ margin: 0, padding: 0, backgroundColor: '#fdfbf7', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", WebkitFontSmoothing: 'antialiased' }}>
        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ backgroundColor: '#fdfbf7', padding: '40px 16px' }}>
          <tr>
            <td align="center">
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ maxWidth: '560px', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e4dc', boxShadow: '0 1px 3px rgba(15,26,14,0.05)' }}>

                {/* Header Section with Circular Logo */}
                <tr>
                  <td style={{ backgroundColor: '#0f1a0e', padding: '40px 40px 36px', textAlign: 'center' }}>
                    {/* Circular Logo Row */}
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
                              border: '2px solid #93731e',
                              backgroundColor: '#ffffff',
                              objectFit: 'cover'
                            }} 
                          />
                        </td>
                      </tr>
                    </table>
                    
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', color: '#93731e', textTransform: 'uppercase', marginBottom: '10px' }}>
                      ✦ CRABVEDA AYURVEDA ✦
                    </p>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                      Order Confirmed
                    </h1>
                    <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#a3b899' }}>
                      Your order is logged and in preparation for dispatch 🌿
                    </p>
                  </td>
                </tr>

                {/* Tracking & Meta Identifiers */}
                <tr>
                  <td style={{ padding: '20px 40px', backgroundColor: '#faf8f5', borderBottom: '1px solid #e8e4dc' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                      <tr>
                        <td>
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order ID</p>
                          <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 700, color: '#0f1a0e' }}>
                            #{ String(order?.id || 'PENDING').slice(0, 8).toUpperCase() }
                          </p>
                        </td>
                        <td align="right">
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order Date</p>
                          <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600, color: '#0f1a0e' }}>
                            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Greeting Content */}
                <tr>
                  <td style={{ padding: '36px 40px 24px' }}>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f1a0e' }}>
                      Hello {order?.customer_name || 'Customer'},
                    </p>
                    <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#404040', lineHeight: '1.6' }}>
                      Thank you for choosing CrabVeda. We have securely received your package details and our fulfillment group is prioritizing packing operations. You will receive live delivery tracking details as soon as the carrier registers the package bundle.
                    </p>
                  </td>
                </tr>

                {/* Line Item Grid Layout */}
                <tr>
                  <td style={{ padding: '0 40px 24px' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e8e4dc' }}>
                          <th align="left" style={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 700, color: '#737373', textTransform: 'uppercase' }}>Items Ordered</th>
                          <th align="right" style={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 700, color: '#737373', textTransform: 'uppercase' }}>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {safeItems.map((item, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f5f2eb' }}>
                            <td style={{ padding: '14px 0' }}>
                              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0f1a0e' }}>{item?.product_name || 'Ayurvedic Treatment Item'}</p>
                              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#737373' }}>Qty: {item?.quantity || 1}</p>
                            </td>
                            <td align="right" style={{ padding: '14px 0', verticalAlign: 'middle' }}>
                              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f1a0e' }}>
                                ₹{Number(item?.total_price || 0).toFixed(0)}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* Financial Overview Calculation Summary */}
                <tr>
                  <td style={{ padding: '0 40px 32px' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ borderTop: '2px solid #0f1a0e', paddingTop: '16px' }}>
                      <tr>
                        <td style={{ paddingBottom: '8px' }}><p style={{ margin: 0, fontSize: '13px', color: '#525252' }}>Subtotal</p></td>
                        <td align="right" style={{ paddingBottom: '8px' }}><p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0f1a0e' }}>₹{subtotal.toFixed(0)}</p></td>
                      </tr>
                      <tr>
                        <td style={{ paddingBottom: '12px', borderBottom: '1px solid #e8e4dc' }}><p style={{ margin: 0, fontSize: '13px', color: '#525252' }}>Shipping & Handling</p></td>
                        <td align="right" style={{ paddingBottom: '12px', borderBottom: '1px solid #e8e4dc' }}>
                          <p style={{ margin: 0, fontSize: '13px', color: shipping === 0 ? '#16a34a' : '#0f1a0e', fontWeight: 700 }}>
                            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(0)}`}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingTop: '16px' }}><p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f1a0e' }}>Total Paid Amount</p></td>
                        <td align="right" style={{ paddingTop: '16px' }}>
                          <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f1a0e' }}>₹{total.toFixed(0)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Secure Delivery Address Block */}
                <tr>
                  <td style={{ padding: '0 40px 32px' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ border: '1px solid #e8e4dc', borderRadius: '8px', padding: '20px' }}>
                      <tr>
                        <td>
                          <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery Address</p>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f1a0e' }}>{order?.customer_name || 'Customer'}</p>
                          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#525252', lineHeight: '1.5' }}>
                            {order?.address}<br />
                            {order?.city}, {order?.state} — {order?.pincode}<br />
                            <span style={{ display: 'inline-block', marginTop: '8px', color: '#0f1a0e', fontWeight: 600 }}>📞 {order?.phone}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Dynamic Parameter Grid Panels */}
                <tr>
                  <td style={{ padding: '0 40px 40px' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                      <tr>
                        <td width="48%" style={{ border: '1px solid #e8e4dc', borderRadius: '8px', padding: '14px' }}>
                          <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 700, color: '#737373', textTransform: 'uppercase' }}>Payment Details</p>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0f1a0e' }}>
                            {order?.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Gateway Paid'}
                          </p>
                        </td>
                        <td width="4%"></td>
                        <td width="48%" style={{ border: '1px solid #e8e4dc', borderRadius: '8px', padding: '14px' }}>
                          <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 700, color: '#737373', textTransform: 'uppercase' }}>Delivery SLA</p>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0f1a0e' }}>3–7 Business Days</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Primary Fulfillment Action Tracker Button */}
                <tr>
                  <td style={{ padding: '0 40px 40px', textAlign: 'center', borderBottom: '1px solid #e8e4dc' }}>
                    <a href="https://crabveda.com/track-order" target="_blank" rel="noreferrer"
                      style={{ display: 'inline-block', backgroundColor: '#0f1a0e', color: '#ffffff', textDecoration: 'none', padding: '14px 32px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Track Your Order
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
                        {/* Instagram Branded Platform Node */}
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

                        {/* Facebook Branded Platform Node */}
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

                        {/* Official WhatsApp Asset */}
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
                  <td style={{ backgroundColor: '#0f1a0e', padding: '24px 40px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#93731e', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      CrabVeda Joint & Muscle Care
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#8a9e85' }}>
                      crabveda.com · crabveda@gmail.com
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