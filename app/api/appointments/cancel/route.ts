import { cancelAppointment } from "@/app/actions/appointments"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const appointmentId = searchParams.get("id")

  if (!appointmentId) {
    return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 })
  }

  const result = await cancelAppointment(appointmentId)

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
