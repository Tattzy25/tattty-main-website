import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { getUserFinances, Finance } from "@/lib/admin/finance-data"
import { Badge } from "@/components/ui/badge"

export default async function FinancePage() {
  const finances = await getUserFinances(20)

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                    <CardDescription>
                      Manage subscription revenue, transaction history and payment status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Session ID</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Operation</TableHead>
                          <TableHead>Tokens</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Model</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {finances.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No financial data available
                            </TableCell>
                          </TableRow>
                        ) : (
                          finances.map((finance) => (
                            <TableRow key={finance.id}>
                              <TableCell className="font-mono text-xs">
                                {finance.sessionId.slice(0, 8)}...
                              </TableCell>
                              <TableCell>{finance.service}</TableCell>
                              <TableCell>{finance.operation}</TableCell>
                              <TableCell>{finance.tokensUsed || 'N/A'}</TableCell>
                              <TableCell>${finance.cost.toFixed(4)}</TableCell>
                              <TableCell className="text-xs">{finance.modelUsed || 'N/A'}</TableCell>
                              <TableCell>
                                {new Date(finance.createdAt).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}