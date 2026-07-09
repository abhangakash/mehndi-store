import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — Crabveda Oil',
  description: 'Terms and conditions for using Crabveda Pain Relief Oil website and purchasing products.',
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
          <p>By accessing and using the Crabveda Oil website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </PolicySection>
        <PolicySection title="2. Products">
          <ul>
            <li>All product descriptions, images and prices are subject to change without notice</li>
            <li>We reserve the right to limit quantities of products sold</li>
            <li>Colors and packaging of products may vary slightly from images displayed on screen</li>
          </ul>
        </PolicySection>
        <PolicySection title="3. Orders & Payments">
          <ul>
            <li>Orders are confirmed only upon successful online payment</li>
            <li>We accept online payments only (UPI, credit/debit cards, net banking, and wallets). Cash on Delivery (COD) is not available</li>
            <li>All prices are in Indian Rupees (₹) and inclusive of applicable taxes</li>
            <li>We reserve the right to cancel orders in case of pricing errors or stock unavailability</li>
          </ul>
        </PolicySection>
        <PolicySection title="4. Product Usage & Sensitivity">
          <ul>
            <li>Crabveda Oil is formulated as a pain relief oil; however, individual skin reactions may vary</li>
            <li>Customers with known skin allergies or hyper-sensitive skin should perform a patch test before regular use</li>
            <li>Crabveda Oil is not liable for any allergic or adverse reactions if proper precautions or patch tests are not performed</li>
            <li>Consult a medical professional if you have chronic medical conditions before introducing new pain relief applications</li>
          </ul>
        </PolicySection>
        <PolicySection title="5. Intellectual Property">
          <p>All content on this website including text, images, product formulations, designs and logos are the intellectual property of Crabveda Oil. You may not reproduce, distribute or use our content without written permission.</p>
        </PolicySection>
        <PolicySection title="6. Limitation of Liability">
          <p>Crabveda Oil shall not be liable for any indirect, incidental or consequential damages arising from the use of our products. Our liability is strictly limited to the amount paid for the specific product purchased.</p>
        </PolicySection>
        <PolicySection title="7. Governing Law">
          <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Solapur, Maharashtra.</p>
        </PolicySection>
        <PolicySection title="8. Contact">
          <p>For questions about these Terms, contact us at crabveda@gmail.com or WhatsApp +91 99212 97518.</p>
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