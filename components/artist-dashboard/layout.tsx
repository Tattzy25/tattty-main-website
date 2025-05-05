"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserNav } from "@/components/dashboard/user-nav"
import { supabase } from "@/lib/supabase"

interface ArtistDashboardLayoutProps {
  children: React.ReactNode
}

export function ArtistDashboardLayout({ children }: ArtistDashboardLayoutProps) {
  const pathname = usePathname()
  const [artistProfile, setArtistProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArtistProfile()
  }, [])

  const fetchArtistProfile = async () => {
    try {
      setLoading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get artist profile
      const { data: artistData } = await supabase.from("artist_profiles").select("*").eq("id", user.id).single()

      setArtistProfile(artistData)
    } catch (error) {
      console.error("Error fetching artist profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-40 border-b border-gold-500/20 bg-black/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gold-500">Tattty</span>
            </Link>
            <span className="text-sm text-gold-300 bg-gold-500/10 px-2 py-1 rounded-md">Artist Portal</span>
          </div>
          <UserNav isArtist={true} />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px] border-r border-gold-500/10 py-8">
          <ArtistDashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden py-8">{children}</main>
      </div>
    </div>
  )
}

function ArtistDashboardNav() {
  const pathname = usePathname()

  const items = [
    {
      title: "Dashboard",
      href: "/artist-dashboard",
      icon: "dashboard",
    },
    {
      title: "Portfolio",
      href: "/artist-dashboard/portfolio",
      icon: "image",
    },
    {
      title: "Albums",
      href: "/artist-dashboard/albums",
      icon: "folder",
    },
    {
      title: "Location",
      href: "/artist-dashboard/location",
      icon: "mapPin",
    },
    {
      title: "Appointments",
      href: "/artist-dashboard/appointments",
      icon: "calendar",
    },
    {
      title: "Messages",
      href: "/artist-dashboard/messages",
      icon: "messageSquare",
    },
    {
      title: "Analytics",
      href: "/artist-dashboard/analytics",
      icon: "barChart",
    },
    {
      title: "Settings",
      href: "/artist-dashboard/settings",
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
              "justify-start gap-2 px-2",
              pathname === item.href
                ? "bg-gold-500/10 text-gold-500"
                : "text-gold-300 hover:text-gold-500 hover:bg-gold-500/10",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}

      <div className="mt-6 pt-6 border-t border-gold-500/10">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start gap-2 px-2 text-gold-300 hover:text-gold-500 hover:bg-gold-500/10",
          )}
        >
          <Icons.user className="h-4 w-4" />
          Switch to User Dashboard
        </Link>
      </div>
    </nav>
  )
}
