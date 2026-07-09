'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Package, ShieldCheck, Truck, Shield, Award } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Fonts: pair a characterful serif for the display headline with a clean
 * grotesk for body/UI. Add this to your root layout (or _document) once:
 *
 * <link rel="preconnect" href="https://fonts.googleapis.com" />
 * <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
 */

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgotMode, setForgotMode] = useState(false)
  const [touched, setTouched] = useState({})

  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }))

  const errors = useMemo(() => {
    const e = {}
    if (touched.email && email && !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (touched.password && !forgotMode && password && password.length < 6) e.password = 'At least 6 characters'
    return e
  }, [touched, email, password, forgotMode])

  const handleLogin = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!email || !password) return toast.error('Please fill all fields')
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error('Please enter a valid email address')

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Welcome back!')
      router.push('/')
    }
    setLoading(false)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setTouched({ email: true })
    if (!email) return toast.error('Enter your email address')
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error('Please enter a valid email address')

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Reset link sent! Check your email.')
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    /* Force layout to take full viewport dynamic height and blend background perfectly */
    <div className="min-h-[100dvh] w-full bg-[#FAF8F5] text-[#0f1a14] font-sans antialiased flex flex-col justify-between pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <style>{`
        .font-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }

        /* Icon + input as flex siblings — separate boxes that cannot overlap */
        .field-group {
          display: flex;
          align-items: stretch;
          height: 3.25rem;
          background: #fff;
          border: 1.5px solid #e7e2d6;
          border-radius: 0.5rem;
          overflow: hidden;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .field-group:focus-within {
          border-color: #c9a84c;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.14);
        }
        .field-group[data-invalid="true"] { border-color: #f87171; }
        .field-icon {
          flex: 0 0 auto;
          width: 2.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a8a29e;
        }
        .field-input {
          flex: 1 1 auto;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          padding: 0 0.85rem 0 0;
          font-size: 16px; /* Retained intentionally to safeguard iOS zoom states */
          color: #0f1a14;
        }
        .field-toggle {
          flex: 0 0 auto;
          width: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a8a29e;
          background: transparent;
          border: none;
        }
      `}</style>

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col justify-center w-full max-w-sm mx-auto px-5"
        style={{
          paddingTop: 'max(2.5rem, env(safe-area-inset-top))',
        }}
      >
        {/* Header Block with balanced typography scales */}
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#c9a84c] mb-1">
            Welcome back
          </p>
          <h1 className="font-display text-xl sm:text-2xl leading-snug font-medium tracking-tight text-[#0f1a14]">
            {forgotMode ? 'Reset password' : 'Sign In'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
            {forgotMode
              ? "Enter your email and we'll send you a secure link to reset your credentials."
              : 'Access your secure profile, saved addresses, and active orders.'}
          </p>
        </div>

        {/* Action Form */}
        <form id="login-form" onSubmit={forgotMode ? handleForgotPassword : handleLogin} noValidate className="space-y-3">

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 pl-0.5">
              Email Address
            </label>
            <div className="field-group" data-invalid={!!errors.email}>
              <span className="field-icon"><Mail size={16} /></span>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched('email')}
                placeholder="name@example.com"
                aria-invalid={!!errors.email}
                className="field-input"
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-500 mt-1 pl-0.5">{errors.email}</p>}
          </div>

          {/* Password */}
          {!forgotMode && (
            <div>
              <div className="flex items-center justify-between mb-1 pl-0.5">
                <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="text-[11px] font-bold text-[#c9a84c] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="field-group" data-invalid={!!errors.password}>
                <span className="field-icon"><Lock size={16} /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => markTouched('password')}
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  className="field-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="field-toggle"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 mt-1 pl-0.5">{errors.password}</p>}
            </div>
          )}

          {/* Back Action Hook when Reset Workflow is Enabled */}
          {forgotMode && (
            <div>
              <button
                type="button"
                onClick={() => setForgotMode(false)}
                className="text-[11px] font-bold text-stone-400 hover:text-[#0f1a14] py-1 transition-colors"
              >
                ← Back to standard sign in
              </button>
            </div>
          )}

          {/* Core Action Submit Trigger Box */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f1a14] hover:bg-[#1a2d23] active:bg-[#1a2d23] text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Verifying…' : forgotMode ? 'Send reset link' : 'Sign In'}
              {!loading && <ArrowRight size={14} />}
            </button>
          </div>
        </form>

        {/* Secondary Navigation Flows */}
        {!forgotMode && (
          <div className="space-y-3 mt-3">

            <div className="flex items-center gap-3 py-0.5">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">or</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Google OAuth Button with Clean Flat SVG Pathing */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 transition-all font-bold text-xs uppercase tracking-wider text-stone-600 active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v8.87h12.62c-.54 2.9-2.18 5.37-4.63 7.01l7.19 5.57c4.21-3.88 6.64-9.59 6.64-16.17z" />
                <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z" />
                <path fill="#34A853" d="M24 38.5c-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48c6.48 0 11.93-2.13 15.89-5.81l-7.19-5.57c-2.11 1.42-4.81 2.38-7.7 2.38z" />
              </svg>
              Continue with Google
            </button>

            {/* Quick Link Order Tracking Integration Field */}
            <Link
              href="/track-order"
              className="flex items-center justify-between w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-[11px] font-bold uppercase tracking-wider text-stone-600 hover:border-stone-300 transition-all active:scale-[0.99]"
            >
              <span className="flex items-center gap-2">
                <Package size={14} className="text-[#c9a84c]" />
                Track order instantly
              </span>
              <ArrowRight size={12} className="text-stone-400" />
            </Link>

            {/* Registration Workflow Redirect */}
            <p className="text-center text-xs sm:text-sm text-stone-500 pt-1">
              New to Crabveda?{' '}
              <Link
                href="/signup"
                className="font-bold underline underline-offset-4 ml-1 text-[#0f1a14] decoration-[#c9a84c]"
              >
                Create Account
              </Link>
            </p>
          </div>
        )}

        {/* Brand Perks Feature Grid — Active on BOTH Mobile and PC with optimized sizes */}
        {!forgotMode && (
          <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-stone-200/60">
            <div className="text-center">
              <div className="flex justify-center text-[#c9a84c] mb-1"><Truck size={14} /></div>
              <p className="text-[9px] sm:text-[10px] font-semibold text-stone-600 leading-tight">Free Shipping</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center text-[#c9a84c] mb-1"><Shield size={14} /></div>
              <p className="text-[9px] sm:text-[10px] font-semibold text-stone-600 leading-tight">Secure Checkout</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center text-[#c9a84c] mb-1"><Award size={14} /></div>
              <p className="text-[9px] sm:text-[10px] font-semibold text-stone-600 leading-tight">100% Pure</p>
            </div>
          </div>
        )}
      </div>

      {/* Trust & Verification Footer — Always dynamically anchored at the extreme bottom */}
      <div className="w-full flex items-center justify-center gap-1.5 text-stone-400 text-[10px] font-bold uppercase tracking-widest pt-8">
        <ShieldCheck size={12} className="text-[#c9a84c]" />
        <span>Secure Sign In</span>
      </div>
    </div>
  )
}