import { AppSidebar } from "@/components/admin/app-sidebar"
import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive"
import { DataTable } from "@/components/admin/data-table"
import { SectionCards } from "@/components/admin/section-cards"
import { SiteHeader } from "@/components/admin/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getAdminDashboardData } from "@/lib/admin/dashboard-data"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const dashboardData = await getAdminDashboardData()

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards data={dashboardData.cards} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={dashboardData.chartData} />
              </div>
              <DataTable data={dashboardData.tableData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
