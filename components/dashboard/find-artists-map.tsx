"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { Map, type MapMarker } from "@/components/ui/map"
import { geocodeAddress } from "@/lib/mapbox"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { searchArtistsByLocation } from "@/app/actions/artist-search"

// Define tattoo styles
const TATTOO_STYLES = [
  "Traditional",
  "Neo-Traditional",
  "Japanese",
  "Blackwork",
  "Realism",
  "Watercolor",
  "Tribal",
  "New School",
  "Minimalist",
  "Geometric",
  "Dotwork",
  "Illustrative",
  "Chicano",
  "Portrait",
  "Biomechanical",
  "Script/Lettering",
  "Fine Line",
  "Surrealism",
  "Abstract",
  "Trash Polka",
]

// Define price ranges
const PRICE_RANGES = [
  { label: "Any price", value: "any" },
  { label: "$: Budget-friendly", value: "budget" },
  { label: "$$: Mid-range", value: "mid" },
  { label: "$$$: Premium", value: "premium" },
  { label: "$$$$: Luxury", value: "luxury" },
]

// Define experience levels
const EXPERIENCE_LEVELS = [
  { label: "Any experience", value: "any" },
  { label: "1-2 years", value: "beginner" },
  { label: "3-5 years", value: "intermediate" },
  { label: "6-10 years", value: "experienced" },
  { label: "10+ years", value: "expert" },
]

