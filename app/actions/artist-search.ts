"use server"

import { supabase } from "@/lib/supabase"

// Calculate distance between two points in km
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
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

export interface ArtistSearchFilters {
  styles?: string[]
  priceRange?: string
  experienceLevel?: string
  isVerifiedOnly?: boolean
  isTravelingOnly?: boolean
  hasAppointmentsOnly?: boolean
  sortBy?: string
}

export async function searchArtistsByLocation(lat: number, lng: number, radius = 25, filters?: ArtistSearchFilters) {
  try {
    // Calculate bounding box for the search radius
    const latDegrees = radius / 111
    const lngDegrees = radius / (111 * Math.cos(lat * (Math.PI / 180)))

    const minLat = lat - latDegrees
    const maxLat = lat + latDegrees
    const minLng = lng - lngDegrees
    const maxLng = lng + lngDegrees

    // Start building the query
    let query = supabase
      .from("artist_profiles")
      .select(`
        *,
        user_profiles(display_name, avatar_url),
        artist_availability(*)
      `)
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .gte("latitude", minLat)
      .lte("latitude", maxLat)
      .gte("longitude", minLng)
      .lte("longitude", maxLng)

    // Apply filters if provided
    if (filters) {
      // Filter by verification status
      if (filters.isVerifiedOnly) {
        query = query.eq("is_verified", true)
      }

      // Filter by traveling status
      if (filters.isTravelingOnly) {
        query = query.eq("is_traveling_artist", true)
      }

      // Filter by price range
      if (filters.priceRange && filters.priceRange !== "any") {
        query = query.eq("price_range", filters.priceRange)
      }

      // Filter by experience level
      if (filters.experienceLevel && filters.experienceLevel !== "any") {
        switch (filters.experienceLevel) {
          case "beginner":
            query = query.lte("years_experience", 2)
            break
          case "intermediate":
            query = query.gte("years_experience", 3).lte("years_experience", 5)
            break
          case "experienced":
            query = query.gte("years_experience", 6).lte("years_experience", 10)
            break
          case "expert":
            query = query.gte("years_experience", 10)
            break
        }
      }

      // Filter by available appointments
      if (filters.hasAppointmentsOnly) {
        // This would require a join with the appointments table
        // For now, we'll handle this filter in memory after fetching the data
      }
    }

    // Execute the query
    const { data, error } = await query

    if (error) throw error

    // Filter artists by actual distance (more accurate than bounding box)
    const filteredArtists = data.filter((artist) => {
      const distance = calculateDistance(lat, lng, artist.latitude, artist.longitude)
      artist.distance = distance // Add distance to artist object
      return distance <= radius
    })

    // Apply style filters in memory (since arrays require special handling)
    let finalArtists = filteredArtists
    if (filters?.styles && filters.styles.length > 0) {
      finalArtists = finalArtists.filter((artist) => {
        const artistStyles = artist.specialties || []
        return filters.styles!.some((style) => artistStyles.includes(style))
      })
    }

    // Apply available appointments filter in memory
    if (filters?.hasAppointmentsOnly) {
      finalArtists = finalArtists.filter((artist) => {
        return (
          artist.artist_availability &&
          artist.artist_availability.some((slot: any) => new Date(slot.date) >= new Date() && slot.is_available)
        )
      })
    }

    // Sort results
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "distance":
          finalArtists.sort((a, b) => a.distance - b.distance)
          break
        case "price_low":
          const priceOrder = { budget: 1, mid: 2, premium: 3, luxury: 4 }
          finalArtists.sort((a, b) => (priceOrder[a.price_range] || 0) - (priceOrder[b.price_range] || 0))
          break
        case "price_high":
          const priceOrderHigh = { budget: 1, mid: 2, premium: 3, luxury: 4 }
          finalArtists.sort((a, b) => (priceOrderHigh[b.price_range] || 0) - (priceOrderHigh[a.price_range] || 0))
          break
        case "experience":
          finalArtists.sort((a, b) => (b.years_experience || 0) - (a.years_experience || 0))
          break
      }
    } else {
      // Default sort by distance
      finalArtists.sort((a, b) => a.distance - b.distance)
    }

    return { artists: finalArtists }
  } catch (error) {
    console.error("Error searching for artists:", error)
    return { error: "Failed to search for artists" }
  }
}

export async function searchTravelingArtists(location: string, date: string, filters?: ArtistSearchFilters) {
  try {
    // Query artists who have travel schedules that include this location and date
    let query = supabase
      .from("artist_travel_schedule")
      .select("*, artist_profiles(*)")
      .ilike("location", `%${location}%`)
      .lte("start_date", date)
      .gte("end_date", date)

    // Apply filters to the artist_profiles
    if (filters) {
      if (filters.isVerifiedOnly) {
        query = query.eq("artist_profiles.is_verified", true)
      }

      if (filters.priceRange && filters.priceRange !== "any") {
        query = query.eq("artist_profiles.price_range", filters.priceRange)
      }

      // Experience level filtering would be applied in memory
    }

    const { data, error } = await query

    if (error) throw error

    // Extract artist profiles and apply additional filters in memory
    let artists = data.map((schedule) => schedule.artist_profiles)

    // Apply style filters
    if (filters?.styles && filters.styles.length > 0) {
      artists = artists.filter((artist) => {
        const artistStyles = artist.specialties || []
        return filters.styles!.some((style) => artistStyles.includes(style))
      })
    }

    // Apply experience level filters
    if (filters?.experienceLevel && filters.experienceLevel !== "any") {
      artists = artists.filter((artist) => {
        switch (filters!.experienceLevel) {
          case "beginner":
            return artist.years_experience <= 2
          case "intermediate":
            return artist.years_experience >= 3 && artist.years_experience <= 5
          case "experienced":
            return artist.years_experience >= 6 && artist.years_experience <= 10
          case "expert":
            return artist.years_experience >= 10
          default:
            return true
        }
      })
    }

    // Sort results
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "price_low":
          const priceOrder = { budget: 1, mid: 2, premium: 3, luxury: 4 }
          artists.sort((a, b) => (priceOrder[a.price_range] || 0) - (priceOrder[b.price_range] || 0))
          break
        case "price_high":
          const priceOrderHigh = { budget: 1, mid: 2, premium: 3, luxury: 4 }
          artists.sort((a, b) => (priceOrderHigh[b.price_range] || 0) - (priceOrderHigh[a.price_range] || 0))
          break
        case "experience":
          artists.sort((a, b) => (b.years_experience || 0) - (a.years_experience || 0))
          break
      }
    }

    return { artists }
  } catch (error) {
    console.error("Error searching for traveling artists:", error)
    return { error: "Failed to search for traveling artists" }
  }
}

export async function getArtistLocationDetails(artistId: string) {
  try {
    // Get artist location details
    const { data, error } = await supabase
      .from("artist_profiles")
      .select(`
        id, 
        business_name, 
        location, 
        latitude, 
        longitude, 
        is_traveling_artist, 
        service_radius,
        price_range,
        years_experience,
        specialties
      `)
      .eq("id", artistId)
      .single()

    if (error) throw error

    // If artist is traveling, get their travel schedule
    let travelSchedule = []
    if (data.is_traveling_artist) {
      const { data: scheduleData, error: scheduleError } = await supabase
        .from("artist_travel_schedule")
        .select("*")
        .eq("artist_id", artistId)
        .order("start_date", { ascending: true })

      if (scheduleError) throw scheduleError
      travelSchedule = scheduleData
    }

    return { artist: data, travelSchedule }
  } catch (error) {
    console.error("Error getting artist location details:", error)
    return { error: "Failed to get artist location details" }
  }
}
