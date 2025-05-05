interface SearchResult {
  title: string
  url: string
  imageUrl: string | null
}

export async function searchTattooDesigns(query: string): Promise<SearchResult[]> {
  try {
    // Construct the search URL for DuckDuckGo
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query + " tattoo design")}&format=json&pretty=1&no_html=1&skip_disambig=1`

    const response = await fetch(searchUrl)

    if (!response.ok) {
      throw new Error(`DuckDuckGo search failed: ${response.statusText}`)
    }

    const data = await response.json()

    // Extract and format the results
    const results: SearchResult[] = data.RelatedTopics.map((topic: any) => ({
      title: topic.Text || "",
      url: topic.FirstURL || "",
      imageUrl: topic.Icon?.URL || null,
    })).filter((result: SearchResult) => result.title && result.url)

    return results.slice(0, 10) // Return top 10 results
  } catch (error) {
    console.error("Error searching for tattoo designs:", error)
    return []
  }
}