export function FindArtistsMap() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchAddress, setSearchAddress] = useState("")
  const [searchRadius, setSearchRadius] = useState(25)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([-98.5795, 39.8283]) // Default to US center
  const [mapZoom, setMapZoom] = useState(3)
  const [artists, setArtists] = useState<any[]>([])
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null)
  const [filtersVisible, setFiltersVisible] = useState(false)

  // Filter states
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<string>("any")
  const [experienceLevel, setExperienceLevel] = useState<string>("any")
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false)
  const [isTravelingOnly, setIsTravelingOnly] = useState(false)
  const [hasAppointmentsOnly, setHasAppointmentsOnly] = useState(false)
  const [sortBy, setSortBy] = useState<string>("distance")

  // Try to get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setMapCenter([longitude, latitude])
          setMapZoom(10)
          searchNearbyArtists(latitude, longitude, searchRadius)
        },
        (error) => {
          console.error("Error getting user location:", error)
        },
      )
    }
  }, [])

  // Search for artists near an address
  const handleAddressSearch = async () => {
    if (!searchAddress) {
      toast({
        title: "Address required",
        description: "Please enter an address to search for nearby artists.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const coords = await geocodeAddress(searchAddress)
      if (coords) {
        setUserLocation(coords)
        setMapCenter([coords.lng, coords.lat])
        setMapZoom(10)
        await searchNearbyArtists(coords.lat, coords.lng, searchRadius)
      } else {
        toast({
          title: "Address not found",
          description: "We couldn't find coordinates for this address. Please try a different address.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error searching by address:", error)
      toast({
        title: "Error",
        description: "Failed to search for artists. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Search for artists near coordinates
  const searchNearbyArtists = async (lat: number, lng: number, radius: number) => {
    setIsLoading(true)
    try {
      // Get artists from server action
      const result = await searchArtistsByLocation(lat, lng, radius)

      if (result.error) {
        throw new Error(result.error)
      }

      let filteredArtists = result.artists || []

      // Apply filters
      filteredArtists = applyFilters(filteredArtists)

      setArtists(filteredArtists)

      // Create markers for the map
      const artistMarkers: MapMarker[] = filteredArtists.map((artist) => ({
        id: artist.id,
        lat: artist.latitude,
        lng: artist.longitude,
        title: artist.business_name,
        description: `${artist.distance.toFixed(1)} km away`,
        color: "#F5A623",
      }))

      // Add user location marker
      const allMarkers = [
        {
          id: "user",
          lat,
          lng,
          title: "Your Location",
          color: "#4CAF50",
        },
        ...artistMarkers,
      ]

      setMarkers(allMarkers)

      if (filteredArtists.length === 0) {
        toast({
          title: "No artists found",
          description: `No tattoo artists found within ${radius} km of your location matching your filters.`,
        })
      }
    } catch (error) {
      console.error("Error searching for artists:", error)
      toast({
        title: "Error",
        description: "Failed to search for artists. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters to artists
  const applyFilters = (artistsList: any[]) => {
    return artistsList
      .filter((artist) => {
        // Filter by styles
        if (selectedStyles.length > 0) {
          const artistStyles = artist.specialties || []
          if (!selectedStyles.some((style) => artistStyles.includes(style))) {
            return false
          }
        }

        // Filter by price range
        if (priceRange !== "any") {
          if (!artist.price_range || artist.price_range !== priceRange) {
            return false
          }
        }

        // Filter by experience level
        if (experienceLevel !== "any") {
          if (!artist.years_experience) return false

          switch (experienceLevel) {
            case "beginner":
              if (artist.years_experience > 2) return false
              break
            case "intermediate":
              if (artist.years_experience < 3 || artist.years_experience > 5) return false
              break
            case "experienced":
              if (artist.years_experience < 6 || artist.years_experience > 10) return false
              break
            case "expert":
              if (artist.years_experience < 10) return false
              break
          }
        }

        // Filter by verification status
        if (isVerifiedOnly && !artist.is_verified) {
          return false
        }

        // Filter by traveling status
        if (isTravelingOnly && !artist.is_traveling_artist) {
          return false
        }

        // Filter by available appointments
        if (hasAppointmentsOnly && !artist.has_available_appointments) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        // Sort results
        switch (sortBy) {
          case "distance":
            return a.distance - b.distance
          case "price_low":
            const priceOrder = { budget: 1, mid: 2, premium: 3, luxury: 4 }
            return (priceOrder[a.price_range] || 0) - (priceOrder[b.price_range] || 0)
          case "price_high":
            const priceOrderHigh = { budget: 1, mid: 2, premium: 3, luxury: 4 }
            return (priceOrderHigh[b.price_range] || 0) - (priceOrderHigh[a.price_range] || 0)
          case "experience":
            return (b.years_experience || 0) - (a.years_experience || 0)
          default:
            return a.distance - b.distance
        }
      })
  }

  // Calculate distance between two points in km
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLng = deg2rad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return distance
  }

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
  }

  // Handle marker click
  const handleMarkerClick = (marker: MapMarker) => {
    if (marker.id === "user") return
    const artist = artists.find((a) => a.id === marker.id)
    if (artist) {
      setSelectedArtist(artist)
    }
  }

  // Update search when radius changes
  const handleRadiusChange = (value: number[]) => {
    const radius = value[0]
    setSearchRadius(radius)
    if (userLocation) {
      searchNearbyArtists(userLocation.lat, userLocation.lng, radius)
    }
  }

  // Handle style selection
  const handleStyleToggle = (style: string) => {
    setSelectedStyles((prev) => (prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]))
  }

  // Apply filters
  const applyAllFilters = () => {
    if (userLocation) {
      searchNearbyArtists(userLocation.lat, userLocation.lng, searchRadius)
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedStyles([])
    setPriceRange("any")
    setExperienceLevel("any")
    setIsVerifiedOnly(false)
    setIsTravelingOnly(false)
    setHasAppointmentsOnly(false)
    setSortBy("distance")

    if (userLocation) {
      searchNearbyArtists(userLocation.lat, userLocation.lng, searchRadius)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Enter your address or city"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="bg-black/20 border-gold-500/30 text-white"
          />
        </div>
        <Button onClick={handleAddressSearch} className="bg-gold-500 hover:bg-gold-600 text-black" disabled={isLoading}>
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Searching...
            </>
          ) : (
            <>
              <Icons.search className="mr-2 h-4 w-4" /> Search
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => setFiltersVisible(!filtersVisible)}
          className="border-gold-500/30 hover:bg-gold-500/10 text-gold-300"
        >
          <Icons.sliders className="mr-2 h-4 w-4" />
          {filtersVisible ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {filtersVisible && (
        <Card className="border-gold-500/20 bg-black/40 mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gold-500">Tattoo Styles</h3>
                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2">
                  {TATTOO_STYLES.map((style) => (
                    <Badge
                      key={style}
                      variant={selectedStyles.includes(style) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedStyles.includes(style)
                          ? "bg-gold-500 hover:bg-gold-600 text-black"
                          : "border-gold-500/30 hover:bg-gold-500/10 text-gold-300"
                      }`}
                      onClick={() => handleStyleToggle(style)}
                    >
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gold-500">Price & Experience</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Price Range</label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="bg-black/20 border-gold-500/30 text-white">
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-gold-500/30">
                        {PRICE_RANGES.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Experience Level</label>
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                      <SelectTrigger className="bg-black/20 border-gold-500/30 text-white">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-gold-500/30">
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gold-500">Additional Filters</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={isVerifiedOnly}
                      onCheckedChange={(checked) => setIsVerifiedOnly(checked === true)}
                      className="border-gold-500/50 data-[state=checked]:bg-gold-500"
                    />
                    <label htmlFor="verified" className="text-sm text-zinc-300 cursor-pointer">
                      Verified artists only
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="traveling"
                      checked={isTravelingOnly}
                      onCheckedChange={(checked) => setIsTravelingOnly(checked === true)}
                      className="border-gold-500/50 data-[state=checked]:bg-gold-500"
                    />
                    <label htmlFor="traveling" className="text-sm text-zinc-300 cursor-pointer">
                      Traveling artists only
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="appointments"
                      checked={hasAppointmentsOnly}
                      onCheckedChange={(checked) => setHasAppointmentsOnly(checked === true)}
                      className="border-gold-500/50 data-[state=checked]:bg-gold-500"
                    />
                    <label htmlFor="appointments" className="text-sm text-zinc-300 cursor-pointer">
                      Has available appointments
                    </label>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-sm text-zinc-400">Sort Results By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-black/20 border-gold-500/30 text-white">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-gold-500/30">
                        <SelectItem value="distance">Distance (closest first)</SelectItem>
                        <SelectItem value="price_low">Price (low to high)</SelectItem>
                        <SelectItem value="price_high">Price (high to low)</SelectItem>
                        <SelectItem value="experience">Experience (most first)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="border-gold-500/30 hover:bg-gold-500/10 text-gold-300"
              >
                Reset Filters
              </Button>
              <Button
                onClick={applyAllFilters}
                className="bg-gold-500 hover:bg-gold-600 text-black"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Applying...
                  </>
                ) : (
                  <>
                    <Icons.check className="mr-2 h-4 w-4" /> Apply Filters
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Card className="border-gold-500/20 bg-black/40">
            <CardContent className="p-4">
              <Map
                markers={markers}
                center={mapCenter}
                zoom={mapZoom}
                onMarkerClick={handleMarkerClick}
                className="h-[500px]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/3 space-y-6">
          <Card className="border-gold-500/20 bg-black/40">
            <CardContent className="p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gold-500">Search Radius: {searchRadius} km</h3>
                <Slider
                  value={[searchRadius]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={handleRadiusChange}
                  disabled={isLoading || !userLocation}
                  className="py-4"
                />
                <p className="text-sm text-zinc-400">
                  Adjust the slider to change the search radius for finding artists.
                </p>
              </div>
            </CardContent>
          </Card>

          {selectedArtist && (
            <Card className="border-gold-500/20 bg-black/40">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={selectedArtist.user_profiles?.avatar_url || "/placeholder.svg?height=48&width=48"}
                        alt={selectedArtist.business_name}
                      />
                      <AvatarFallback className="bg-gold-500/20 text-gold-500">
                        {selectedArtist.business_name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gold-500">{selectedArtist.business_name}</h3>
                        {selectedArtist.is_verified && <Icons.badgeCheck className="h-4 w-4 text-gold-500" />}
                      </div>
                      <p className="text-sm text-zinc-400">
                        {selectedArtist.distance.toFixed(1)} km away • {selectedArtist.location}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedArtist.price_range && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400">Price Range:</span>
                        <span className="text-gold-500">
                          {selectedArtist.price_range === "budget" && "$"}
                          {selectedArtist.price_range === "mid" && "$$"}
                          {selectedArtist.price_range === "premium" && "$$$"}
                          {selectedArtist.price_range === "luxury" && "$$$$"}
                        </span>
                      </div>
                    )}

                    {selectedArtist.years_experience && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400">Experience:</span>
                        <span className="text-white">{selectedArtist.years_experience} years</span>
                      </div>
                    )}
                  </div>

                  {selectedArtist.specialties && selectedArtist.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedArtist.specialties.map((specialty: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-gold-500/10 px-2.5 py-0.5 text-xs font-medium text-gold-500"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    {selectedArtist.bio && <p className="text-sm text-zinc-300">{selectedArtist.bio}</p>}
                    <div className="flex gap-2">
                      <Link href={`/artists/${selectedArtist.id}`}>
                        <Button className="bg-gold-500 hover:bg-gold-600 text-black">View Profile</Button>
                      </Link>
                      <Link href={`/dashboard/appointments/book?artist=${selectedArtist.id}`}>
                        <Button variant="outline" className="border-gold-500/30 hover:bg-gold-500/10 text-gold-300">
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gold-500">Nearby Artists ({artists.length})</h3>
            {artists.length === 0 ? (
              <p className="text-sm text-zinc-400">
                No artists found in this area. Try expanding your search radius or adjusting your filters.
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {artists.map((artist) => (
                  <div
                    key={artist.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedArtist?.id === artist.id
                        ? "bg-gold-500/20 border border-gold-500/40"
                        : "bg-black/20 border border-gold-500/10 hover:bg-gold-500/10"
                    }`}
                    onClick={() => setSelectedArtist(artist)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={artist.user_profiles?.avatar_url || "/placeholder.svg?height=40&width=40"}
                          alt={artist.business_name}
                        />
                        <AvatarFallback className="bg-gold-500/20 text-gold-500">
                          {artist.business_name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-white">{artist.business_name}</p>
                            {artist.is_verified && <Icons.badgeCheck className="h-3 w-3 text-gold-500" />}
                          </div>
                          {artist.price_range && (
                            <span className="text-gold-500 text-xs">
                              {artist.price_range === "budget" && "$"}
                              {artist.price_range === "mid" && "$$"}
                              {artist.price_range === "premium" && "$$$"}
                              {artist.price_range === "luxury" && "$$$$"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-zinc-400">{artist.distance.toFixed(1)} km away</p>
                          {artist.years_experience && (
                            <span className="text-xs text-zinc-400">{artist.years_experience} yrs exp</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
