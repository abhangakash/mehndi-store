'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [validSession, setValidSession] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [done, setDone] = useState(false)
  const [touched, setTouched] = useState({})

  // Supabase's client automatically parses the recovery token from the URL
  // (detectSessionInUrl is on by default) and fires a PASSWORD_RECOVERY event.
  // We listen for that — if it never fires and there's no session, the link
  // was invalid/expired.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValidSession(true)
        setCheckingSession(false)
      }
    })

    // Fallback: if a session already exists by the time this mounts
    // (event can fire before the listener attaches in some cases)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setValidSession(true)
      setCheckingSession(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }))

  const errors = useMemo(() => {
    const e = {}
    if (touched.password && password && password.length < 6) e.password = 'At least 6 characters'
    if (touched.confirmPassword && confirmPassword && confirmPassword !== password) e.confirmPassword = 'Passwords do not match'
    return e
  }, [touched, password, confirmPassword])

  const handleReset = async (e) => {
    e.preventDefault()
    setTouched({ password: true, confirmPassword: true })

    if (!password || password.length < 6) return toast.error('Password must be at least 6 characters')
    if (password !== confirmPassword) return toast.error('Passwords do not match')

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast.error(error.message)
    } else {
      setDone(true)
      toast.success('Password updated!')
      setTimeout(() => router.push('/login'), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#FAF8F5] text-[#0f1a14] font-sans antialiased flex flex-col justify-between pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <style>{`
        .font-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }
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
          border-color: #93731e;
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
          font-size: 16px;
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

      <div
        className="flex-1 flex flex-col justify-center w-full max-w-sm mx-auto px-5"
        style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}
      >
        {checkingSession ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-2 border-stone-200 border-t-[#93731e] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400 font-medium">Verifying reset link...</p>
          </div>
        ) : !validSession ? (
          <div className="text-center py-10">
            <p className="font-display text-xl font-medium mb-2">Link expired or invalid</p>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              This password reset link is no longer valid. Reset links expire after a short time — please request a new one.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-[#0f1a14] hover:bg-[#1a2d23] text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
            >
              Back to Sign In
            </button>
          </div>
        ) : done ? (
          <div className="text-center py-10">
            <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-600" />
            <p className="font-display text-xl font-medium mb-2">Password updated!</p>
            <p className="text-sm text-stone-500">Redirecting you to sign in...</p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#93731e] mb-1">
                Almost done
              </p>
              <h1 className="font-display text-xl sm:text-2xl leading-snug font-medium tracking-tight text-[#0f1a14]">
                Set a new password
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
                Choose a new password for your Crabveda account.
              </p>
            </div>

            <form onSubmit={handleReset} noValidate className="space-y-3">
              <div>
                <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 pl-0.5">
                  New Password
                </label>
                <div className="field-group" data-invalid={!!errors.password}>
                  <span className="field-icon"><Lock size={16} /></span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => markTouched('password')}
                    placeholder="Minimum 6 characters"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 pl-0.5">
                  Confirm Password
                </label>
                <div className="field-group" data-invalid={!!errors.confirmPassword}>
                  <span className="field-icon"><Lock size={16} /></span>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => markTouched('confirmPassword')}
                    placeholder="Re-enter new password"
                    aria-invalid={!!errors.confirmPassword}
                    className="field-input"
                  />
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1 pl-0.5">{errors.confirmPassword}</p>}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0f1a14] hover:bg-[#1a2d23] active:bg-[#1a2d23] text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                >
                  {loading ? 'Updating...' : 'Update password'}
                  {!loading && <ArrowRight size={14} />}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <div className="w-full flex items-center justify-center gap-1.5 text-stone-400 text-[10px] font-bold uppercase tracking-widest pt-8">
        <ShieldCheck size={12} className="text-[#93731e]" />
        <span>Secure Reset</span>
      </div>
    </div>
  )
}