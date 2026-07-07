import Link from 'next/link'
import { Phone, MapPin, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0f0d] text-white border-t-4 border-[#c9a84c] relative overflow-hidden font-sans selection:bg-[#c9a84c] selection:text-[#0a0f0d]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* MAIN BODY DECK */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 relative z-10">
          
          {/* Column 1: About CrabVeda (Spans 5 Columns) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative rounded-full overflow-hidden border border-[#c9a84c]/30 bg-white">
                <Image
                  src="/logo.jpeg"
                  alt="CrabVeda logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight uppercase leading-none">
                  CRABVEDA<span className="text-[#c9a84c]">.</span>
                </h2>
                <span className="text-[9px] text-gray-500 tracking-widest uppercase font-bold">Ayurvedic Pain Relief Oil</span>
              </div>
            </div>
            
            <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-sm">
              Bringing you the power of classical Ayurvedic wisdom. Our specially formulated crab oil penetrates deep to relieve joint pain, reduce muscle stiffness, and restore natural flexibility.
            </p>
            
            {/* BRIGHT, BEAUTIFUL COLORED SOCIAL ICONS */}
            <div className="flex items-center gap-4 pt-2">
              {/* Instagram */}
              <a href="https://www.instagram.com/crabveda?igsh=M2VoNzRoOGhvMzFu" target="_blank" rel="noreferrer" className="hover:scale-110 active:scale-95 transition-transform duration-200">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-md shadow-black/30">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
              </a>

              {/* Facebook */}
              <a href="https://www.facebook.com/share/1BE5Lhjuqk/" target="_blank" rel="noreferrer" className="hover:scale-110 active:scale-95 transition-transform duration-200">
                <div className="p-2.5 rounded-xl bg-[#1877F2] shadow-md shadow-black/30">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/919921297518" target="_blank" rel="noreferrer" className="hover:scale-110 active:scale-95 transition-transform duration-200">
                <div className="p-2.5 rounded-xl bg-[#25D366] shadow-md shadow-black/30">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg>
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: Easy Links (Spans 4 Columns) */}
          <div className="md:col-span-4 md:pl-4 space-y-4">
            <span className="text-xs font-black tracking-widest text-[#c9a84c] uppercase block">Quick Links</span>
            
            <nav className="grid grid-cols-1 gap-2.5">
              {[
                { label: 'Home Page', href: '/' },
                { label: 'Shop Pain Relief Oils', href: '/products' },
                { label: 'Track Your Order', href: '/track-order' }
              ].map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#c9a84c]/30 hover:bg-white/[0.04] transition-all"
                >
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                  <ArrowRight size={14} className="text-gray-500 group-hover:text-[#c9a84c] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Details (Spans 3 Columns) */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-xs font-black tracking-widest text-[#c9a84c] uppercase block">Contact Us</span>
            
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                  <MapPin size={12} className="text-[#c9a84c]" />
                  <span>Our Address</span>
                </div>
                <p className="text-sm font-bold text-white pl-5">Solapur, Maharashtra 413203</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                  <Phone size={12} className="text-[#c9a84c]" />
                  <span>Call / WhatsApp</span>
                </div>
                <a href="tel:+919921297518" className="text-sm font-black text-[#c9a84c] hover:text-white transition-colors pl-5 block">
                  +91 9921297518
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM SUB-FOOTER BAR */}
        <div className="py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          
          <div className="flex items-center gap-3 order-2 md:order-1">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
              © {currentYear} CRABVEDA AYURVEDA. ALL RIGHTS RESERVED.
            </p>
          </div>
          
          {/* Policy Pages */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 order-1 md:order-2 w-full md:w-auto border-b border-white/5 md:border-none pb-4 md:pb-0 justify-center">
            {[
              { text: 'Privacy Policy', href: '/privacy-policy' },
              { text: 'Terms of Service', href: '/terms-of-service' },
              { text: 'Shipping Policy', href: '/shipping-policy' }
            ].map(legal => (
              <Link 
                key={legal.text} 
                href={legal.href} 
                className="text-[10px] text-gray-400 hover:text-[#c9a84c] uppercase tracking-widest font-black transition-colors"
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