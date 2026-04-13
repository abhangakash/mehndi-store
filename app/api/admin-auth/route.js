import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req) {
  try {
    const { password } = await req.json()
    if (!password) return NextResponse.json({ ok: false }, { status: 400 })

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    // Set secure httpOnly cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', process.env.ADMIN_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}