import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@/lib/neon"

export async function POST(request: NextRequest) {
  try {
    const { categoryId, imageUrls } = await request.json()

    if (!categoryId || !Array.isArray(imageUrls)) {
      return NextResponse.json({ error: "Invalid request. Requires categoryId and imageUrls array." }, { status: 400 })
    }

    // Insert images into the database
    const { data, error } = await neon.from("inspiration_images").insert(
      imageUrls.map((url) => ({
        category_id: categoryId,
        image_url: url,
        created_at: new Date().toISOString(),
      })),
    )

    if (error) {
      console.error("Error adding images to database:", error)
      return NextResponse.json({ error: "Failed to add images to database" }, { status: 500 })
    }

    // Get count of images in this category
    const { count, error: countError } = await neon
      .from("inspiration_images")
      .select("*", { count: "exact" })
      .eq("category_id", categoryId)

    if (countError) {
      console.error("Error counting images:", countError)
    }

    return NextResponse.json({
      success: true,
      message: `Added ${imageUrls.length} images to category ${categoryId}`,
      totalImages: count || imageUrls.length,
    })
  } catch (error) {
    console.error("Error adding images:", error)
    return NextResponse.json({ error: "Failed to add images" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const categoryId = url.searchParams.get("categoryId")

  try {
    if (categoryId) {
      const id = Number.parseInt(categoryId)
      const { data, error } = await neon
        .from("inspiration_images")
        .select("*")
        .eq("category_id", id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching images:", error)
        return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
      }

      return NextResponse.json({
        categoryId: id,
        images: data.map((item) => item.image_url),
      })
    }

    // Get all categories with their images
    const { data: categories, error: categoriesError } = await neon
      .from("inspiration_categories")
      .select("id, name")

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }

    const result: Record<number, string[]> = {}

    // For each category, get its images
    for (const category of categories) {
      const { data: images, error: imagesError } = await neon
        .from("inspiration_images")
        .select("image_url")
        .eq("category_id", category.id)

      if (imagesError) {
        console.error(`Error fetching images for category ${category.id}:`, imagesError)
        continue
      }

      result[category.id] = images.map((img) => img.image_url)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in GET request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
