"use server"

import { revalidatePath } from "next/cache"
import {
  batchUploadReferenceImages,
  getDistinctCategoriesAndStyles,
  getReferenceImages,
  deleteReferenceImage,
} from "@/lib/supabase-storage"

/**
 * Uploads multiple reference images
 */
export async function uploadReferenceImages(formData: FormData) {
  try {
    const category = formData.get("category") as string
    const style = formData.get("style") as string
    const tagsString = formData.get("tags") as string
    const files = formData.getAll("files") as File[]

    if (!category || !style) {
      return { success: false, error: "Category and style are required" }
    }

    if (!files || files.length === 0) {
      return { success: false, error: "No files provided" }
    }

    // Parse tags
    const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []

    // Upload files
    const result = await batchUploadReferenceImages(files, category, style, tags)

    revalidatePath("/admin/reference-images")
    return { success: true, ...result }
  } catch (error) {
    console.error("Error uploading reference images:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during upload",
    }
  }
}

/**
 * Gets reference images with filtering
 */
export async function fetchReferenceImages(category?: string, style?: string, limit = 100, offset = 0) {
  return getReferenceImages(category, style, limit, offset)
}

/**
 * Gets distinct categories and styles
 */
export async function fetchCategoriesAndStyles() {
  return getDistinctCategoriesAndStyles()
}

/**
 * Deletes a reference image
 */
export async function removeReferenceImage(id: string) {
  const result = await deleteReferenceImage(id)
  if (result.success) {
    revalidatePath("/admin/reference-images")
  }
  return result
}
