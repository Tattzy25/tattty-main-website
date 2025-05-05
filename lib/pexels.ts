import { PEXELS_API_KEY } from "@/lib/config"

interface PexelsImage {
  id: string
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  src: {
    original: string
    large: string
    medium: string
    small: string
    tiny: string
  }
}

interface PexelsResponse {
  total_results: number
  page: number
  per_page: number
  photos: PexelsImage[]
  next_page: string
}

export async function getInspirationImages(query: string, page = 1, perPage = 15): Promise<PexelsImage[]> {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + " tattoo")}&page=${page}&per_page=${perPage}`,
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
    return data.photos
  } catch (error) {
    console.error("Error fetching inspiration images:", error)
    return []
  }
}
