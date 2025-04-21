import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error checking auth status:", error)
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null,
    })
  } catch (error) {
    console.error("Error in auth check route:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
