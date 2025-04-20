"use client"

import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserNav } from "@/components/dashboard/user-nav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-40 border-b border-gold-500/20 bg-black/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gold-500">Tattzy</span>
            </Link>
          </div>
          <UserNav />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px] border-r border-gold-500/10 py-8">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden py-8">{children}</main>
      </div>
    </div>
  )
}

function DashboardNav() {
  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "My Designs",
      href: "/dashboard/designs",
      icon: "image",
    },
    {
      title: "Create New",
      href: "/dashboard/create",
      icon: "plus",
    },
    {
      title: "Favorites",
      href: "/dashboard/favorites",
      icon: "heart",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ]

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon as keyof typeof Icons] || Icons.arrowRight
        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "justify-start gap-2 px-2 text-gold-300 hover:text-gold-500 hover:bg-gold-500/10",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
