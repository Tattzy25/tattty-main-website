import { NextResponse } from "next/server"

const PEXELS_API_KEY = process.env.PEXELS_API_KEY

export async function GET(request: Request) {
  if (!PEXELS_API_KEY) {
    throw new Error('PEXELS_API_KEY is not configured in environment variables')
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || 'tattoo'
  const perPage = parseInt(searchParams.get('per_page') || '20')

  console.log(`[PEXELS API] Fetching images for query: "${query}", per_page: ${perPage}`)

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=portrait`
  console.log(`[PEXELS API] Request URL: ${url}`)

  const response = await fetch(url, {
    headers: {
      'Authorization': PEXELS_API_KEY
    }
  })

  console.log(`[PEXELS API] Response status: ${response.status}`)

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`[PEXELS API ERROR] Status: ${response.status}, Response: ${errorText}`)
    throw new Error(`Pexels API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  if (!data.photos || !Array.isArray(data.photos) || data.photos.length === 0) {
    console.error(`[PEXELS API ERROR] No photos returned. Response:`, JSON.stringify(data))
    throw new Error(`No photos returned from Pexels API for query: ${query}`)
  }

  // Transform Pexels response to our format
  const images = data.photos.map((photo: any) => ({
    url: photo.src.medium,
    label: `Photo by ${photo.photographer}`,
    originalUrl: photo.src.original,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url
  }))

  console.log(`[PEXELS API SUCCESS] Returned ${images.length} images for query: "${query}"`)

  return NextResponse.json(images)
}