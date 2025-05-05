import { supabase } from "@/lib/supabase"
import { PEXELS_API_KEY } from "./config"

interface SearchResult {
  title: string
  url: string
  imageUrl: string | null
  description?: string
  type?: string
  id?: string
}

export async function searchTattooDesigns(query: string): Promise<SearchResult[]> {
  try {
    if (!query || query.trim().length < 2) {
      return []
    }

    const results: SearchResult[] = []

    // Search in our own database first
    const { data: designsData, error: designsError } = await supabase
      .from("tattoo_designs")
      .select("id, title, description, image_url, blob_url, created_at")
      .textSearch("title || description", query)
      .order("created_at", { ascending: false })
      .limit(5)

    if (designsError) {
      console.error("Error searching designs:", designsError)
    } else if (designsData) {
      // Add designs to results
      designsData.forEach((design) => {
        results.push({
          id: design.id,
          title: design.title || "Untitled Design",
          description: design.description || "",
          url: `/dashboard/designs/${design.id}`,
          imageUrl: design.blob_url || design.image_url || null,
          type: "design",
        })
      })
    }

    // Search for artists
    const { data: artistsData, error: artistsError } = await supabase
      .from("artist_profiles")
      .select("id, business_name, bio, location, avatar_url")
      .textSearch("business_name || bio", query)
      .limit(3)

    if (artistsError) {
      console.error("Error searching artists:", artistsError)
    } else if (artistsData) {
      // Add artists to results
      artistsData.forEach((artist) => {
        results.push({
          id: artist.id,
          title: artist.business_name || "Unnamed Artist",
          description: `${artist.location || ""} - ${artist.bio?.substring(0, 100) || ""}`,
          url: `/artists/${artist.id}`,
          imageUrl: artist.avatar_url || null,
          type: "artist",
        })
      })
    }

    // Search for styles
    const { data: stylesData, error: stylesError } = await supabase
      .from("tattoo_styles")
      .select("id, name, description, image_url")
      .textSearch("name || description", query)
      .limit(3)

    if (stylesError) {
      console.error("Error searching styles:", stylesError)
    } else if (stylesData) {
      // Add styles to results
      stylesData.forEach((style) => {
        results.push({
          id: style.id,
          title: style.name || "Unnamed Style",
          description: style.description || "",
          url: `/styles/${style.id}`,
          imageUrl: style.image_url || null,
          type: "style",
        })
      })
    }

    // If we don't have enough results, search external sources
    if (results.length < 5) {
      try {
        // Use Pexels API to find tattoo images
        const pexelsResults = await searchPexelsImages(query, 5 - results.length)
        results.push(...pexelsResults)
      } catch (pexelsError) {
        console.error("Error searching Pexels:", pexelsError)
      }
    }

    return results
  } catch (error) {
    console.error("Error searching for tattoo designs:", error)
    return []
  }
}

// Search Pexels for tattoo images
async function searchPexelsImages(query: string, limit: number): Promise<SearchResult[]> {
  try {
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY

    if (!PEXELS_API_KEY) {
      throw new Error("Pexels API key is not configured")
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + " tattoo")}&per_page=${limit}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`)
    }

    const data = await response.json()

    return data.photos.map((photo: any) => ({
      title: photo.alt || "Tattoo inspiration",
      description: `Photo by ${photo.photographer}`,
      url: photo.url,
      imageUrl: photo.src.medium,
      type: "inspiration",
    }))
  } catch (error) {
    console.error("Error searching Pexels:", error)
    return []
  }
}

// Search function for the global site search
export async function globalSearch(query: string): Promise<{
  designs: SearchResult[]
  artists: SearchResult[]
  styles: SearchResult[]
  inspiration: SearchResult[]
}> {
  try {
    if (!query || query.trim().length < 2) {
      return {
        designs: [],
        artists: [],
        styles: [],
        inspiration: [],
      }
    }

    // Search designs
    const { data: designsData, error: designsError } = await supabase
      .from("tattoo_designs")
      .select("id, title, description, image_url, blob_url, created_at")
      .textSearch("title || description", query)
      .order("created_at", { ascending: false })
      .limit(8)

    const designs: SearchResult[] =
      !designsError && designsData
        ? designsData.map((design) => ({
            id: design.id,
            title: design.title || "Untitled Design",
            description: design.description || "",
            url: `/dashboard/designs/${design.id}`,
            imageUrl: design.blob_url || design.image_url || null,
            type: "design",
          }))
        : []

    // Search artists
    const { data: artistsData, error: artistsError } = await supabase
      .from("artist_profiles")
      .select("id, business_name, bio, location, avatar_url")
      .textSearch("business_name || bio", query)
      .limit(5)

    const artists: SearchResult[] =
      !artistsError && artistsData
        ? artistsData.map((artist) => ({
            id: artist.id,
            title: artist.business_name || "Unnamed Artist",
            description: `${artist.location || ""} - ${artist.bio?.substring(0, 100) || ""}`,
            url: `/artists/${artist.id}`,
            imageUrl: artist.avatar_url || null,
            type: "artist",
          }))
        : []

    // Search styles
    const { data: stylesData, error: stylesError } = await supabase
      .from("tattoo_styles")
      .select("id, name, description, image_url")
      .textSearch("name || description", query)
      .limit(5)

    const styles: SearchResult[] =
      !stylesError && stylesData
        ? stylesData.map((style) => ({
            id: style.id,
            title: style.name || "Unnamed Style",
            description: style.description || "",
            url: `/styles/${style.id}`,
            imageUrl: style.image_url || null,
            type: "style",
          }))
        : []

    // Search inspiration images
    let inspiration: SearchResult[] = []
    try {
      inspiration = await searchPexelsImages(query, 8)
    } catch (error) {
      console.error("Error searching Pexels:", error)
    }

    return {
      designs,
      artists,
      styles,
      inspiration,
    }
  } catch (error) {
    console.error("Global search error:", error)
    return {
      designs: [],
      artists: [],
      styles: [],
      inspiration: [],
    }
  }
}

// Use Pexels API for image search instead of SERP
export async function searchImages(query: string, limit = 10) {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${limit}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.status}`)
    }

    const data = await response.json()
    return data.photos.map((photo: any) => ({
      url: photo.src.medium,
      thumbnail: photo.src.small,
      title: photo.alt || query,
      source: "Pexels",
      sourceUrl: photo.url,
    }))
  } catch (error) {
    console.error("Error searching images:", error)
    return []
  }
}

// Text search function that doesn't rely on SERP
export async function searchText(query: string) {
  // Simple implementation that doesn't require external API
  // This could be replaced with a database search or other internal search
  return {
    results: [],
    message: "Internal search functionality",
  }
}
