import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"

export async function GET() {
  try {
    // Get all color options from database
    const { data, error } = await executeQuery<{
      id: string
      name: string
      description: string | null
      hex_code: string | null
      display_order: number
    }[]>(
      "SELECT id, name, description, hex_code, display_order FROM color_options WHERE is_active = true ORDER BY display_order ASC"
    )

    if (error || !data) {
      console.error("Error fetching color options:", error)
      return NextResponse.json({ error: "Failed to fetch color options" }, { status: 500 })
    }

    // Transform to expected format
    const colors = data.map(color => ({
      id: color.id,
      name: color.name,
      description: color.description || "",
      hexCode: color.hex_code,
      displayOrder: color.display_order
    }))

    return NextResponse.json(colors)
  } catch (error) {
    console.error("Error in color options API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}