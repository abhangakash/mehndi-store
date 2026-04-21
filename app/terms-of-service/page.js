import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — Shrilekha Mehndi Art',
  description: 'Terms and conditions for using Shrilekha Mehndi Art & Glowup services and website.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 hover:underline"
        style={{ color: 'var(--brand-muted)' }}>
        <ArrowLeft size={15} /> Back to Home
      </Link>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--brand-brown)' }}>
          <FileText size={18} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-text)' }}>Terms of Service</h1>
          <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>Last updated: January 2025</p>
        </div>
      </div>
      <div className="card p-6 md:p-8 flex flex-col gap-8">
        <PolicySection title="1. Acceptance of Terms">
          <p>By accessing and using the Shrilekha Mehndi Art website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </PolicySection>
        <PolicySection title="2. Products & Services">
          <ul>
            <li>All product descriptions, images and prices are subject to change without notice</li>
            <li>We reserve the right to limit quantities of products sold</li>
            <li>Colors of products may vary slightly from images displayed on screen</li>
            <li>Service availability (mehndi/makeup) is subject to artist availability and location</li>
          </ul>
        </PolicySection>
        <PolicySection title="3. Orders & Payments">
          <ul>
            <li>Orders are confirmed only upon successful payment</li>
            <li>We accept UPI, credit/debit cards, net banking and Cash on Delivery (orders above ₹999)</li>
            <li>All prices are in Indian Rupees (₹) and inclusive of applicable taxes</li>
            <li>We reserve the right to cancel orders in case of pricing errors or stock unavailability</li>
          </ul>
        </PolicySection>
        <PolicySection title="4. Service Bookings">
          <ul>
            <li>Mehndi and makeup appointments require advance booking via WhatsApp</li>
            <li>A confirmation is provided via WhatsApp message</li>
            <li>Cancellations must be made at least 24 hours before the appointment</li>
            <li>Late cancellations may incur a fee of 20% of the package price</li>
            <li>Travel charges may apply for locations outside Pune city limits</li>
          </ul>
        </PolicySection>
        <PolicySection title="5. Allergies & Skin Sensitivity">
          <ul>
            <li>All mehndi products contain natural henna; however, individual reactions may vary</li>
            <li>Customers with known skin allergies should perform a patch test before use</li>
            <li>Shrilekha Mehndi Art is not liable for any allergic reactions if proper precautions are not taken</li>
            <li>Inform your artist of any skin conditions before your appointment</li>
          </ul>
        </PolicySection>
        <PolicySection title="6. Intellectual Property">
          <p>All content on this website including text, images, designs and logos are the intellectual property of Shrilekha Mehndi Art. You may not reproduce, distribute or use our content without written permission.</p>
        </PolicySection>
        <PolicySection title="7. Limitation of Liability">
          <p>Shrilekha Mehndi Art shall not be liable for any indirect, incidental or consequential damages arising from the use of our products or services. Our liability is limited to the amount paid for the specific product or service.</p>
        </PolicySection>
        <PolicySection title="8. Governing Law">
          <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra.</p>
        </PolicySection>
        <PolicySection title="9. Contact">
          <p>For questions about these Terms, contact us at info@shrilekha.com or WhatsApp +91 96237 40541.</p>
        </PolicySection>
      </div>
    </div>
  )
}

function PolicySection({ title, children }) {
  return (
    <div>
      <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--brand-green)' }}>{title}</h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>{children}</div>
    </div>
  )
}