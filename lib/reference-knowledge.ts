import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function getKnowledgeBase(category?: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  let query = supabase.from("knowledge_base").select("*")

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching knowledge base:", error)
    return { error: error.message }
  }

  return { data }
}

export async function addKnowledgeEntry(entry: {
  title: string
  content: string
  category: string
  tags?: string[]
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Check if user is admin
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single()

  if (userError || !userData || userData.role !== "admin") {
    return { error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("knowledge_base")
    .insert({
      title: entry.title,
      content: entry.content,
      category: entry.category,
      tags: entry.tags || [],
      created_by: session.user.id,
    })
    .select()

  if (error) {
    console.error("Error adding knowledge entry:", error)
    return { error: error.message }
  }

  return { data }
}

export async function searchKnowledgeBase(query: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Use Supabase's full-text search
  const { data, error } = await supabase.from("knowledge_base").select("*").textSearch("content", query, {
    config: "english",
  })

  if (error) {
    console.error("Error searching knowledge base:", error)
    return { error: error.message }
  }

  return { data }
}

export async function getKnowledgeCategories() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("knowledge_base").select("category").order("category")

  if (error) {
    console.error("Error fetching knowledge categories:", error)
    return { error: error.message }
  }

  // Extract unique categories
  const categories = [...new Set(data.map((item) => item.category))]

  return { categories }
}
