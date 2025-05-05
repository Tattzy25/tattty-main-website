import { getAppointments } from "@/app/actions/appointments"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { CalendarX2, Clock } from "lucide-react"
import Image from "next/image"
import { AppointmentForm } from "@/components/dashboard/appointment-form"

export default async function AppointmentsPage() {
  const { appointments, error } = await getAppointments()

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Appointments</h1>
        <AppointmentForm />
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading appointments: {error}
        </div>
      ) : appointments && appointments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <CalendarX2 className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No appointments yet</h2>
          <p className="text-gray-500 mb-6">Schedule a consultation with one of our artists</p>
          <AppointmentForm />
        </div>
      )}
    </div>
  )
}

function AppointmentCard({ appointment }: { appointment: any }) {
  const formattedDate = format(new Date(appointment.appointment_date), "MMMM d, yyyy")
  const statusColor =
    {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    }[appointment.status] || "bg-gray-100 text-gray-800"

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{appointment.artists?.name || "Artist"}</CardTitle>
            <CardDescription>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1" />
                {appointment.appointment_time}
              </div>
            </CardDescription>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          {appointment.artists?.profile_image ? (
            <Image
              src={appointment.artists.profile_image || "/placeholder.svg"}
              alt={appointment.artists.name}
              width={48}
              height={48}
              className="rounded-full mr-3"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-3" />
          )}
          <div>
            <div className="font-medium">{formattedDate}</div>
            <div className="text-sm text-gray-500">Consultation</div>
          </div>
        </div>

        {appointment.notes && (
          <>
            <Separator className="my-3" />
            <div className="text-sm">
              <div className="font-medium mb-1">Notes:</div>
              <div className="text-gray-600">{appointment.notes}</div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {appointment.status === "pending" || appointment.status === "confirmed" ? (
          <form action={`/api/appointments/cancel?id=${appointment.id}`} method="POST" className="w-full">
            <Button variant="outline" className="w-full" type="submit">
              Cancel Appointment
            </Button>
          </form>
        ) : null}
      </CardFooter>
    </Card>
  )
}
