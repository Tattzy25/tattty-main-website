"use server"

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function createAppointment(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  const artistId = formData.get("artistId") as string
  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const notes = formData.get("notes") as string

  if (!artistId || !date || !time) {
    return { error: "Missing required fields" }
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      user_id: session.user.id,
      artist_id: artistId,
      appointment_date: date,
      appointment_time: time,
      notes: notes || "",
      status: "pending",
    })
    .select()

  if (error) {
    console.error("Error creating appointment:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard/appointments")
  return { success: true, data }
}

export async function getAppointments() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("appointments")
    .select(`
      *,
      artists:artist_id (
        id,
        name,
        profile_image
      )
    `)
    .eq("user_id", session.user.id)
    .order("appointment_date", { ascending: true })

  if (error) {
    console.error("Error fetching appointments:", error)
    return { error: error.message }
  }

  return { appointments: data }
}

export async function cancelAppointment(appointmentId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  // First verify this appointment belongs to the user
  const { data: appointment, error: fetchError } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", appointmentId)
    .eq("user_id", session.user.id)
    .single()

  if (fetchError || !appointment) {
    return { error: "Appointment not found or access denied" }
  }

  const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", appointmentId)

  if (error) {
    console.error("Error cancelling appointment:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard/appointments")
  return { success: true }
}
