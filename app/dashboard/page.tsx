import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Dashboard | Tattty",
  description: "Manage your tattoo designs",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gold-500">Dashboard</h1>
          <Link href="/dashboard/create">
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
            href="/dashboard/create"
          />
          <DashboardCard
            title="Favorites"
            description="Access your saved favorite designs"
            icon="heart"
            href="/dashboard/favorites"
          />
          <DashboardCard
            title="Export"
            description="Export your designs in various formats"
            icon="download"
            href="/dashboard/export"
          />
          <DashboardCard
            title="AR Preview"
            description="Visualize your tattoo with augmented reality"
            icon="share"
            href="/dashboard/ar-preview"
          />
          <DashboardCard
            title="Settings"
            description="Manage your account settings"
            icon="settings"
            href="/dashboard/settings"
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight text-gold-500 mb-4">Recent Designs</h2>
          <RecentDesigns />
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

function RecentDesigns() {
  // Mock data for recent designs
  const recentDesigns = [
    {
      id: "1",
      name: "Dragon Tattoo",
      description: "A fierce dragon design for upper arm",
      image: "/placeholder.svg?height=200&width=200",
      createdAt: "2023-05-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Floral Sleeve",
      description: "Elegant floral pattern for full sleeve",
      image: "/placeholder.svg?height=200&width=200",
      createdAt: "2023-06-20T14:30:00Z",
    },
    {
      id: "3",
      name: "Geometric Wolf",
      description: "Modern geometric wolf design",
      image: "/placeholder.svg?height=200&width=200",
      createdAt: "2023-07-05T09:15:00Z",
    },
  ]

  if (recentDesigns.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed border-gold-500/20 p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <Icons.image className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-gold-500">No designs created</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven&apos;t created any designs yet. Start creating your first tattoo design.
          </p>
          <Link href="/dashboard/create">
            <Button className="mt-4 bg-gold-500 hover:bg-gold-600 text-black">Create your first design</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recentDesigns.map((design) => (
        <Card key={design.id} className="overflow-hidden border-gold-500/20 bg-black/40">
          <div className="aspect-square relative">
            <img src={design.image || "/placeholder.svg"} alt={design.name} className="object-cover w-full h-full" />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gold-500">{design.name}</h3>
            <p className="text-sm text-muted-foreground">{design.description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Created on {new Date(design.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button variant="outline" size="sm" className="border-gold-500/30 hover:bg-gold-500/10">
              <Link href={`/dashboard/designs/${design.id}`}>Edit</Link>
            </Button>
            <Button variant="outline" size="sm" className="border-gold-500/30 hover:bg-gold-500/10">
              <Icons.download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
