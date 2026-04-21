import Link from 'next/link'
import { Truck, ArrowLeft, Package, Clock, MapPin, RefreshCw, Phone } from 'lucide-react'

export const metadata = {
  title: 'Shipping Policy — Shrilekha Mehndi Art',
  description: 'Shipping and delivery information for Shrilekha Mehndi Art products. Free shipping above ₹499, COD available.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 hover:underline"
        style={{ color: 'var(--brand-muted)' }}>
        <ArrowLeft size={15} /> Back to Home
      </Link>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#3b82f6' }}>
          <Truck size={18} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-text)' }}>Shipping Policy</h1>
          <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>Last updated: January 2025</p>
        </div>
      </div>

      {/* Quick info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: <Truck size={18} />, label: 'Free Shipping', sub: 'Orders above ₹499', color: '#15803d', bg: '#dcfce7' },
          { icon: <Clock size={18} />, label: '3-7 Days', sub: 'Standard delivery', color: '#1d4ed8', bg: '#dbeafe' },
          { icon: <Package size={18} />, label: 'COD Available', sub: 'Orders above ₹999', color: '#d97706', bg: '#fef3c7' },
          { icon: <MapPin size={18} />, label: 'Pan India', sub: 'All states covered', color: '#7c3aed', bg: '#ede9fe' },
        ].map(b => (
          <div key={b.label} className="card p-3 text-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: b.bg, color: b.color }}>
              {b.icon}
            </div>
            <p className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{b.label}</p>
            <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>{b.sub}</p>
          </div>
        ))}
      </div>

      <div className="card p-6 md:p-8 flex flex-col gap-8">
        <PolicySection title="Shipping Charges">
          <table>
            <thead>
              <tr>
                <th>Order Value</th>
                <th>Shipping Charge</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Below ₹499</td><td>₹60 flat rate</td></tr>
              <tr><td>₹499 and above</td><td>FREE</td></tr>
            </tbody>
          </table>
        </PolicySection>

        <PolicySection title="Delivery Timeframes">
          <ul>
            <li><strong>Pune:</strong> 1-2 business days</li>
            <li><strong>Maharashtra:</strong> 2-4 business days</li>
            <li><strong>Rest of India:</strong> 3-7 business days</li>
            <li><strong>Remote areas:</strong> 5-10 business days</li>
          </ul>
          <p>Delivery times are estimates and may vary due to courier delays, public holidays or unforeseen circumstances.</p>
        </PolicySection>

        <PolicySection title="Cash on Delivery (COD)">
          <ul>
            <li>COD is available on orders above ₹999</li>
            <li>COD orders may take 1 additional day to process</li>
            <li>Please keep exact change ready for COD orders</li>
            <li>COD is available across most pin codes in India</li>
          </ul>
        </PolicySection>

        <PolicySection title="Order Processing">
          <ul>
            <li>Orders are processed within 24 hours of placement (business days only)</li>
            <li>Orders placed on weekends or holidays are processed the next business day</li>
            <li>You will receive a WhatsApp/email confirmation once your order is shipped with tracking details</li>
          </ul>
        </PolicySection>

        <PolicySection title="Tracking Your Order">
          <p>Once your order is shipped, you will receive tracking information via WhatsApp or email. You can also track your order on our website at <Link href="/track-order" style={{ color: 'var(--brand-green)' }} className="underline">Track Order</Link> page using your phone number or email.</p>
        </PolicySection>

        <PolicySection title="Damaged or Missing Items">
          <ul>
            <li>If you receive a damaged product, contact us within 48 hours with photos</li>
            <li>We will arrange a replacement or full refund</li>
            <li>Missing items must be reported within 24 hours of delivery</li>
            <li>Contact us on WhatsApp +91 96237 40541 for fastest resolution</li>
          </ul>
        </PolicySection>

        <PolicySection title="Return Policy">
          <ul>
            <li>Returns accepted within 7 days of delivery for unused, sealed products</li>
            <li>Product must be in original packaging</li>
            <li>Return shipping cost is borne by the customer unless the item is defective</li>
            <li>Refund is processed within 5-7 business days after we receive the return</li>
            <li>Customized or opened products cannot be returned</li>
          </ul>
        </PolicySection>

        <div className="rounded-xl p-5 flex items-start gap-3" style={{ backgroundColor: 'var(--brand-surface)' }}>
          <Phone size={18} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-green)' }} />
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--brand-text)' }}>Need help with your order?</p>
            <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>
              Contact us on <a href="https://wa.me/919623740541" className="underline" style={{ color: 'var(--brand-green)' }}>WhatsApp +91 96237 40541</a> or email <a href="mailto:info@shrilekha.com" className="underline" style={{ color: 'var(--brand-green)' }}>info@shrilekha.com</a>. We respond within 2 hours on business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PolicySection({ title, children }) {
  return (
    <div>
      <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--brand-green)' }}>{title}</h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>
        {children}
      </div>
    </div>
  )
}