import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Icons } from "@/components/icons"
import { getUserDesigns } from "@/lib/supabase"
import { getSession } from "@/lib/auth"
import { DesignHistory } from "@/components/dashboard/design-history"

export const metadata: Metadata = {
  title: "Dashboard | Tattty",
  description: "Manage your tattoo designs",
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const designs = await getUserDesigns(session.user.id)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gold-500">Dashboard</h1>
          <Link href="/tattoo-generator">
            <Button className="bg-gold-500 hover:bg-gold-600 text-black">
              <Icons.plus className="mr-2 h-4 w-4" />
              Create New Design
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="My Designs"
            description="View and manage all your tattoo designs"
            icon="image"
            href="/dashboard/designs"
          />
          <DashboardCard
            title="Create New"
            description="Generate a new tattoo design with AI"
            icon="plus"
            href="/tattoo-generator"
          />
          <DashboardCard
            title="AR Preview"
            description="Visualize your tattoo with augmented reality"
            icon="share"
            href="/dashboard/ar-preview"
          />
          <DashboardCard
            title="Find Artists"
            description="Connect with tattoo artists near you"
            icon="search"
            href="/artists"
          />
          <DashboardCard
            title="Appointments"
            description="Manage your tattoo appointments"
            icon="calendar"
            href="/dashboard/appointments"
          />
          <DashboardCard
            title="Messages"
            description="Chat with tattoo artists"
            icon="messageSquare"
            href="/dashboard/messages"
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight text-gold-500 mb-4">Recent Designs</h2>
          <DesignHistory designs={designs.slice(0, 6)} />
        </div>
      </div>
    </DashboardLayout>
  )
}

function DashboardCard({
  title,
  description,
  icon,
  href,
}: {
  title: string
  description: string
  icon: keyof typeof Icons
  href: string
}) {
  const Icon = Icons[icon]
  return (
    <Card className="border-gold-500/20 bg-black/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-gold-500/10 p-2">
            <Icon className="h-5 w-5 text-gold-500" />
          </div>
          <CardTitle className="text-gold-500">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button variant="outline" className="w-full border-gold-500/30 hover:bg-gold-500/10 text-gold-300">
            View
            <Icons.arrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
