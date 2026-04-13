import { Suspense } from 'react'
import ProfileContent from './ProfileContent'

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--brand-surface)' }}>
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--brand-green)' }} />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}