'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Lock, KeyRound, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    const { ok } = await res.json()

    if (ok) {
      toast.success('Welcome, Admin!')
      router.push('/admin')
    } else {
      toast.error('Invalid password. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div 
      className="min-h-[100dvh] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{ backgroundColor: 'var(--brand-surface, #f4f5f7)' }}
    >
      {/* Expanded Split Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden grid md:grid-cols-12 my-auto">
        
        {/* Left Institutional Panel (Brand Identity & Trust) */}
        <div 
          className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden"
          style={{ backgroundColor: 'var(--brand-brown, #2c221e)' }}
        >
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top Brand Logo Section */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-md bg-white flex items-center justify-center shrink-0">
              <Image 
                src="/logo.jpeg" 
                alt="Crabveda Logo" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="text-lg sm:text-sm font-bold tracking-tight text-white block">
                Crabveda
              </span>
            </div>
          </div>

          {/* Middle Information */}
          <div className="my-6 md:my-0 relative z-10">
            <h2 className="text-xl sm:text-2xl font-light tracking-tight leading-snug">
              Secure Management <span className="font-semibold block text-emerald-300">Workspace</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-300 mt-2 font-light leading-relaxed">
              Authorized access only. Monitor orders, inventory, and clinical pain relief formulations under strict compliance.
            </p>
          </div>

          {/* Bottom Security Notice */}
          <div className="relative z-10 text-[10px] sm:text-[11px] text-gray-400 font-mono hidden md:block">
            Mumbai, MH
          </div>
        </div>

        {/* Right Authentication Form Panel */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="mb-5 sm:mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-100">
              <Lock size={18} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Administrative Login
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Enter your password to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-700">
                Password
              </label>
              <div className="relative group flex items-center bg-gray-50/50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/10 transition-all">
                <KeyRound size={16} className="text-gray-400 group-focus-within:text-emerald-600 mr-3 transition-colors shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-transparent focus:outline-none text-gray-900 text-sm placeholder:text-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-brown rounded-xl py-3 text-xs font-bold tracking-widest uppercase text-white shadow-md hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-1.5 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"></span>
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer Assistance */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>Crabveda Internal Systems</span>
            <span className="md:hidden font-mono">Mumbai, MH</span>
          </div>
        </div>

      </div>
    </div>
  )
}