"use client"

import * as React from "react"
import {
  ActivityIcon,
  BarChartIcon,
  CreditCardIcon,
  DatabaseIcon,
  GitBranchIcon,
  ImageIcon,
  LayoutDashboardIcon,
  PaletteIcon,
  SettingsIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const adminData = {
  user: {
    name: "Admin",
    email: "admin@tattty.com",
    avatar: "/placeholder-user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: UsersIcon,
    },
    {
      title: "Generations",
      url: "/admin/generations",
      icon: ImageIcon,
    },
    {
      title: "Pipeline",
      url: "/admin/pipeline",
      icon: GitBranchIcon,
    },
    {
      title: "Batch Calls",
      url: "/admin/batch",
      icon: ZapIcon,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Credits",
      url: "/admin/credits",
      icon: CreditCardIcon,
    },
    {
      title: "Activity Logs",
      url: "/admin/activity",
      icon: ActivityIcon,
    },
    {
      title: "Database",
      url: "/admin/database",
      icon: DatabaseIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: SettingsIcon,
    },
    {
      title: "Style Library",
      url: "/admin/styles",
      icon: PaletteIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <PaletteIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Tattty Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminData.navMain} />
        <NavSecondary items={adminData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={adminData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
