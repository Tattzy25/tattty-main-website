import { FindArtistsMap } from "@/components/dashboard/find-artists-map"
import { DashboardLayout } from "@/components/dashboard/layout"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export const metadata = {
  title: "Find Artists | Tattty",
  description: "Find tattoo artists near you",
}

export default async function FindArtistsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gold-500">Find Artists Near You</h1>
        </div>
        <FindArtistsMap />
      </div>
    </DashboardLayout>
  )
}
