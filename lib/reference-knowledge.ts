import { supabase } from "@/lib/supabase"

/**
 * Gets reference images for AI knowledge
 */
export async function getKnowledgeForPrompt(
  prompt: string,
  options: {
    maxResults?: number
    includeUrls?: boolean
  } = {},
) {
  const { maxResults = 5, includeUrls = false } = options

  try {
    // Extract potential keywords from the prompt
    const keywords = extractKeywords(prompt)

    if (keywords.length === 0) {
      return { success: true, data: [] }
    }

    // Build a query to find matching reference images
    let query = supabase.from("reference_images").select("*")

    // Search by keywords in tags, category, style, and description
    const conditions = keywords.map((keyword) => {
      return `tags.cs.{${keyword}} OR category.ilike.%${keyword}% OR style.ilike.%${keyword}%`
    })

    query = query.or(conditions.join(","))

    // Get results
    const { data, error } = await query.limit(maxResults)

    if (error) throw error

    // Format the results
    const formattedData = data.map((item) => {
      const result: any = {
        id: item.id,
        category: item.category,
        style: item.style,
        tags: item.tags,
      }

      // Only include URLs if specifically requested
      if (includeUrls) {
        result.storage_path = item.storage_path
      }

      return result
    })

    return {
      success: true,
      data: formattedData,
    }
  } catch (error) {
    console.error("Error getting knowledge for prompt:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: [],
    }
  }
}

/**
 * Extract potential keywords from a prompt
 */
function extractKeywords(prompt: string): string[] {
  // Simple keyword extraction - in production you might want to use NLP
  const lowercasePrompt = prompt.toLowerCase()

  // Common tattoo styles
  const styles = [
    "traditional",
    "neo-traditional",
    "realism",
    "watercolor",
    "tribal",
    "japanese",
    "blackwork",
    "minimalist",
    "geometric",
    "dotwork",
    "old school",
    "new school",
    "biomechanical",
    "portrait",
    "script",
    "floral",
    "animal",
    "mandala",
    "abstract",
    "surrealism",
  ]

  // Common tattoo subjects
  const subjects = [
    "flower",
    "rose",
    "lotus",
    "skull",
    "dragon",
    "phoenix",
    "tiger",
    "lion",
    "wolf",
    "eagle",
    "snake",
    "butterfly",
    "moon",
    "sun",
    "star",
    "tree",
    "mountain",
    "ocean",
    "wave",
    "compass",
    "clock",
    "heart",
    "cross",
    "angel",
    "demon",
    "samurai",
    "geisha",
    "koi",
  ]

  const keywords = []

  // Check for styles
  for (const style of styles) {
    if (lowercasePrompt.includes(style)) {
      keywords.push(style)
    }
  }

  // Check for subjects
  for (const subject of subjects) {
    if (lowercasePrompt.includes(subject)) {
      keywords.push(subject)
    }
  }

  // Add any additional words that might be important
  const words = lowercasePrompt.split(/\s+/)
  for (const word of words) {
    const cleaned = word.replace(/[^\w]/g, "")
    if (cleaned.length > 3 && !keywords.includes(cleaned)) {
      keywords.push(cleaned)
    }
  }

  return keywords
}
