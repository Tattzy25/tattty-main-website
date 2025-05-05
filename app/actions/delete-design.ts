"use server"

import { supabase } from "@/lib/supabase"
import { deleteBlob } from "@/lib/blob-storage"
import { revalidatePath } from "next/cache"

export async function deleteDesign(designId: string) {
  try {
    // Get the design to find associated blob URLs
    const { data: design, error: fetchError } = await supabase
      .from("tattoo_designs")
      .select("*")
      .eq("id", designId)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch design: ${fetchError.message}`)
    }

    // Delete the blob if it exists
    if (design.blob_url) {
      try {
        await deleteBlob(design.blob_url)
      } catch (blobError) {
        console.error("Error deleting blob:", blobError)
        // Continue with database deletion even if blob deletion fails
      }
    }

    // Delete any associated tags
    const { error: tagsError } = await supabase.from("design_tags").delete().eq("design_id", designId)

    if (tagsError) {
      console.error("Error deleting design tags:", tagsError)
    }

    // Delete any associated comments
    const { error: commentsError } = await supabase.from("design_comments").delete().eq("design_id", designId)

    if (commentsError) {
      console.error("Error deleting design comments:", commentsError)
    }

    // Delete any associated likes
    const { error: likesError } = await supabase.from("design_likes").delete().eq("design_id", designId)

    if (likesError) {
      console.error("Error deleting design likes:", likesError)
    }

    // Finally delete the design itself
    const { error: deleteError } = await supabase.from("tattoo_designs").delete().eq("id", designId)

    if (deleteError) {
      throw new Error(`Failed to delete design: ${deleteError.message}`)
    }

    // Revalidate the designs page to update the UI
    revalidatePath("/dashboard/designs")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteDesign:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
