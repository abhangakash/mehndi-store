'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Leaf, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'

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
      toast.error('Wrong password')
    }

    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--brand-surface)' }}
    >
      {/* Decorative Technical Geometry */}
      <div className="absolute top-10 left-10 text-[10px] font-mono opacity-25 tracking-widest hidden md:block">
        CRABVEDA // CORE_SYS_v2.0
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-12 bg-white/40 border border-gray-200/50 rounded-[32px] p-4 gap-4 backdrop-blur-xl shadow-2xl">
        
        {/* Left Accent Panel: Brand Positioning */}
        <div 
          className="md:col-span-5 rounded-[24px] p-8 flex flex-col justify-between text-white relative overflow-hidden min-h-[220px] md:min-h-[380px]"
          style={{ backgroundColor: 'var(--brand-brown)' }}
        >
          {/* Noise overlay simulation */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="flex justify-between items-center z-10">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
              <Leaf size={16} className="text-emerald-300" />
            </div>
            <div className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-widest animate-pulse">
              System Active
            </div>
          </div>

          <div className="z-10 mt-auto">
            <p className="text-[10px] tracking-widest uppercase font-bold opacity-60 mb-1">Authenticated Entry</p>
            <h2 className="text-2xl font-light tracking-tight">
              Crabveda <span className="font-semibold block text-emerald-300">Workspace</span>
            </h2>
          </div>
        </div>

        {/* Right Form Panel: Action Area */}
        <div className="md:col-span-7 flex flex-col justify-center px-6 py-8 md:py-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Authorization Required
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Please declare your secure cryptographic passphrase below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group flex items-center border-b-2 border-gray-200 focus-within:border-emerald-600 transition-colors duration-300 py-2">
                <KeyRound size={16} className="text-gray-400 group-focus-within:text-emerald-600 mr-3 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Passphrase string"
                  autoComplete="current-password"
                  className="w-full bg-transparent focus:outline-none text-gray-800 text-sm tracking-widest placeholder:text-gray-300 font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <Shield size={12} className="text-emerald-600" />
                <span>Encrypted handshake session</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-brown rounded-xl px-6 py-3 text-xs font-bold tracking-widest uppercase text-white shadow-lg shadow-black/5 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce"></span>
                  </span>
                ) : (
                  'Grant Access'
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}