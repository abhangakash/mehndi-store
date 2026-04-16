// import Link from 'next/link'
// import { Leaf, Phone, Mail, ExternalLink, MapPin } from 'lucide-react'

// export default function Footer() {
//   return (
//     <footer className="mt-16 border-t" style={{ backgroundColor: 'var(--brand-green)', borderColor: 'var(--brand-green)' }}>
//       <div className="max-w-6xl mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div className="md:col-span-1">
//             <div className="flex items-center gap-2 mb-3">
//               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
//                 <Leaf size={16} color="white" />
//               </div>
//               <div className="font-semibold text-white text-sm">Shrilekha Mehndi Art</div>
//             </div>
//             <p className="text-sm text-white/70 leading-relaxed">
//               Where every design tells a story. Premium quality henna products crafted with love from Pune, Maharashtra.
//             </p>
//           </div>
//           <div>
//             <h4 className="text-white font-medium text-sm mb-3">Quick Links</h4>
//             <div className="flex flex-col gap-2">
//               {[{ href: '/', label: 'Home' },{ href: '/products', label: 'Shop' },{ href: '/blog', label: 'Tips & Blog' },{ href: '/track-order', label: 'Track Order' }].map(l => (
//                 <Link key={l.href} href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">{l.label}</Link>
//               ))}
//             </div>
//           </div>
//           <div>
//             <h4 className="text-white font-medium text-sm mb-3">Policies</h4>
//             <div className="flex flex-col gap-2">
//               {['Return & Refund Policy','Shipping Policy','Privacy Policy','Terms of Service'].map(l => (
//                 <span key={l} className="text-sm text-white/70 cursor-pointer hover:text-white transition-colors">{l}</span>
//               ))}
//             </div>
//           </div>
//           <div>
//             <h4 className="text-white font-medium text-sm mb-3">Contact Us</h4>
//             <div className="flex flex-col gap-2.5">
//               <a href="tel:+919623740541" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
//                 <Phone size={14} /> +91 96237 40541
//               </a>
//               <a href="mailto:info@shrilekha.com" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
//                 <Mail size={14} /> info@shrilekha.com
//               </a>
//               <a href="https://instagram.com/shrilekha_mehndi" target="_blank" rel="noreferrer"
//                 className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
//                 <ExternalLink size={14} /> @shrilekha_mehndi
//               </a>
//               <div className="flex items-center gap-2 text-sm text-white/70">
//                 <MapPin size={14} /> Pune, Maharashtra
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="mt-10 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-2">
//           <p className="text-xs text-white/50">© 2024 Shrilekha Mehndi Art. All rights reserved.</p>
//           <div className="flex items-center gap-1 text-xs text-white/50">
//             <span>Free shipping above ₹499</span><span className="mx-2">·</span><span>COD on orders above ₹999</span>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

import Link from 'next/link'
import { Leaf, Phone, Mail, MapPin, ChevronRight } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-20 relative overflow-hidden" style={{ backgroundColor: '#1a2e23' }}>
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-15 15-30 30-30s-30 15-30 30z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Identity Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100/10 flex items-center justify-center border border-amber-200/20">
                <Leaf size={20} className="text-amber-200" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Shrilekha Mehndi Art</span>
            </div>
            <p className="text-gray-400 max-w-sm text-base leading-relaxed">
              Elevating the ancient art of Henna for the modern world. Our organic products are handcrafted in small batches to ensure the deepest stains.
            </p>
            
            {/* COLORFUL SOCIAL ICONS (Always Visible) */}
            <div className="flex items-center gap-4 pt-2">
              {/* Instagram */}
              <a href="https://instagram.com/shrilekha_mehndi" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform duration-300">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-lg shadow-black/20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
              </a>

              {/* Facebook */}
              <a href="https://facebook.com/shrilekhamehndi" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform duration-300">
                <div className="p-2.5 rounded-xl bg-[#1877F2] shadow-lg shadow-black/20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/919623740541" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform duration-300">
                <div className="p-2.5 rounded-xl bg-[#25D366] shadow-lg shadow-black/20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg>
                </div>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-amber-200 font-semibold text-xs uppercase tracking-[0.2em] mb-6">Experience</h4>
              <ul className="space-y-4">
                {[{h:'/',l:'Home'},{h:'/products',l:'Shop All'},{h:'/blog',l:'Henna Artistry'}].map(link => (
                  <li key={link.l}>
                    <Link href={link.h} className="text-gray-400 hover:text-white flex items-center group text-sm transition-colors">
                      <ChevronRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-amber-200 font-semibold text-xs uppercase tracking-[0.2em] mb-6">Assistance</h4>
              <ul className="space-y-4">
                {[{h:'/track-order',l:'Track Order'},{h:'/shipping-policy',l:'Shipping'},{h:'/return-policy',l:'Returns'}].map(link => (
                  <li key={link.l}>
                    <Link href={link.h} className="text-gray-400 hover:text-white text-sm transition-colors">{link.l}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-amber-200 font-semibold text-xs uppercase tracking-[0.2em] mb-6">Visit Us</h4>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-amber-200 mt-0.5 shrink-0" />
                  <span>Pune, Maharashtra 411038</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-amber-200 shrink-0" />
                  <a href="tel:+919623740541" className="hover:text-white transition-colors">+91 96237 40541</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Bottom Branding */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-8">
          
          {/* Policy Links - Now visible on mobile */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <Link href="/privacy-policy" className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-medium">Privacy Policy</Link>
              <Link href="/terms" className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-medium">Terms of Service</Link>
              <Link href="/shipping-policy" className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-medium">Shipping Policy</Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between w-full items-center gap-6">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">© {currentYear} Shrilekha Mehndi Art</p>
            
            <div className="flex items-center gap-3">
              <span className="text-[9px] md:text-[10px] py-1.5 px-3 rounded-full bg-white/5 border border-white/10 text-amber-100/60 uppercase tracking-tighter">
                🌿 Free Shipping Above ₹499
              </span>
              <span className="text-[9px] md:text-[10px] py-1.5 px-3 rounded-full bg-white/5 border border-white/10 text-amber-100/60 uppercase tracking-tighter">
                📦 COD Above ₹999
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}