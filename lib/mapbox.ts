// Mapbox utility functions for location services
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

// Function to geocode an address to coordinates
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address,
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`,
    )

    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center
      return { lat, lng }
    }

    return null
  } catch (error) {
    console.error("Error geocoding address:", error)
    return null
  }
}

// Function to reverse geocode coordinates to an address
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`,
    )

    const data = await response.json()

    if (data.features && data.features.length > 0) {
      return data.features[0].place_name
    }

    return null
  } catch (error) {
    console.error("Error reverse geocoding:", error)
    return null
  }
}

// Function to get nearby locations
export async function getNearbyLocations(lat: number, lng: number, radius = 50): Promise<any[]> {
  // Mapbox doesn't have a direct "nearby" API, so we're using the bounding box approach
  // Convert radius from km to degrees (approximate)
  const latDegrees = radius / 111
  const lngDegrees = radius / (111 * Math.cos(lat * (Math.PI / 180)))

  const bounds = [
    lng - lngDegrees, // west
    lat - latDegrees, // south
    lng + lngDegrees, // east
    lat + latDegrees, // north
  ].join(",")

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/tattoo.json?access_token=${MAPBOX_ACCESS_TOKEN}&bbox=${bounds}&limit=10`,
    )

    const data = await response.json()
    return data.features || []
  } catch (error) {
    console.error("Error getting nearby locations:", error)
    return []
  }
}

// Calculate distance between two points in km
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLng = deg2rad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}
