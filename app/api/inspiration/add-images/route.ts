import { type NextRequest, NextResponse } from "next/server"

// This is a simple in-memory storage for demonstration
// In a production app, you'd use a database
const categoryImages: Record<number, string[]> = {}

export async function POST(request: NextRequest) {
  try {
    const { categoryId, imageUrls } = await request.json()

    if (!categoryId || !Array.isArray(imageUrls)) {
      return NextResponse.json({ error: "Invalid request. Requires categoryId and imageUrls array." }, { status: 400 })
    }

    // Initialize the category if it doesn't exist
    if (!categoryImages[categoryId]) {
      categoryImages[categoryId] = []
    }

    // Add the new image URLs
    categoryImages[categoryId] = [...categoryImages[categoryId], ...imageUrls]

    return NextResponse.json({
      success: true,
      message: `Added ${imageUrls.length} images to category ${categoryId}`,
      totalImages: categoryImages[categoryId].length,
    })
  } catch (error) {
    console.error("Error adding images:", error)
    return NextResponse.json({ error: "Failed to add images" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const categoryId = url.searchParams.get("categoryId")

  if (categoryId) {
    const id = Number.parseInt(categoryId)
    return NextResponse.json({
      categoryId: id,
      images: categoryImages[id] || [],
    })
  }

  return NextResponse.json(categoryImages)
}
