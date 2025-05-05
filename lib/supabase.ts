import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

// User profile functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, profile: any) {
  const { data, error } = await supabase.from("user_profiles").update(profile).eq("id", userId).select().single()

  if (error) throw error
  return data
}

// Artist profile functions
export async function getArtistProfile(userId: string) {
  const { data, error } = await supabase.from("artist_profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export async function updateArtistProfile(userId: string, profile: any) {
  const { data, error } = await supabase.from("artist_profiles").update(profile).eq("id", userId).select().single()

  if (error) throw error
  return data
}

export async function createArtistProfile(profile: any) {
  const { data, error } = await supabase.from("artist_profiles").insert(profile).select().single()

  if (error) throw error
  return data
}

// Tattoo design functions
export async function saveTattooDesign(design: any) {
  const { data, error } = await supabase.from("tattoo_designs").insert(design).select().single()

  if (error) throw error
  return data
}

export async function getUserDesigns(userId: string) {
  const { data, error } = await supabase
    .from("tattoo_designs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getDesignById(designId: string) {
  const { data, error } = await supabase.from("tattoo_designs").select("*").eq("id", designId).single()

  if (error) throw error
  return data
}

// Artist portfolio functions
export async function getArtistPortfolio(artistId: string) {
  const { data, error } = await supabase
    .from("artist_portfolios")
    .select("*")
    .eq("artist_id", artistId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function addPortfolioItem(item: any) {
  const { data, error } = await supabase.from("artist_portfolios").insert(item).select().single()

  if (error) throw error
  return data
}

// Album functions
export async function getArtistAlbums(artistId: string) {
  const { data, error } = await supabase
    .from("artist_albums")
    .select("*, album_images(*)")
    .eq("artist_id", artistId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createAlbum(album: any) {
  const { data, error } = await supabase.from("artist_albums").insert(album).select().single()

  if (error) throw error
  return data
}

export async function addImageToAlbum(image: any) {
  const { data, error } = await supabase.from("album_images").insert(image).select().single()

  if (error) throw error
  return data
}

// Appointment functions
export async function createAppointment(appointment: any) {
  const { data, error } = await supabase.from("appointments").insert(appointment).select().single()

  if (error) throw error
  return data
}

export async function getUserAppointments(userId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*, artist_profiles(*)")
    .eq("user_id", userId)
    .order("date", { ascending: true })

  if (error) throw error
  return data
}

export async function getArtistAppointments(artistId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*, user_profiles(*), tattoo_designs(*)")
    .eq("artist_id", artistId)
    .order("date", { ascending: true })

  if (error) throw error
  return data
}

// Chat functions
export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      artist_profiles!artist_id(*),
      user_profiles!user_id(*)
    `)
    .or(`artist_id.eq.${userId},user_id.eq.${userId}`)
    .order("updated_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data
}

export async function sendMessage(message: any) {
  const { data, error } = await supabase.from("messages").insert(message).select().single()

  if (error) throw error

  // Update conversation updated_at
  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", message.conversation_id)

  return data
}

// Artist of the month
export async function getArtistOfTheMonth() {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const { data, error } = await supabase
    .from("artist_of_the_month")
    .select(`
      *,
      artist_profiles(*),
      artist_portfolios(*)
    `)
    .eq("month", month)
    .eq("year", year)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

// Analytics functions
export async function trackAnalytics(style: string, theme: string) {
  const { data, error } = await supabase.from("analytics").select("*").eq("style", style).eq("theme", theme).single()

  if (error && error.code === "PGRST116") {
    // Not found, create new record
    const { error: insertError } = await supabase.from("analytics").insert({ style, theme })

    if (insertError) throw insertError
  } else if (error) {
    throw error
  } else {
    // Update existing record
    const { error: updateError } = await supabase
      .from("analytics")
      .update({ count: data.count + 1, updated_at: new Date().toISOString() })
      .eq("id", data.id)

    if (updateError) throw updateError
  }
}

export async function getPopularStyles() {
  const { data, error } = await supabase
    .from("analytics")
    .select("style, sum(count) as total_count")
    .group("style")
    .order("total_count", { ascending: false })
    .limit(10)

  if (error) throw error
  return data
}

export async function getPopularThemes() {
  const { data, error } = await supabase
    .from("analytics")
    .select("theme, sum(count) as total_count")
    .group("theme")
    .order("total_count", { ascending: false })
    .limit(10)

  if (error) throw error
  return data
}
