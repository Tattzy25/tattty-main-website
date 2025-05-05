import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MainLayout from "@/components/main-layout"
import { Icons } from "@/components/icons"
import { supabase } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Find Artists | Tattty",
  description: "Connect with talented tattoo artists near you",
}

export default async function ArtistsPage() {
  // Fetch featured artists
  const { data: featuredArtists } = await supabase
    .from("artist_profiles")
    .select("*, artist_portfolios(*)")
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .limit(8)

  // Fetch artist of the month
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const { data: artistOfMonth } = await supabase
    .from("artist_of_the_month")
    .select(`
      *,
      artist_profiles(*),
      artist_portfolios(*)
    `)
    .eq("month", month)
    .eq("year", year)
    .single()

  return (
    <MainLayout>
      <div className="py-24 relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
              Find Your Perfect Tattoo Artist
            </h1>
            <p className="text-zinc-300 max-w-2xl mx-auto">
              Connect with talented tattoo artists who can bring your design to life
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, style, or location..."
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <Button className="bg-gold-500 hover:bg-gold-600 text-black">
                <Icons.search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Traditional
              </Button>
              <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Neo-Traditional
              </Button>
              <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Japanese
              </Button>
              <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Blackwork
              </Button>
              <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Realism
              </Button>
              <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Watercolor
              </Button>
              <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Geometric
              </Button>
              <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Minimalist
              </Button>
            </div>
          </div>

          {/* Artist of the Month */}
          {artistOfMonth && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gold-500">Artist of the Month</h2>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative aspect-square md:aspect-auto md:h-full">
                    <Image
                      src={artistOfMonth.artist_portfolios?.image_url || "/placeholder.svg?height=600&width=600"}
                      alt={artistOfMonth.artist_profiles?.business_name || "Artist of the Month"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col">
                    <div className="mb-4">
                      <span className="inline-flex items-center rounded-full bg-gold-500/20 px-3 py-1 text-sm font-medium text-gold-500">
                        <Icons.award className="mr-1 h-4 w-4" />
                        Artist of the Month
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {artistOfMonth.artist_profiles?.business_name}
                    </h3>
                    <p className="text-zinc-400 mb-4">{artistOfMonth.artist_profiles?.location}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {artistOfMonth.artist_profiles?.specialties?.map((specialty: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    <p className="text-zinc-300 mb-6 flex-grow">
                      {artistOfMonth.description || artistOfMonth.artist_profiles?.bio}
                    </p>

                    <div className="flex gap-4">
                      <Button asChild className="bg-gold-500 hover:bg-gold-600 text-black">
                        <Link href={`/artists/${artistOfMonth.artist_profiles?.id}`}>View Profile</Link>
                      </Button>
                      <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                        <Icons.messageSquare className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Featured Artists */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gold-500">Featured Artists</h2>
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                View All
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-zinc-800 border border-zinc-700 mb-6">
                <TabsTrigger value="all">All Styles</TabsTrigger>
                <TabsTrigger value="traditional">Traditional</TabsTrigger>
                <TabsTrigger value="japanese">Japanese</TabsTrigger>
                <TabsTrigger value="blackwork">Blackwork</TabsTrigger>
                <TabsTrigger value="realism">Realism</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredArtists?.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="traditional" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredArtists
                    ?.filter((artist) => artist.specialties?.includes("Traditional"))
                    .map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                </div>
              </TabsContent>

              {/* Other tabs content */}
            </Tabs>
          </div>

          {/* Become an Artist CTA */}
          <div className="bg-gradient-to-r from-red-900/30 via-black to-purple-900/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
              Are You a Tattoo Artist?
            </h2>
            <p className="text-zinc-300 max-w-2xl mx-auto mb-6">
              Join our platform to showcase your work, connect with clients, and grow your business.
            </p>
            <Button asChild className="bg-gold-500 hover:bg-gold-600 text-black">
              <Link href="/artist-dashboard/create-profile">Join as an Artist</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function ArtistCard({ artist }: { artist: any }) {
  // Get the first portfolio image or use a placeholder
  const portfolioImage = artist.artist_portfolios?.[0]?.image_url || "/placeholder.svg?height=300&width=300"

  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-sm group">
      <div className="aspect-square relative">
        <Image
          src={portfolioImage || "/placeholder.svg"}
          alt={artist.business_name || "Tattoo artist"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gold-500">{artist.business_name}</h3>
        <p className="text-sm text-zinc-400">{artist.location}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {artist.specialties?.slice(0, 3).map((specialty: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-300"
            >
              {specialty}
            </span>
          ))}
          {artist.specialties?.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-300">
              +{artist.specialties.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button asChild variant="outline" size="sm" className="border-gold-500/30 hover:bg-gold-500/10">
          <Link href={`/artists/${artist.id}`}>View Profile</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="border-gold-500/30 hover:bg-gold-500/10">
          <Link href={`/messages/new?artist=${artist.id}`}>
            <Icons.messageSquare className="mr-2 h-4 w-4" />
            Contact
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
