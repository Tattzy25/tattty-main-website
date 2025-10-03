import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Force dynamic rendering since we use cookies
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = cookies()
    
    // Check for OAuth tokens (GitHub/Google) or OTP verification
    const githubToken = cookieStore.get("github-token")?.value
    const googleToken = cookieStore.get("google-token")?.value
    const otpVerified = cookieStore.get("otp-verified")?.value
    
    if (!githubToken && !googleToken && !otpVerified) {
      return NextResponse.json({ authenticated: false, user: null })
    }
    
    // Connect to NEON database and get user info
    const sql = neon(process.env.DATABASE_URL!)
    let result
    
    if (githubToken) {
      result = await sql`SELECT * FROM users WHERE github_token = ${githubToken}`
    } else if (googleToken) {
      result = await sql`SELECT * FROM users WHERE google_token = ${googleToken}`
    } else if (otpVerified) {
      result = await sql`SELECT * FROM users WHERE phone = ${otpVerified} OR email = ${otpVerified}`
    }
    
    if (!result || result.length === 0) {
      return NextResponse.json({ authenticated: false, user: null })
    }
    
    const user = result[0]
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error("Error in auth check route:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
