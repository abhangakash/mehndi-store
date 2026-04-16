import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact Us — Shrilekha Mehndi Art & Glowup',
  description: 'Get in touch with Shrilekha Mehndi Art. Book bridal mehndi, makeup appointments or order products. Located in Pune, Maharashtra.',
}

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="section-title">Get in Touch</h1>
        <p className="section-subtitle">We'd love to hear from you. Reach out for bookings, queries or just to say hi!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact info */}
        <div className="flex flex-col gap-5">
          <div className="card p-6">
            <h2 className="font-semibold text-base mb-5" style={{ color: 'var(--brand-text)' }}>
              Contact Information
            </h2>
            <div className="flex flex-col gap-4">
              <a href="tel:+919623740541"
                className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50"
                style={{ color: 'var(--brand-text)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#dcfce7' }}>
                  <Phone size={16} style={{ color: 'var(--brand-green)' }} />
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--brand-muted)' }}>Phone / WhatsApp</p>
                  <p className="text-sm font-semibold">+91 96237 40541</p>
                  <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>Available 9 AM – 8 PM</p>
                </div>
              </a>

              <a href="mailto:info@shrilekha.com"
                className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50"
                style={{ color: 'var(--brand-text)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#e0f2fe' }}>
                  <Mail size={16} style={{ color: '#0369a1' }} />
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--brand-muted)' }}>Email</p>
                  <p className="text-sm font-semibold">info@shrilekha.com</p>
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
                  <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>Home service available across Pune</p>
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
                  <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>Appointments preferred for studio visits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="card p-5">
            <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--brand-text)' }}>Follow Us</h2>
            <div className="flex gap-3">
              <a href="https://wa.me/919623740541" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}>
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a href="https://instagram.com/shrilekha_mehndi" target="_blank" rel="noreferrer"
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
              <a href="https://wa.me/919623740541?text=Hi! I want to book a bridal mehndi appointment"
                target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border text-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--brand-border)' }}>
                <span style={{ color: 'var(--brand-text)' }}>💍 Book Bridal Mehndi</span>
                <Send size={14} style={{ color: 'var(--brand-muted)' }} />
              </a>
              <a href="https://wa.me/919623740541?text=Hi! I want to book a makeup appointment"
                target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border text-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--brand-border)' }}>
                <span style={{ color: 'var(--brand-text)' }}>💄 Book Makeup Session</span>
                <Send size={14} style={{ color: 'var(--brand-muted)' }} />
              </a>
              <a href="https://wa.me/919623740541?text=Hi! I want to place a bulk order for mehndi products"
                target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border text-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--brand-border)' }}>
                <span style={{ color: 'var(--brand-text)' }}>📦 Bulk Product Order</span>
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