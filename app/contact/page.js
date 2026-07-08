import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact Us — Crabveda Pain Relief Oil',
  description: 'Get in touch with Crabveda. Order our natural pain relief oil, make bulk inquiries, or reach out with questions. Located in Pune, Maharashtra.',
}

function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

export default function ContactPage() {
  return (
    <div className="bg-white text-black antialiased min-h-screen pb-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        
        {/* ===== HEADER SECTION ===== */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
            Get in Touch
          </h1>
          <p className="text-xs font-semibold text-gray-400 max-w-xl mx-auto leading-relaxed">
            We'd love to hear from you. Reach out for direct order placement, product queries, or corporate wholesale opportunities!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          
          {/* ===== LEFT: CONTACT INFO PANEL GRID ===== */}
          <div className="flex flex-col gap-4">
            
            {/* Core Info Matrix Card */}
            <div className="rounded-2xl border border-gray-100 p-5 bg-white shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 pl-1">
                Contact Information
              </h2>
              
              <div className="flex flex-col gap-1">
                
                <a href="tel:+919921297518" className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50/70 text-black">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                    <Phone size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Phone / WhatsApp</p>
                    <p className="text-xs font-black text-black tracking-tight">+91 99212 97518</p>
                    <p className="text-[10px] font-semibold text-gray-400">Available Daily 9 AM – 8 PM</p>
                  </div>
                </a>

                <a href="mailto:crabveda@gmail.com" className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50/70 text-black">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-sky-50 text-sky-600 border border-sky-100/50">
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Email Support</p>
                    <p className="text-xs font-black text-black tracking-tight">crabveda@gmail.com</p>
                    <p className="text-[10px] font-semibold text-gray-400">We reply within 24 hours</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 rounded-xl text-black">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-amber-50 border border-amber-100/50" style={{ color: '#c9a84c' }}>
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Headquarters</p>
                    <p className="text-xs font-black text-black tracking-tight">Pune, Maharashtra</p>
                    <p className="text-[10px] font-semibold text-gray-400">Express delivery processing across India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl text-black">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-600 border border-purple-100/50">
                    <Clock size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Operating Hours</p>
                    <p className="text-xs font-black text-black tracking-tight">Mon – Sun: 9:00 AM – 8:00 PM</p>
                    <p className="text-[10px] font-semibold text-gray-400">Dedicated tracking support active daily</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Social Connection Row */}
            <div className="rounded-2xl border border-gray-100 p-5 bg-white shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 pl-1">
                Follow Our Channel
              </h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <a href="https://wa.me/919921297518" target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 flex-1 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 bg-[#25D366]">
                  <MessageCircle size={14} /> WhatsApp Community
                </a>
                <a href="https://www.instagram.com/crabveda?igsh=M2VoNzRoOGhvMzFu" target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 flex-1 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
                  <InstagramIcon size={14} /> Instagram Feed
                </a>
              </div>
            </div>

            {/* Quick WhatsApp Link Triggers */}
            <div className="rounded-2xl border border-gray-100 p-5 bg-white shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 pl-1">
                Instant Actions via WhatsApp
              </h2>
              <div className="flex flex-col gap-2">
                {[
                  { text: '🌿 Order Pain Relief Oil', msg: 'Hi! I want to order Crabveda Pain Relief Oil' },
                  { text: '❓ Product & Usage Inquiry', msg: 'Hi! I have a question about Crabveda oil usage and ingredients' },
                  { text: '📦 Bulk / Wholesale Orders', msg: 'Hi! I want to inquire about bulk/wholesale orders for Crabveda oil' }
                ].map((action, idx) => (
                  <a key={idx} href={`https://wa.me/919921297518?text=${encodeURIComponent(action.msg)}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 text-xs font-semibold text-gray-400 hover:text-black hover:bg-gray-50/70 transition-colors">
                    <span className="text-black font-bold">{action.text}</span>
                    <Send size={12} className="text-gray-300" />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* ===== RIGHT: INTERACTIVE CONTACT FORM CARD ===== */}
          <div className="h-full">
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  )
}