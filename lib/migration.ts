import { supabase } from "@/lib/supabase"
import { uploadToBlob } from "@/lib/blob-storage"

/**
 * Migrates a single image from Supabase Storage to Vercel Blob
 */
async function migrateImage(
  bucket: string,
  path: string,
  targetFolder: string,
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
  try {
    // Download from Supabase
    const { data, error } = await supabase.storage.from(bucket).download(path)

    if (error || !data) {
      throw new Error(`Failed to download from Supabase: ${error?.message || "No data"}`)
    }

    // Upload to Vercel Blob
    const filename = path.split("/").pop() || ""
    const result = await uploadToBlob(data, targetFolder, filename)

    if (!result.success) {
      throw new Error(`Failed to upload to Blob: ${result.error}`)
    }

    return {
      success: true,
      url: result.url,
      path: result.path,
    }
  } catch (error) {
    console.error(`Error migrating image ${path}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during migration",
    }
  }
}

/**
 * Migrates tattoo designs from Supabase Storage to Vercel Blob
 */
export async function migrateTattooDesigns(limit = 50): Promise<{
  total: number
  migrated: number
  failed: number
  details: Array<{ id: string; success: boolean; error?: string }>
}> {
  const results = {
    total: 0,
    migrated: 0,
    failed: 0,
    details: [] as Array<{ id: string; success: boolean; error?: string }>,
  }

  try {
    // Get designs that don't have a Blob path yet
    const { data: designs, error } = await supabase
      .from("tattoo_designs")
      .select("*")
      .is("image_path", null)
      .limit(limit)

    if (error) {
      throw error
    }

    results.total = designs?.length || 0
    if (!designs || designs.length === 0) {
      return results
    }

    // Process each design
    for (const design of designs) {
      try {
        // Extract the path from the Supabase URL
        const url = new URL(design.image_url)
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/)

        if (!pathMatch) {
          throw new Error(`Could not parse Supabase URL: ${design.image_url}`)
        }

        const [, bucket, path] = pathMatch

        // Migrate the image
        const migrationResult = await migrateImage(bucket, path, "tattoo-designs")

        if (!migrationResult.success) {
          throw new Error(migrationResult.error)
        }

        // Update the database record
        const { error: updateError } = await supabase
          .from("tattoo_designs")
          .update({
            image_url: migrationResult.url,
            image_path: migrationResult.path,
          })
          .eq("id", design.id)

        if (updateError) {
          throw updateError
        }

        results.migrated++
        results.details.push({ id: design.id, success: true })
      } catch (error) {
        results.failed++
        results.details.push({
          id: design.id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return results
  } catch (error) {
    console.error("Error in migration process:", error)
    throw error
  }
}

/**
 * Migrates artist portfolio images from Supabase Storage to Vercel Blob
 */
export async function migratePortfolioImages(limit = 50): Promise<{
  total: number
  migrated: number
  failed: number
  details: Array<{ id: string; success: boolean; error?: string }>
}> {
  // Similar implementation as migrateTattooDesigns but for portfolio images
  // This is left as a placeholder for brevity
  return {
    total: 0,
    migrated: 0,
    failed: 0,
    details: [],
  }
}
