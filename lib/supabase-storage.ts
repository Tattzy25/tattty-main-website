import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

const REFERENCE_BUCKET = "reference-images"

/**
 * Ensures the reference images bucket exists
 */
export async function ensureReferenceBucket() {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((bucket) => bucket.name === REFERENCE_BUCKET)

    if (!bucketExists) {
      // Create the bucket as private (not public)
      const { error } = await supabase.storage.createBucket(REFERENCE_BUCKET, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      })

      if (error) throw error
      console.log(`Created bucket: ${REFERENCE_BUCKET}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error ensuring reference bucket:", error)
    return { success: false, error }
  }
}

/**
 * Uploads a file to the reference images bucket
 */
export async function uploadReferenceImage(file: File, category: string, style: string, tags: string[] = []) {
  try {
    // Ensure bucket exists
    await ensureReferenceBucket()

    // Generate a unique path for the file
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${category}/${style}/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage.from(REFERENCE_BUCKET).upload(filePath, file)

    if (uploadError) throw uploadError

    // Get the URL (this will be a signed URL since the bucket is private)
    const { data: urlData } = await supabase.storage
      .from(REFERENCE_BUCKET)
      .createSignedUrl(filePath, 60 * 60 * 24 * 365) // 1 year expiry

    if (!urlData) throw new Error("Failed to get signed URL")

    // Save metadata to the database
    const { error: dbError } = await supabase.from("reference_images").insert({
      storage_path: filePath,
      file_name: file.name,
      category,
      style,
      tags,
      description: "",
    })

    if (dbError) throw dbError

    return {
      success: true,
      path: filePath,
      url: urlData.signedUrl,
    }
  } catch (error) {
    console.error("Error uploading reference image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during upload",
    }
  }
}

/**
 * Batch uploads multiple files
 */
export async function batchUploadReferenceImages(files: File[], category: string, style: string, tags: string[] = []) {
  const results = []
  let successCount = 0
  let failureCount = 0

  for (const file of files) {
    const result = await uploadReferenceImage(file, category, style, tags)
    results.push({
      fileName: file.name,
      success: result.success,
      error: result.error,
    })

    if (result.success) successCount++
    else failureCount++
  }

  return {
    totalProcessed: files.length,
    successCount,
    failureCount,
    results,
  }
}

/**
 * Gets reference images by category and style
 */
export async function getReferenceImages(category?: string, style?: string, limit = 100, offset = 0) {
  try {
    let query = supabase.from("reference_images").select("*")

    if (category) {
      query = query.eq("category", category)
    }

    if (style) {
      query = query.eq("style", style)
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1)

    if (error) throw error

    // Get signed URLs for each image
    const imagesWithUrls = await Promise.all(
      data.map(async (image) => {
        const { data: urlData } = await supabase.storage
          .from(REFERENCE_BUCKET)
          .createSignedUrl(image.storage_path, 60 * 60) // 1 hour expiry for admin viewing

        return {
          ...image,
          signed_url: urlData?.signedUrl || null,
        }
      }),
    )

    return {
      success: true,
      data: imagesWithUrls,
      count,
    }
  } catch (error) {
    console.error("Error getting reference images:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error fetching images",
    }
  }
}

/**
 * Gets distinct categories and styles
 */
export async function getDistinctCategoriesAndStyles() {
  try {
    const { data: categories, error: catError } = await supabase.from("reference_images").select("category").distinct()

    if (catError) throw catError

    const { data: styles, error: styleError } = await supabase.from("reference_images").select("style").distinct()

    if (styleError) throw styleError

    return {
      success: true,
      categories: categories.map((c) => c.category).filter(Boolean),
      styles: styles.map((s) => s.style).filter(Boolean),
    }
  } catch (error) {
    console.error("Error getting categories and styles:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Deletes a reference image
 */
export async function deleteReferenceImage(id: string) {
  try {
    // Get the image first to get the storage path
    const { data: image, error: fetchError } = await supabase.from("reference_images").select("*").eq("id", id).single()

    if (fetchError) throw fetchError
    if (!image) throw new Error("Image not found")

    // Delete from storage
    const { error: storageError } = await supabase.storage.from(REFERENCE_BUCKET).remove([image.storage_path])

    if (storageError) throw storageError

    // Delete from database
    const { error: dbError } = await supabase.from("reference_images").delete().eq("id", id)

    if (dbError) throw dbError

    return { success: true }
  } catch (error) {
    console.error("Error deleting reference image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during deletion",
    }
  }
}
