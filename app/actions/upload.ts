"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import { uploadToBlob, uploadBase64ToBlob, deleteFromBlob } from "@/lib/blob-storage"

/**
 * Uploads a tattoo design image and saves it to the database
 */
export async function uploadTattooDesign(formData: FormData) {
  try {
    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const userId = session.user.id
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const prompt = formData.get("prompt") as string
    const style = formData.get("style") as string
    const file = formData.get("image") as File

    // Upload image to Blob
    const uploadResult = await uploadToBlob(file, "tattoo-designs")
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error }
    }

    // Save to database
    const { data, error } = await supabase
      .from("tattoo_designs")
      .insert({
        user_id: userId,
        title: title || "Untitled Design",
        description,
        prompt,
        style,
        image_url: uploadResult.url,
        image_path: uploadResult.path,
        is_ai_generated: !!prompt,
      })
      .select()

    if (error) {
      // Clean up the uploaded blob if database insert fails
      await deleteFromBlob(uploadResult.path)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/designs")
    return { success: true, data }
  } catch (error) {
    console.error("Error uploading tattoo design:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during upload",
    }
  }
}

/**
 * Uploads an AI-generated design from base64 data
 */
export async function uploadAIGeneratedDesign(base64Image: string, title: string, prompt: string, style: string) {
  try {
    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const userId = session.user.id

    // Upload image to Blob
    const uploadResult = await uploadBase64ToBlob(base64Image, "ai-generated")
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error }
    }

    // Save to database
    const { data, error } = await supabase
      .from("tattoo_designs")
      .insert({
        user_id: userId,
        title: title || "AI Generated Design",
        prompt,
        style,
        image_url: uploadResult.url,
        image_path: uploadResult.path,
        is_ai_generated: true,
      })
      .select()

    if (error) {
      // Clean up the uploaded blob if database insert fails
      await deleteFromBlob(uploadResult.path)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/designs")
    return { success: true, data }
  } catch (error) {
    console.error("Error uploading AI generated design:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during upload",
    }
  }
}

/**
 * Deletes a tattoo design and its associated image
 */
export async function deleteTattooDesign(designId: string) {
  try {
    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const userId = session.user.id

    // Get the design to check ownership and get the image path
    const { data: design, error: fetchError } = await supabase
      .from("tattoo_designs")
      .select("*")
      .eq("id", designId)
      .eq("user_id", userId)
      .single()

    if (fetchError || !design) {
      return { success: false, error: "Design not found or access denied" }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("tattoo_designs")
      .delete()
      .eq("id", designId)
      .eq("user_id", userId)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    // The trigger we created will handle adding the image to the deleted_images table
    // for later cleanup by our background job

    revalidatePath("/dashboard/designs")
    return { success: true }
  } catch (error) {
    console.error("Error deleting tattoo design:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during deletion",
    }
  }
}

/**
 * Updates a user's profile avatar
 */
export async function updateProfileAvatar(formData: FormData) {
  try {
    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const userId = session.user.id
    const file = formData.get("avatar") as File

    // Upload image to Blob
    const uploadResult = await uploadToBlob(file, "avatars")
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error }
    }

    // Get current profile to check if we need to delete an old avatar
    const { data: profile } = await supabase.from("user_profiles").select("avatar_path").eq("id", userId).single()

    // Delete old avatar if it exists
    if (profile?.avatar_path) {
      await deleteFromBlob(profile.avatar_path)
    }

    // Update profile
    const { error } = await supabase.from("user_profiles").upsert({
      id: userId,
      avatar_url: uploadResult.url,
      avatar_path: uploadResult.path,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      // Clean up the uploaded blob if database update fails
      await deleteFromBlob(uploadResult.path)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/settings")
    return { success: true, url: uploadResult.url }
  } catch (error) {
    console.error("Error updating profile avatar:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during upload",
    }
  }
}

/**
 * Uploads an artist portfolio image
 */
export async function uploadPortfolioImage(formData: FormData) {
  try {
    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const userId = session.user.id
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const style = formData.get("style") as string
    const tags = formData.get("tags") as string
    const file = formData.get("image") as File

    // Get artist profile
    const { data: artistProfile, error: profileError } = await supabase
      .from("artist_profiles")
      .select("id")
      .eq("id", userId)
      .single()

    if (profileError || !artistProfile) {
      return { success: false, error: "Artist profile not found" }
    }

    // Upload image to Blob
    const uploadResult = await uploadToBlob(file, "portfolio")
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error }
    }

    // Parse tags
    const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : []

    // Save to database
    const { data, error } = await supabase
      .from("artist_portfolios")
      .insert({
        artist_id: artistProfile.id,
        title: title || "Untitled Work",
        description,
        style,
        tags: tagArray,
        image_url: uploadResult.url,
        image_path: uploadResult.path,
      })
      .select()

    if (error) {
      // Clean up the uploaded blob if database insert fails
      await deleteFromBlob(uploadResult.path)
      return { success: false, error: error.message }
    }

    revalidatePath("/artist-dashboard")
    return { success: true, data }
  } catch (error) {
    console.error("Error uploading portfolio image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during upload",
    }
  }
}
