import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact Us — Crabveda Pain Relief Oil',
  description: 'Get in touch with Crabveda. Order our natural pain relief oil, make bulk inquiries, or reach out with questions. Located in Pune, Maharashtra.',
}

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="section-title">Get in Touch</h1>
        <p className="section-subtitle">We'd love to hear from you. Reach out for orders, queries, or wholesale opportunities!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact info */}
        <div className="flex flex-col gap-5">
          <div className="card p-6">
            <h2 className="font-semibold text-base mb-5" style={{ color: 'var(--brand-text)' }}>
              Contact Information
            </h2>
            <div className="flex flex-col gap-4">
              <a href="tel:+919921297518"
                className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50"
                style={{ color: 'var(--brand-text)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#dcfce7' }}>
                  <Phone size={16} style={{ color: 'var(--brand-green)' }} />
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--brand-muted)' }}>Phone / WhatsApp</p>
                  <p className="text-sm font-semibold">+91 99212 97518</p>
                  <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>Available 9 AM – 8 PM</p>
                </div>
              </a>

              <a href="mailto:crabveda@gmail.com"
                className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50"
                style={{ color: 'var(--brand-text)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#e0f2fe' }}>
                  <Mail size={16} style={{ color: '#0369a1' }} />
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--brand-muted)' }}>Email</p>
                  <p className="text-sm font-semibold">crabveda@gmail.com</p>
                  <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>We reply within 24 hours</p>
                </div>
              </a>

              <div className="flex items-start gap-3 p-3 rounded-xl"
                style={{ color: 'var(--brand-text)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#fef3c7' }}>
                  <MapPin size={16} style={{ color: '#d97706' }} />
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--brand-muted)' }}>Location</p>
                  <p className="text-sm font-semibold">Pune, Maharashtra</p>
                  <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>Shipping and distribution across India</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl"
                style={{ color: 'var(--brand-text)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#f5f3ff' }}>
                  <Clock size={16} style={{ color: '#7c3aed' }} />
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--brand-muted)' }}>Working Hours</p>
                  <p className="text-sm font-semibold">Mon – Sun: 9:00 AM – 8:00 PM</p>
                  <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>Support available for order tracking and assistance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="card p-5">
            <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--brand-text)' }}>Follow Us</h2>
            <div className="flex gap-3">
              <a href="https://wa.me/919921297518" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}>
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a href="https://www.instagram.com/crabveda?igsh=M2VoNzRoOGhvMzFu" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
                <Instagram size={16} /> Instagram
              </a>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--brand-text)' }}>Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <a href="https://wa.me/919921297518?text=Hi! I want to order Crabveda Pain Relief Oil"
                target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border text-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--brand-border)' }}>
                <span style={{ color: 'var(--brand-text)' }}>🌿 Order Pain Relief Oil</span>
                <Send size={14} style={{ color: 'var(--brand-muted)' }} />
              </a>
              <a href="https://wa.me/919921297518?text=Hi! I have a question about Crabveda oil usage and ingredients"
                target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border text-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--brand-border)' }}>
                <span style={{ color: 'var(--brand-text)' }}>❓ Product & Usage Inquiry</span>
                <Send size={14} style={{ color: 'var(--brand-muted)' }} />
              </a>
              <a href="https://wa.me/919921297518?text=Hi! I want to inquire about bulk/wholesale orders for Crabveda oil"
                target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border text-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--brand-border)' }}>
                <span style={{ color: 'var(--brand-text)' }}>📦 Bulk / Wholesale Orders</span>
                <Send size={14} style={{ color: 'var(--brand-muted)' }} />
              </a>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

function Instagram({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}