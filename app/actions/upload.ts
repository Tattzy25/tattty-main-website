"use server"

import { revalidatePath } from "next/cache"
import { put, del } from "@vercel/blob"
import { supabase } from "@/lib/supabase"
import { getSession } from "@/lib/auth"

// Type definitions
type UploadResult = {
  url: string
  path: string
  success: boolean
  error?: string
}

/**
 * Upload a tattoo design image to Vercel Blob and save to database
 */
export async function uploadTattooDesign(formData: FormData): Promise<UploadResult> {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return { url: "", path: "", success: false, error: "Unauthorized" }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const style = formData.get("style") as string
    const prompt = formData.get("prompt") as string
    const isPublic = formData.get("isPublic") === "true"
    const isAiGenerated = formData.get("isAiGenerated") === "true"
    const file = formData.get("image") as File

    if (!file) {
      return { url: "", path: "", success: false, error: "No image provided" }
    }

    // Generate a unique filename
    const fileName = `${session.user.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "-")}`
    const path = `tattoo-designs/${fileName}`

    // Upload to Vercel Blob
    const blob = await put(path, file, { access: "public" })

    // Save to database
    const { data, error } = await supabase
      .from("tattoo_designs")
      .insert({
        user_id: session.user.id,
        title: title || "Untitled Design",
        description,
        style,
        prompt,
        image_url: blob.url,
        image_path: path,
        is_public: isPublic,
        is_ai_generated: isAiGenerated,
      })
      .select()
      .single()

    if (error) {
      // Delete the blob if database insert fails
      await del(path)
      console.error("Database error:", error)
      return { url: "", path: "", success: false, error: error.message }
    }

    revalidatePath("/dashboard/designs")
    return { url: blob.url, path, success: true }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      url: "",
      path: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Delete a tattoo design from Vercel Blob and database
 */
export async function deleteTattooDesign(designId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    // Get the design to check ownership and get the image path
    const { data: design, error: fetchError } = await supabase
      .from("tattoo_designs")
      .select("*")
      .eq("id", designId)
      .eq("user_id", session.user.id)
      .single()

    if (fetchError || !design) {
      return { success: false, error: "Design not found or access denied" }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("tattoo_designs")
      .delete()
      .eq("id", designId)
      .eq("user_id", session.user.id)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    // Delete from Vercel Blob if path exists
    if (design.image_path) {
      await del(design.image_path)
    }

    revalidatePath("/dashboard/designs")
    return { success: true }
  } catch (error) {
    console.error("Delete error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Alias for backward compatibility
export const deleteDesign = deleteTattooDesign

/**
 * Upload an artist portfolio image
 */
export async function uploadPortfolioImage(formData: FormData): Promise<UploadResult> {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return { url: "", path: "", success: false, error: "Unauthorized" }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const style = formData.get("style") as string
    const tags = formData.get("tags") as string
    const file = formData.get("image") as File

    if (!file) {
      return { url: "", path: "", success: false, error: "No image provided" }
    }

    // Get artist profile
    const { data: artistProfile, error: profileError } = await supabase
      .from("artist_profiles")
      .select("id")
      .eq("id", session.user.id)
      .single()

    if (profileError || !artistProfile) {
      return { url: "", path: "", success: false, error: "Artist profile not found" }
    }

    // Generate a unique filename
    const fileName = `${session.user.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "-")}`
    const path = `artist-portfolios/${fileName}`

    // Upload to Vercel Blob
    const blob = await put(path, file, { access: "public" })

    // Parse tags
    const parsedTags = tags ? tags.split(",").map((tag) => tag.trim()) : []

    // Save to database
    const { data, error } = await supabase
      .from("artist_portfolios")
      .insert({
        artist_id: artistProfile.id,
        title: title || "Untitled Work",
        description,
        style,
        tags: parsedTags,
        image_url: blob.url,
        image_path: path,
      })
      .select()
      .single()

    if (error) {
      // Delete the blob if database insert fails
      await del(path)
      console.error("Database error:", error)
      return { url: "", path: "", success: false, error: error.message }
    }

    revalidatePath("/artist-dashboard/portfolio")
    return { url: blob.url, path, success: true }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      url: "",
      path: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Update user profile avatar
 */
export async function updateProfileAvatar(formData: FormData): Promise<UploadResult> {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return { url: "", path: "", success: false, error: "Unauthorized" }
    }

    const file = formData.get("avatar") as File
    if (!file) {
      return { url: "", path: "", success: false, error: "No image provided" }
    }

    // Get current profile to check if we need to delete old avatar
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("avatar_path")
      .eq("id", session.user.id)
      .single()

    // Generate a unique filename
    const fileName = `${session.user.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "-")}`
    const path = `avatars/${fileName}`

    // Upload to Vercel Blob
    const blob = await put(path, file, { access: "public" })

    // Update database
    const { error } = await supabase
      .from("user_profiles")
      .update({
        avatar_url: blob.url,
        avatar_path: path,
      })
      .eq("id", session.user.id)

    if (error) {
      // Delete the blob if database update fails
      await del(path)
      console.error("Database error:", error)
      return { url: "", path: "", success: false, error: error.message }
    }

    // Delete old avatar if it exists
    if (profile?.avatar_path) {
      try {
        await del(profile.avatar_path)
      } catch (error) {
        console.error("Error deleting old avatar:", error)
      }
    }

    revalidatePath("/dashboard/settings")
    return { url: blob.url, path, success: true }
  } catch (error) {
    console.error("Avatar update error:", error)
    return {
      url: "",
      path: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
