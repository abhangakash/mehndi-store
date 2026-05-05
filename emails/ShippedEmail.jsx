import * as React from 'react'

export function ShippedEmail({ order, trackingNumber }) {
  return (
    <html>
      <head><meta charSet="utf-8" /><title>Your Order is Shipped!</title></head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f5f0e8', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f5f0e8', padding: '32px 16px' }}>
          <tr>
            <td align="center">
              <table width="100%" style={{ maxWidth: '560px', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <tr>
                  <td style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', padding: '32px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '32px' }}>🚚</p>
                    <h1 style={{ margin: '12px 0 0', fontSize: '24px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase' }}>
                      Your Order is on the Way!
                    </h1>
                    <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                      Order #{(order.id || '').slice(0, 8).toUpperCase()}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '28px 32px' }}>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f1a0e' }}>Hi {order.customer_name} 👋</p>
                    <p style={{ margin: '8px 0 20px', fontSize: '14px', color: 'rgba(15,26,14,0.6)', lineHeight: '1.6' }}>
                      Great news! Your order has been shipped and is on its way to you. Expected delivery in 2–3 business days.
                    </p>
                    {trackingNumber && (
                      <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '16px', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '20px' }}>
                        <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 800, color: 'rgba(29,78,216,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tracking Number</p>
                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#1d4ed8' }}>{trackingNumber}</p>
                      </div>
                    )}
                    <div style={{ backgroundColor: '#fafaf7', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 800, color: 'rgba(15,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Delivering To</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#0f1a0e', lineHeight: '1.5' }}>
                        {order.address}, {order.city}, {order.state} — {order.pincode}
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0 32px 32px', textAlign: 'center' }}>
                    <a href="https://shrilekha.com/track-order"
                      style={{ display: 'inline-block', backgroundColor: '#1d4ed8', color: '#ffffff', textDecoration: 'none', padding: '14px 32px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      Track Order →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: '#0f1a0e', padding: '20px 32px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.3em' }}>Shrilekha Mehndi Art & Glowup</p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Pune · +91 96237 40541</p>
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