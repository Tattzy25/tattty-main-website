import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSqlClient } from "@/lib/neon"

interface TokenUsage {
  service: string
  totalTokens: number
  totalCost: number
  apiCalls: number
}

async function getTokenUsage(): Promise<TokenUsage[]> {
  const sql = getSqlClient()
  if (!sql) {
    return []
  }

  try {
    const result = await sql`
      SELECT 
        service,
        SUM(tokens_used) as total_tokens,
        SUM(cost_usd) as total_cost,
        COUNT(*) as api_calls
      FROM session_costs
      GROUP BY service
      ORDER BY total_cost DESC
    `

    const rows = result as any[]
    return rows.map((row: any) => ({
      service: row.service,
      totalTokens: Number(row.total_tokens || 0),
      totalCost: Number(row.total_cost || 0),
      apiCalls: Number(row.api_calls || 0)
    }))
  } catch (error) {
    console.error("Error fetching token usage:", error)
    return []
  }
}

export default async function TokensPage() {
  const tokenUsage = await getTokenUsage()

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Token Management</h1>
              <p className="text-muted-foreground">Track API token usage and costs</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tokenUsage.map((usage) => (
              <Card key={usage.service}>
                <CardHeader>
                  <CardTitle>{usage.service}</CardTitle>
                  <CardDescription>Service usage statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tokens Used</span>
                      <span className="text-sm font-medium">{usage.totalTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Cost</span>
                      <span className="text-sm font-medium">${usage.totalCost.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">API Calls</span>
                      <span className="text-sm font-medium">{usage.apiCalls.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {tokenUsage.length === 0 && (
            <Card>
              <CardContent className="flex h-[200px] items-center justify-center">
                <p className="text-muted-foreground">No token usage data available</p>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
