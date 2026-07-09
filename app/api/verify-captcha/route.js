import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 })
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY, // Server-side private key
          response: token,
        }),
      }
    )

    const data = await response.json()

    return NextResponse.json({
      success: data.success,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}