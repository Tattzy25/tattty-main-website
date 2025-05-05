import { addKnowledgeEntry, getKnowledgeBase, searchKnowledgeBase } from "@/lib/reference-knowledge"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")
  const category = searchParams.get("category")

  let result

  if (query) {
    result = await searchKnowledgeBase(query)
  } else {
    result = await getKnowledgeBase(category || undefined)
  }

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { title, content, category, tags } = body

  if (!title || !content || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const result = await addKnowledgeEntry({
    title,
    content,
    category,
    tags,
  })

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json(result)
}
