import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM pipeline_config 
      ORDER BY updated_at DESC 
      LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json({
        box1: "",
        box2: "",
        box3: "",
        box4: "",
      })
    }

    const config = result[0]
    return NextResponse.json({
      box1: config.box1_data,
      box2: config.box2_data,
      box3: config.box3_data,
      box4: config.box4_data,
    })
  } catch (error) {
    console.error("Failed to fetch pipeline config:", error)
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { box1, box2, box3, box4 } = await req.json()

    await sql`
      INSERT INTO pipeline_config (box1_data, box2_data, box3_data, box4_data, updated_at)
      VALUES (${box1}, ${box2}, ${box3}, ${box4}, NOW())
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save pipeline config:", error)
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    )
  }
}
