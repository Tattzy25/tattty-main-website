"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArtistDashboardLayout } from "@/components/artist-dashboard/layout"
import { Icons } from "@/components/icons"
import { supabase } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"

export default function ArtistDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [artistProfile, setArtistProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    portfolioCount: 0,
    albumCount: 0,
    appointmentCount: 0,
    messageCount: 0,
  })
  const [recentAppointments, setRecentAppointments] = useState<any[]>([])

  useEffect(() => {
    checkAuth()
    fetchArtistData()
  }, [])

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      router.push("/auth/login")
    }
  }

  const fetchArtistData = async () => {
    try {
      setLoading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get artist profile
      const { data: artistData, error: artistError } = await supabase
        .from("artist_profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (artistError && artistError.code !== "PGRST116") {
        throw artistError
      }

      // If no artist profile, redirect to create one
      if (!artistData) {
        router.push("/artist-dashboard/create-profile")
        return
      }

      setArtistProfile(artistData)

      // Get portfolio count
      const { count: portfolioCount } = await supabase
        .from("artist_portfolios")
        .select("*", { count: "exact", head: true })
        .eq("artist_id", user.id)

      // Get album count
      const { count: albumCount } = await supabase
        .from("artist_albums")
        .select("*", { count: "exact", head: true })
        .eq("artist_id", user.id)

      // Get appointment count
      const { count: appointmentCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("artist_id", user.id)

      // Get unread message count
      const { count: messageCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("conversation_id", supabase.from("conversations").select("id").eq("artist_id", user.id))
        .eq("is_read", false)
        .not("sender_id", "eq", user.id)

      setStats({
        portfolioCount: portfolioCount || 0,
        albumCount: albumCount || 0,
        appointmentCount: appointmentCount || 0,
        messageCount: messageCount || 0,
      })

      // Get recent appointments
      const { data: appointments } = await supabase
        .from("appointments")
        .select(`
          *,
          user_profiles(*)
        `)
        .eq("artist_id", user.id)
        .order("date", { ascending: true })
        .limit(5)

      setRecentAppointments(appointments || [])
    } catch (error) {
      console.error("Error fetching artist data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ArtistDashboardLayout>
        <div className="flex justify-center items-center h-[500px]">
          <Icons.spinner className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      </ArtistDashboardLayout>
    )
  }

  return (
    <ArtistDashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gold-500">Artist Dashboard</h1>
          <Button asChild className="bg-gold-500 hover:bg-gold-600 text-black">
            <a href="/artist-dashboard/portfolio/add">
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Portfolio Item
            </a>
          </Button>
        </div>

        {/* Artist Profile Summary */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gold-500/30">
              <Image
                src={artistProfile.avatar_url || "/placeholder.svg?height=128&width=128"}
                alt={artistProfile.business_name || "Artist"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gold-500">{artistProfile.business_name}</h2>
              <p className="text-zinc-400">{artistProfile.location}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                {artistProfile.specialties?.map((specialty: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-gold-500/10 px-2.5 py-0.5 text-xs font-medium text-gold-500"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-zinc-300 max-w-2xl">{artistProfile.bio}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="border-gold-500/30 hover:bg-gold-500/10 text-gold-300">
                <a href="/artist-dashboard/profile">
                  <Icons.edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </a>
              </Button>
              <Button asChild variant="outline" className="border-gold-500/30 hover:bg-gold-500/10 text-gold-300">
                <a href="/artists/preview">
                  <Icons.eye className="mr-2 h-4 w-4" />
                  View Public Profile
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Portfolio Items"
            value={stats.portfolioCount}
            icon="image"
            href="/artist-dashboard/portfolio"
          />
          <StatCard title="Albums" value={stats.albumCount} icon="folder" href="/artist-dashboard/albums" />
          <StatCard
            title="Appointments"
            value={stats.appointmentCount}
            icon="calendar"
            href="/artist-dashboard/appointments"
          />
          <StatCard
            title="Unread Messages"
            value={stats.messageCount}
            icon="messageSquare"
            href="/artist-dashboard/messages"
            highlight={stats.messageCount > 0}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Portfolio"
            description="Manage your tattoo portfolio"
            icon="image"
            href="/artist-dashboard/portfolio"
          />
          <DashboardCard
            title="Albums"
            description="Organize your work into albums"
            icon="folder"
            href="/artist-dashboard/albums"
          />
          <DashboardCard
            title="Appointments"
            description="Manage client appointments"
            icon="calendar"
            href="/artist-dashboard/appointments"
          />
          <DashboardCard
            title="Messages"
            description="Chat with potential clients"
            icon="messageSquare"
            href="/artist-dashboard/messages"
          />
          <DashboardCard
            title="Settings"
            description="Update your profile and preferences"
            icon="settings"
            href="/artist-dashboard/settings"
          />
          <DashboardCard
            title="Analytics"
            description="View insights about your profile"
            icon="barChart"
            href="/artist-dashboard/analytics"
          />
        </div>

        {/* Recent Appointments */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight text-gold-500 mb-4">Upcoming Appointments</h2>

          {recentAppointments.length === 0 ? (
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-8 text-center">
              <Icons.calendar className="h-12 w-12 text-gold-500/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gold-500 mb-2">No Upcoming Appointments</h3>
              <p className="text-zinc-400 mb-6">You don't have any upcoming appointments scheduled.</p>
            </div>
          ) : (
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {recentAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-zinc-800/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500">
                                {appointment.user_profiles?.display_name?.charAt(0) || "U"}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {appointment.user_profiles?.display_name || "Anonymous User"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{formatDate(appointment.date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              appointment.status === "confirmed"
                                ? "bg-green-500/10 text-green-500"
                                : appointment.status === "pending"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a
                            href={`/artist-dashboard/appointments/${appointment.id}`}
                            className="text-gold-500 hover:text-gold-400"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-zinc-800">
                <a
                  href="/artist-dashboard/appointments"
                  className="text-gold-500 hover:text-gold-400 text-sm font-medium flex items-center"
                >
                  View all appointments
                  <Icons.arrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </ArtistDashboardLayout>
  )
}

function StatCard({
  title,
  value,
  icon,
  href,
  highlight = false,
}: {
  title: string
  value: number
  icon: keyof typeof Icons
  href: string
  highlight?: boolean
}) {
  const Icon = Icons[icon]
  return (
    <a href={href} className="block">
      <Card
        className={`border-gold-500/20 ${highlight ? "bg-gold-500/10" : "bg-black/40"} hover:bg-gold-500/5 transition-colors`}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-400">{title}</p>
              <p className="text-3xl font-bold text-gold-500 mt-1">{value}</p>
            </div>
            <div className={`rounded-full p-2 ${highlight ? "bg-gold-500/20" : "bg-gold-500/10"}`}>
              <Icon className="h-5 w-5 text-gold-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
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
        <a href={href} className="w-full">
          <Button variant="outline" className="w-full border-gold-500/30 hover:bg-gold-500/10 text-gold-300">
            View
            <Icons.arrowRight className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  )
}
