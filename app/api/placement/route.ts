import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"

export async function GET() {
  try {
    // Get all placement options from database
    const { data, error } = await executeQuery<{
      id: string
      name: string
      description: string | null
      body_area: string | null
      display_order: number
    }[]>(
      "SELECT id, name, description, body_area, display_order FROM placement_options WHERE is_active = true ORDER BY display_order ASC"
    )

    if (error || !data) {
      console.error("Error fetching placement options:", error)
      return NextResponse.json({ error: "Failed to fetch placement options" }, { status: 500 })
    }

    // Transform to expected format
    const placements = data.map(placement => ({
      id: placement.id,
      name: placement.name,
      description: placement.description || "",
      bodyArea: placement.body_area,
      displayOrder: placement.display_order
    }))

    return NextResponse.json(placements)
  } catch (error) {
    console.error("Error in placement options API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}