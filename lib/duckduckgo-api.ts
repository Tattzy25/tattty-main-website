import { supabase } from "@/lib/supabase"

interface SearchResult {
  title: string
  url: string
  description: string
  imageUrl?: string
}

// Since DuckDuckGo doesn't have an official API, we'll implement a server-side solution
// that uses a combination of our own database and a proxy service for web search
export async function searchReferences(query: string): Promise<string[]> {
  try {
    // First, search our own database for relevant reference images
    const { data: internalResults, error } = await supabase
      .from("reference_images")
      .select("image_url, blob_url")
      .textSearch("title || description", query)
      .limit(5)

    if (error) {
      console.error("Error searching internal references:", error)
    }

    // Extract image URLs from internal results
    const internalImageUrls = (internalResults || []).map((item) => item.blob_url || item.image_url).filter(Boolean)

    // If we have enough internal results, return them
    if (internalImageUrls.length >= 5) {
      return internalImageUrls
    }

    // Otherwise, use our proxy API to get external results
    const externalResults = await fetchExternalSearchResults(query)

    // Combine internal and external results, removing duplicates
    const allImageUrls = [...internalImageUrls, ...externalResults]
    const uniqueImageUrls = [...new Set(allImageUrls)]

    return uniqueImageUrls.slice(0, 10) // Return up to 10 results
  } catch (error) {
    console.error("Error searching references:", error)
    return []
  }
}

// Function to fetch external search results through our proxy API
async function fetchExternalSearchResults(query: string): Promise<string[]> {
  try {
    // Call our own API endpoint that handles the external search
    const response = await fetch(`/api/search/references?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Search API returned ${response.status}`)
    }

    const data = await response.json()
    return data.imageUrls || []
  } catch (error) {
    console.error("Error fetching external search results:", error)
    return []
  }
}

// Create the API route for external search
export async function createSearchAPIRoute(req: Request) {
  const url = new URL(req.url)
  const query = url.searchParams.get("q")

  if (!query) {
    return new Response(JSON.stringify({ error: "Query parameter is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    // Use a service like SerpAPI or similar to get image search results
    // This is a paid service but provides reliable results
    const searchResults = await searchDuckDuckGo(query + " tattoo reference")
    const imageUrls = searchResults.results.map((result: any) => result.url) || []

    return new Response(JSON.stringify({ imageUrls }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in search API:", error)
    return new Response(JSON.stringify({ error: "Failed to perform search" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function searchDuckDuckGo(query: string) {
  try {
    // Using DuckDuckGo's HTML search which doesn't require an API key
    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error(`Failed to search: ${response.status}`)
    }

    const html = await response.text()

    // Simple parsing of results (this is a basic implementation)
    // In production, you'd want to use a proper HTML parser
    const results =
      html.match(/<a class="result__a" href="([^"]+)"[^>]*>([^<]+)<\/a>/g)?.map((match) => {
        const url = match.match(/href="([^"]+)"/)?.[1] || ""
        const title = match.match(/>([^<]+)</)?.[1] || ""
        return { url, title }
      }) || []

    return {
      results: results.slice(0, 10),
      message: "Results from DuckDuckGo",
    }
  } catch (error) {
    console.error("Error searching DuckDuckGo:", error)
    return {
      results: [],
      message: "Error searching DuckDuckGo",
    }
  }
}
