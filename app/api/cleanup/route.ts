import { NextResponse } from "next/server"
import { deleteFromBlob } from "@/lib/blob-storage"
import { neon } from "@/lib/neon"

// This endpoint should be called by a cron job
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Verify authorization
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (token !== process.env.CLEANUP_SECRET_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get unprocessed deleted images
    const { data: deletedImages, error } = await neon
      .from("deleted_images")
      .select("*")
      .eq("processed", false)
      .limit(100)

    if (error) {
      throw error
    }

    if (!deletedImages || deletedImages.length === 0) {
      return NextResponse.json({ message: "No images to clean up" })
    }

    // Process each deleted image
    const results = await Promise.allSettled(
      deletedImages.map(async (image) => {
        try {
          // Delete from Blob storage
          await deleteFromBlob(image.image_path)

          // Mark as processed
          await neon.from("deleted_images").update({ processed: true }).eq("id", image.id)

          return { id: image.id, success: true }
        } catch (error) {
          console.error(`Failed to delete image ${image.id}:`, error)
          return { id: image.id, success: false, error }
        }
      }),
    )

    return NextResponse.json({
      processed: results.length,
      successful: results.filter((r) => r.status === "fulfilled" && (r.value as any).success).length,
      failed: results.filter((r) => r.status === "rejected" || !(r.value as any).success).length,
    })
  } catch (error) {
    console.error("Error in cleanup job:", error)
    return NextResponse.json({ error: "Failed to run cleanup job" }, { status: 500 })
  }
}
