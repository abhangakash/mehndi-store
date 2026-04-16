'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgotMode, setForgotMode] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill all fields')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) toast.error(error.message)
    else { toast.success('Welcome back!'); router.push('/') }
    setLoading(false)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Enter your email address')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) toast.error(error.message)
    else toast.success('Password reset link sent to your email!')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: 'var(--brand-surface)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 relative">
            <Image
              src="/art2.png"
              alt="Shrilekha Mehndi Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--brand-green)' }}>
            {forgotMode ? 'Reset Password' : 'Welcome back'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>
            {forgotMode ? 'Enter your email to receive a reset link' : 'Sign in to your Shrilekha account'}
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={forgotMode ? handleForgotPassword : handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-text)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--brand-muted)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>

            {!forgotMode && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>Password</label>
                  <button type="button" onClick={() => setForgotMode(true)}
                    className="text-xs underline" style={{ color: 'var(--brand-green)' }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--brand-muted)' }} />
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--brand-muted)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-1">
              {loading ? 'Please wait...' : forgotMode ? 'Send Reset Link' : <> Sign In <ArrowRight size={16} /> </>}
            </button>

            {forgotMode && (
              <button type="button" onClick={() => setForgotMode(false)}
                className="text-sm text-center underline" style={{ color: 'var(--brand-muted)' }}>
                Back to login
              </button>
            )}
          </form>

          {!forgotMode && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--brand-border)' }} />
                <span className="text-xs" style={{ color: 'var(--brand-muted)' }}>or</span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--brand-border)' }} />
              </div>

              <Link href="/track-order"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium border hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-muted)' }}>
                <Package size={15} /> Track order without login
              </Link>

              <p className="text-center text-sm mt-4" style={{ color: 'var(--brand-muted)' }}>
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium" style={{ color: 'var(--brand-green)' }}>
                  Sign up free
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}