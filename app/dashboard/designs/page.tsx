import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DesignGrid } from "@/components/dashboard/design-grid"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "My Designs | Tattty",
  description: "View and manage your tattoo designs",
}

export default function DesignsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gold-500">My Designs</h1>
          <Link href="/dashboard/create">
            <Button className="bg-gold-500 hover:bg-gold-600 text-black">
              <Icons.plus className="mr-2 h-4 w-4" />
              Create New Design
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-gold-500/30 hover:bg-gold-500/10">
            <Icons.grid className="mr-2 h-4 w-4" />
            All Designs
          </Button>
          <Button variant="outline" className="border-gold-500/30 hover:bg-gold-500/10">
            <Icons.heart className="mr-2 h-4 w-4" />
            Favorites
          </Button>
          <Button variant="outline" className="border-gold-500/30 hover:bg-gold-500/10">
            <Icons.download className="mr-2 h-4 w-4" />
            Downloaded
          </Button>
        </div>

        <DesignGrid />
      </div>
    </DashboardLayout>
  )
}
