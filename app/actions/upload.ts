"use server"

import { revalidatePath } from "next/cache"
import { uploadToBlob, uploadBase64ToBlob, deleteFromBlob } from "@/lib/blob-storage"
import { getSqlClient, insert, deleteRecord, select, upsert } from "@/lib/neon"

/**
 * Uploads a tattoo design image and saves it to the database
 */
export async function uploadTattooDesign(formData: FormData) {
  try {
    // TODO: Add authentication check
    const userId = "temp-user-id" // Replace with actual user authentication
    
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
    const { data, error } = await insert("tattoo_designs", {
      user_id: userId,
      title: title || "Untitled Design",
      description,
      prompt,
      style,
      image_url: uploadResult.url,
      is_public: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      // Clean up the uploaded blob if database insert fails
      await deleteFromBlob(uploadResult.path)
      return { success: false, error: error.message || "Database error" }
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
    // TODO: Add authentication check
    const userId = "temp-user-id" // Replace with actual user authentication

    // Upload image to Blob
    const uploadResult = await uploadBase64ToBlob(base64Image, "ai-generated")
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error }
    }

    // Save to database
    const { data, error } = await insert("tattoo_designs", {
      user_id: userId,
      title: title || "AI Generated Design",
      prompt,
      style,
      image_url: uploadResult.url,
      is_public: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      // Clean up the uploaded blob if database insert fails
      await deleteFromBlob(uploadResult.path)
      return { success: false, error: error.message || "Database error" }
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
    // TODO: Add authentication check
    const userId = "temp-user-id" // Replace with actual user authentication

    // Get the design to check ownership and get the image path
    const { data: designs, error: fetchError } = await select(
      "tattoo_designs", 
      "*", 
      "id = $1 AND user_id = $2", 
      [designId, userId]
    )

    const design = designs?.[0]
    if (fetchError || !design) {
      return { success: false, error: "Design not found or access denied" }
    }

    // Delete from database
    const { error: deleteError } = await deleteRecord(
      "tattoo_designs", 
      "id = $1 AND user_id = $2", 
      [designId, userId]
    )

    if (deleteError) {
      return { success: false, error: deleteError.message || "Database error" }
    }

    // TODO: Clean up blob storage - add to cleanup queue
    if (design.image_url) {
      // For now, just log - implement cleanup job later
      console.log("Image to cleanup:", design.image_url)
    }

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

// Export deleteDesign as an alias for deleteTattooDesign for backward compatibility
export const deleteDesign = deleteTattooDesign

/**
 * Updates a user's profile avatar
 */
export async function updateProfileAvatar(formData: FormData) {
  try {
    // TODO: Add authentication check
    const userId = "temp-user-id" // Replace with actual user authentication
    const file = formData.get("avatar") as File

    // Upload image to Blob
    const uploadResult = await uploadToBlob(file, "avatars")
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error }
    }

    // Get current profile to check if we need to delete an old avatar
    const { data: profiles } = await select("user_profiles", "avatar_url", "id = $1", [userId])
    const profile = profiles?.[0]

    // TODO: Delete old avatar if it exists
    if (profile?.avatar_url) {
      console.log("Old avatar to cleanup:", profile.avatar_url)
    }

    // Update profile
    const { error } = await upsert("user_profiles", {
      id: userId,
      avatar_url: uploadResult.url,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      // Clean up the uploaded blob if database update fails
      await deleteFromBlob(uploadResult.path)
      return { success: false, error: error.message || "Database error" }
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
