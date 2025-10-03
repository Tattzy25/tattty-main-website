"use server"

import { neon } from "@/lib/neon"
import { revalidatePath } from "next/cache"

export async function deleteDesign(designId: string) {
  try {
    // Get current user
    const {
      data: { user },
    } = await neon.auth.getUser()

    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    // First, check if the design belongs to the user
    const { data: design, error: fetchError } = await neon
      .from("tattoo_designs")
      .select("*")
      .eq("id", designId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !design) {
      return { success: false, error: "Design not found or you don't have permission to delete it" }
    }

    // Delete the design
    const { error: deleteError } = await neon
      .from("tattoo_designs")
      .delete()
      .eq("id", designId)
      .eq("user_id", user.id)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    // Revalidate the designs page
    revalidatePath("/dashboard/designs")

    return { success: true }
  } catch (error) {
    console.error("Error deleting design:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
