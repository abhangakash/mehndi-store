'use client'
import { useState } from 'react'
import { Send, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const INQUIRY_TYPES = [
  'Bridal Mehndi Booking',
  'Bridal Makeup Booking',
  'Mehndi + Makeup Combo',
  'Product Order Query',
  'Bulk Order Inquiry',
  'Other',
]

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill name, phone and message')
      return
    }
    setLoading(true)
    // Build WhatsApp message as fallback (no backend needed)
    const msg = `*New Inquiry from Website*\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email || 'Not provided'}\nType: ${form.type || 'General'}\n\nMessage:\n${form.message}`
    const waUrl = `https://wa.me/919623740541?text=${encodeURIComponent(msg)}`
    setTimeout(() => {
      setLoading(false)
      setSent(true)
      toast.success('Message ready! Redirecting to WhatsApp...')
      setTimeout(() => window.open(waUrl, '_blank'), 800)
    }, 600)
  }

  if (sent) {
    return (
      <div className="card p-10 text-center h-full flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#dcfce7' }}>
          <CheckCircle size={32} style={{ color: '#15803d' }} />
        </div>
        <h3 className="font-semibold text-lg" style={{ color: 'var(--brand-text)' }}>Message Sent!</h3>
        <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--brand-muted)' }}>
          Your inquiry is being sent to WhatsApp. We'll get back to you within a few hours.
        </p>
        <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', type: '', message: '' }) }}
          className="btn-secondary text-sm mt-2">
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-base mb-1" style={{ color: 'var(--brand-text)' }}>Send us a Message</h2>
      <p className="text-xs mb-5" style={{ color: 'var(--brand-muted)' }}>
        Fill the form below and we'll get back to you via WhatsApp
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>
              Full Name *
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--brand-muted)' }} />
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Priya Sharma" style={{ paddingLeft: '2.25rem' }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>
              Phone *
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--brand-muted)' }} />
              <input type="tel" value={form.phone}
                onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210" maxLength={10} style={{ paddingLeft: '2.25rem' }} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>
            Email (optional)
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--brand-muted)' }} />
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="you@example.com" style={{ paddingLeft: '2.25rem' }} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>
            Inquiry Type
          </label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="">Select inquiry type...</option>
            {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>
            Message *
          </label>
          <div className="relative">
            <MessageSquare size={15} className="absolute left-3 top-3"
              style={{ color: 'var(--brand-muted)' }} />
            <textarea value={form.message} onChange={e => set('message', e.target.value)}
              placeholder="Tell us about your requirements — event date, location, number of people, etc."
              rows={4} style={{ paddingLeft: '2.25rem' }} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? 'Sending...' : <><Send size={16} /> Send Message</>}
        </button>

        <p className="text-xs text-center" style={{ color: 'var(--brand-muted)' }}>
          Your message will be sent directly to our WhatsApp for fastest response
        </p>
      </form>
    </div>
  )
}