'use client'
import Link from 'next/link'
import { Phone, MapPin, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0f1a0e] text-white border-t border-gray-800 relative overflow-hidden font-sans selection:bg-[#93731e] selection:text-[#0f1a0e]">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* MAIN BODY DECK */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 relative z-10">
          
          {/* Column 1: About CrabVeda (Spans 5 Columns) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              {/* Logo Wrapper changed to rounded-full */}
              <div className="w-10 h-10 relative rounded-full overflow-hidden border border-[#93731e]/20 bg-white shadow-xl shadow-black/20">
                <Image
                  src="/logo.jpeg"
                  alt="CrabVeda logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight uppercase leading-none">
                  CRABVEDA<span className="text-[#93731e]">.</span>
                </h2>
                <span className="text-[9px] text-gray-400 tracking-widest uppercase font-black block mt-1">
                  Ayurvedic Pain Relief Oil
                </span>
              </div>
            </div>
            
            <p className="text-gray-400 font-medium text-xs leading-relaxed max-w-sm">
              Bringing you the power of classical Ayurvedic wisdom. Our specially formulated crab oil penetrates deep to relieve joint pain, reduce muscle stiffness, and restore natural flexibility.
            </p>
            
            {/* BRIGHT, BEAUTIFUL COLORED SOCIAL ICONS */}
            <div className="flex items-center gap-3 pt-1">
              {/* Instagram */}
              <a href="https://www.instagram.com/crabveda?igsh=M2VoNzRoOGhvMzFu" target="_blank" rel="noreferrer" className="hover:scale-105 active:scale-95 transition-transform duration-200">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-lg shadow-black/20">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
              </a>

              {/* Facebook */}
              <a href="https://www.facebook.com/share/1BE5Lhjuqk/" target="_blank" rel="noreferrer" className="hover:scale-105 active:scale-95 transition-transform duration-200">
                <div className="p-2 rounded-xl bg-[#1877F2] shadow-lg shadow-black/20">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/919921297518" target="_blank" rel="noreferrer" className="hover:scale-105 active:scale-95 transition-transform duration-200">
                <div className="p-2 rounded-xl bg-[#25D366] shadow-lg shadow-black/20 flex items-center justify-center">
                  <Image 
                    src="/whatsapp.svg" 
                    alt="WhatsApp" 
                    width={16} 
                    height={16} 
                  />
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: Easy Links (Spans 4 Columns) */}
          <div className="md:col-span-4 md:pl-4 space-y-4">
            <span className="text-xs font-black tracking-widest text-[#93731e] uppercase block">Quick Links</span>
            
            <nav className="grid grid-cols-1 gap-2">
              {[
                { label: 'Home Page', href: '/' },
                { label: 'Shop Pain Relief Oils', href: '/products' },
                { label: 'Track Your Order', href: '/track-order' }
              ].map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#93731e]/20 hover:bg-white/[0.04] transition-all duration-200"
                >
                  <span className="text-xs font-black uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                  <ArrowRight size={12} className="text-gray-400 group-hover:text-[#93731e] group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Details (Spans 3 Columns) */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-xs font-black tracking-widest text-[#93731e] uppercase block">Contact Us</span>
            
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <MapPin size={12} className="text-[#93731e]" />
                  <span>Our Address</span>
                </div>
                <p className="text-xs font-bold text-white pl-5">Solapur, Maharashtra 413203</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Phone size={12} className="text-[#93731e]" />
                  <span>Call / WhatsApp</span>
                </div>
                <a href="tel:+919921297518" className="text-xs font-black text-[#93731e] hover:text-white transition-colors pl-5 block tracking-wide">
                  +91 9921297518
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM SUB-FOOTER BAR */}
        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          
          <div className="flex items-center gap-3 order-2 md:order-1">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">
              © {currentYear} CRABVEDA AYURVEDA. ALL RIGHTS RESERVED.
            </p>
          </div>
          
          {/* Policy Pages */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 order-1 md:order-2 w-full md:w-auto border-b border-white/5 md:border-none pb-4 md:pb-0 justify-center">
            {[
              { text: 'Privacy Policy', href: '/privacy-policy' },
              { text: 'Terms of Service', href: '/terms-of-service' },
              { text: 'Shipping Policy', href: '/shipping-policy' }
            ].map(legal => (
              <Link 
                key={legal.text} 
                href={legal.href} 
                className="text-[9px] text-gray-400 hover:text-[#93731e] uppercase tracking-widest font-black transition-colors"
              >
                {legal.text}
              </Link>
            ))}
          </div>

        </div>

      </div>
    </footer>
  )
}