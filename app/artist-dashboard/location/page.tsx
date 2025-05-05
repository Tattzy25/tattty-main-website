import { LocationSettings } from "@/components/artist-dashboard/location-settings"
import { ArtistDashboardLayout } from "@/components/artist-dashboard/layout"

export const metadata = {
  title: "Location Settings | Artist Dashboard | Tattty",
  description: "Manage your studio location and travel schedule",
}

export default function LocationPage() {
  return (
    <ArtistDashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gold-500">Location Settings</h1>
        </div>
        <LocationSettings />
      </div>
    </ArtistDashboardLayout>
  )
}
