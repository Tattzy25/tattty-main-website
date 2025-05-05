import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { cache } from "react"
import { redirect } from "next/navigation"
import type { Database } from "@/types/supabase"

// Create a single supabase client for server components
export const createClient = cache(() => {
  const cookieStore = cookies()
  return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
})

// Get the current session
export async function getSession() {
  const supabase = createClient()
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error("Auth error:", error)
      return null
    }
    return data.session
  } catch (error) {
    console.error("Session error:", error)
    return null
  }
}

// Get user details with profile information
export async function getUserDetails() {
  const supabase = createClient()
  const session = await getSession()

  if (!session?.user) {
    return null
  }

  try {
    const { data, error } = await supabase.from("user_profiles").select("*").eq("id", session.user.id).single()

    if (error) {
      console.error("Profile error:", error)
      return {
        ...session.user,
        profile: null,
      }
    }

    return {
      ...session.user,
      profile: data,
    }
  } catch (error) {
    console.error("User details error:", error)
    return {
      ...session.user,
      profile: null,
    }
  }
}

// Require authentication for protected routes
export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?next=" + encodeURIComponent(window.location.pathname))
  }

  return session
}
