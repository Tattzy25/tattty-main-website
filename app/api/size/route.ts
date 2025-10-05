import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"

export async function GET() {
  try {
    // Get all size options from database
    const { data, error } = await executeQuery<{
      id: string
      name: string
      description: string | null
      size_range: string | null
      display_order: number
    }[]>(
      "SELECT id, name, description, size_range, display_order FROM size_options WHERE is_active = true ORDER BY display_order ASC"
    )

    if (error || !data) {
      console.error("Error fetching size options:", error)
      return NextResponse.json({ error: "Failed to fetch size options" }, { status: 500 })
    }

    // Transform to expected format
    const sizes = data.map(size => ({
      id: size.id,
      name: size.name,
      description: size.description || "",
      sizeRange: size.size_range,
      displayOrder: size.display_order
    }))

    return NextResponse.json(sizes)
  } catch (error) {
    console.error("Error in size options API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}