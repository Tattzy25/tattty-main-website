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
import { Badge } from "@/components/ui/badge"
import { 
  getUsersList,
  getUsersBySubscriptionTier,
  User,
  TierStats
} from "@/lib/admin/users-data"
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function UsersPage() {
  const users = await getUsersList(50)
  const tierStats = await getUsersBySubscriptionTier()

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Subscription Tiers</CardTitle>
                    <CardDescription>
                      Overview of users by subscription tier
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {tierStats.map((tier) => (
                        <Card key={tier.tier} className="bg-muted/50">
                          <CardContent className="p-4 flex flex-col items-center">
                            <div className="text-2xl font-bold">{tier.count}</div>
                            <div className="text-sm text-muted-foreground">
                              {tier.tier} Users
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      View and manage user accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all">
                      <TabsList className="mb-4">
                        <TabsTrigger value="all">All Users</TabsTrigger>
                        <TabsTrigger value="premium">Premium</TabsTrigger>
                        <TabsTrigger value="free">Free</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all">
                        <ScrollArea className="h-[400px]">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Subscription</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {users.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={7} className="h-24 text-center">
                                    No users available
                                  </TableCell>
                                </TableRow>
                              ) : (
                                users.map((user) => (
                                  <TableRow key={user.id}>
                                    <TableCell className="font-mono text-xs">
                                      {user.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.name || 'N/A'}</TableCell>
                                    <TableCell>
                                      {user.subscriptionTier === 'premium' ? (
                                        <Badge>Premium</Badge>
                                      ) : user.subscriptionTier === 'free' ? (
                                        <Badge variant="outline">Free</Badge>
                                      ) : (
                                        <Badge variant="secondary">{user.subscriptionTier}</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {user.status === 'active' ? (
                                        <Badge variant="default">Active</Badge>
                                      ) : (
                                        <Badge variant="secondary">Inactive</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      <Button variant="ghost" size="sm">
                                        Edit
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </TabsContent>
                      {/* Other tabs would filter the same data */}
                    </Tabs>
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