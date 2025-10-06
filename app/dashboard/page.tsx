import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { RecentGenerationsTable } from "@/components/recent-generations-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { FloatingChatWidget } from "@/components/admin/floating-chat-widget"
import { getDashboardStats, getRecentGenerations, getGenerationTrends } from "@/lib/dashboard-data"

export default async function Page() {
  const stats = await getDashboardStats()
  const recentGenerations = await getRecentGenerations(20)
  const generationTrends = await getGenerationTrends(90)

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards stats={stats} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={generationTrends} />
              </div>
              <RecentGenerationsTable data={recentGenerations} />
            </div>
          </div>
        </div>
        <FloatingChatWidget />
      </SidebarInset>
    </SidebarProvider>
  )
}
