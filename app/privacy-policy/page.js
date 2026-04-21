import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — Shrilekha Mehndi Art',
  description: 'Privacy policy for Shrilekha Mehndi Art & Glowup. Learn how we collect, use and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 hover:underline"
        style={{ color: 'var(--brand-muted)' }}>
        <ArrowLeft size={15} /> Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--brand-green)' }}>
          <Shield size={18} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-text)' }}>Privacy Policy</h1>
          <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>Last updated: January 2025</p>
        </div>
      </div>

      <div className="card p-6 md:p-8 flex flex-col gap-8">
        <PolicySection title="1. Information We Collect">
          <p>We collect information you provide directly to us when you:</p>
          <ul>
            <li>Place an order on our website (name, phone, email, delivery address)</li>
            <li>Create an account (name, email, phone number)</li>
            <li>Contact us for inquiries or bookings</li>
            <li>Subscribe to our updates</li>
          </ul>
          <p>We also automatically collect certain technical information when you visit our site, such as your IP address, browser type, and pages visited.</p>
        </PolicySection>

        <PolicySection title="2. How We Use Your Information">
          <p>We use your information to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your queries and provide customer support</li>
            <li>Improve our website and services</li>
            <li>Send promotional communications (only with your consent)</li>
            <li>Prevent fraudulent transactions and maintain security</li>
          </ul>
        </PolicySection>

        <PolicySection title="3. Information Sharing">
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only:</p>
          <ul>
            <li>With payment processors (Razorpay) to complete transactions securely</li>
            <li>With shipping partners to deliver your orders</li>
            <li>When required by law or to protect our legal rights</li>
            <li>With your explicit consent</li>
          </ul>
        </PolicySection>

        <PolicySection title="4. Payment Security">
          <p>All payment transactions are processed through Razorpay, a PCI-DSS compliant payment gateway. We do not store your credit/debit card details on our servers. Your payment information is encrypted and processed securely.</p>
        </PolicySection>

        <PolicySection title="5. Data Retention">
          <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, including for legal, accounting, or reporting requirements. Order information is typically retained for 3 years for accounting purposes.</p>
        </PolicySection>

        <PolicySection title="6. Your Rights">
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of marketing communications</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
          <p>To exercise these rights, contact us at info@shrilekha.com or WhatsApp +91 96237 40541.</p>
        </PolicySection>

        <PolicySection title="7. Cookies">
          <p>Our website uses cookies to enhance your browsing experience. These include essential cookies (required for the site to function), preference cookies (to remember your settings), and analytics cookies (to understand how visitors use our site). You can disable cookies in your browser settings, though this may affect site functionality.</p>
        </PolicySection>

        <PolicySection title="8. Children's Privacy">
          <p>Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.</p>
        </PolicySection>

        <PolicySection title="9. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date. Your continued use of our services after changes constitutes acceptance of the updated policy.</p>
        </PolicySection>

        <PolicySection title="10. Contact Us">
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li>Email: info@shrilekha.com</li>
            <li>WhatsApp: +91 96237 40541</li>
            <li>Location: Pune, Maharashtra, India</li>
          </ul>
        </PolicySection>
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