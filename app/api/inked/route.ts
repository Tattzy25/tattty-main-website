import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"

export async function GET() {
  try {
    // Get tattoo designs for the inked page
    const { data, error } = await executeQuery<{
      id: string
      title: string | null
      description: string | null
      image_url: string
      is_public: boolean
      created_at: string | null
      user_id: string | null
    }[]>(
      "SELECT id, title, description, image_url, is_public, created_at, user_id FROM tattoo_designs WHERE is_public = true ORDER BY created_at DESC LIMIT 20"
    )

    if (error || !data) {
      console.error("Error fetching tattoo designs:", error)
      return NextResponse.json({ error: "Failed to fetch designs" }, { status: 500 })
    }

    // Transform to expected format
    const designs = data.map(design => ({
      id: design.id,
      title: design.title || "Untitled Design",
      description: design.description,
      imageUrl: design.image_url,
      isPublic: design.is_public,
      createdAt: design.created_at,
      userId: design.user_id
    }))

    return NextResponse.json(designs)
  } catch (error) {
    console.error("Error in inked API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, image_url, style, user_id, prompt } = body

    // Insert new tattoo design
    const { data, error } = await executeQuery(
      "INSERT INTO tattoo_designs (title, description, image_url, style, user_id, prompt, is_public, is_ai_generated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [title, description, image_url, style, user_id, prompt, false, true]
    )

    if (error || !data) {
      console.error("Error creating tattoo design:", error)
      return NextResponse.json({ error: "Failed to create design" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in inked POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}