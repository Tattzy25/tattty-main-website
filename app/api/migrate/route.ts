import { NextResponse } from "next/server"
import { migrateTattooDesigns, migratePortfolioImages } from "@/lib/migration"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Verify authorization
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (token !== process.env.MIGRATION_SECRET_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { type = "designs", limit = 50 } = body

    // Run migration based on type
    let result
    if (type === "designs") {
      result = await migrateTattooDesigns(limit)
    } else if (type === "portfolio") {
      result = await migratePortfolioImages(limit)
    } else {
      return NextResponse.json({ error: "Invalid migration type" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in migration job:", error)
    return NextResponse.json({ error: "Failed to run migration job" }, { status: 500 })
  }
}
