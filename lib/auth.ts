import { cookies } from "next/headers"
import { cache } from "react"
import { neon } from "@/lib/neon"

export const createClient = cache(() => {
  return neon
})

export async function getSession() {
  try {
    const { data: { session } } = await neon.auth.getSession()
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function getUserDetails() {
  const session = await getSession()
  if (!session) {
    return null
  }

  return null
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error("Authentication required")
  }
  return session
}
