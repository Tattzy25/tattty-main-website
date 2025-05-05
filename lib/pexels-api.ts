import { PEXELS_API_KEY } from "@/lib/config"

interface PexelsPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
}

interface PexelsResponse {
  total_results: number
  page: number
  per_page: number
  photos: PexelsPhoto[]
  next_page: string
}

export async function getInspirationImages(query: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + " tattoo")}&per_page=6`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`)
    }

    const data: PexelsResponse = await response.json()

    // Extract the medium-sized image URLs
    return data.photos.map((photo) => photo.src.medium)
  } catch (error) {
    console.error("Error fetching inspiration images:", error)
    return []
  }
}
