import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"

export async function GET() {
  try {
    // Get all inspiration categories (styles) from database
    const { data, error } = await executeQuery<{
      id: string
      name: string
      description: string | null
      slug: string
    }[]>(
      "SELECT id, name, description, slug FROM inspiration_categories ORDER BY name ASC"
    )

    if (error || !data) {
      console.error("Error fetching styles:", error)
      return NextResponse.json({ error: "Failed to fetch styles" }, { status: 500 })
    }

    // Transform to expected format
    const styles = data.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || "",
      slug: category.slug,
      imageUrl: `https://images.unsplash.com/photo-1590246814883-57c511548d8c?w=400&h=400&fit=crop&text=${encodeURIComponent(category.name)}`
    }))

    return NextResponse.json(styles)
  } catch (error) {
    console.error("Error in styles API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}