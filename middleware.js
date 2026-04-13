import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /profile — redirect to login if not authenticated
  if (pathname.startsWith('/profile') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protect /admin — check admin password cookie
  if (pathname.startsWith('/admin')) {
    const adminAuth = request.cookies.get('admin_auth')?.value
    if (adminAuth !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*'],
}