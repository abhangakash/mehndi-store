import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Protect /admin — check admin cookie
  if (pathname.startsWith('/admin')) {
    const adminAuth = request.cookies.get('admin_auth')?.value
    if (adminAuth !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
  }

  // NOTE: /profile protection is handled client-side in ProfileContent.jsx
  // (redirects to /login if no user). We don't use middleware for Supabase
  // auth here because reading the session in middleware requires @supabase/ssr
  // cookie handling which can conflict with the client auth state.

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}