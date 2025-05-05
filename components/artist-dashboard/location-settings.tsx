"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { Map, type MapMarker } from "@/components/ui/map"
import { geocodeAddress } from "@/lib/mapbox"
import { supabase } from "@/lib/supabase"

const locationFormSchema = z.object({
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  isTravelingArtist: z.boolean().default(false),
  serviceRadius: z.number().min(1).max(200).default(25),
})

const travelScheduleSchema = z.object({
  location: z.string().min(5, {
    message: "Location must be at least 5 characters.",
  }),
  startDate: z.string().min(1, {
    message: "Start date is required.",
  }),
  endDate: z.string().min(1, {
    message: "End date is required.",
  }),
})

export function LocationSettings() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [artistProfile, setArtistProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapMarker, setMapMarker] = useState<MapMarker | null>(null)
  const [travelSchedule, setTravelSchedule] = useState<any[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>([-98.5795, 39.8283]) // Default to US center
  const [mapZoom, setMapZoom] = useState(3)

  // Fetch artist data on component mount
  useEffect(() => {
    fetchArtistData()
  }, [])

  const fetchArtistData = async () => {
    try {
      setIsLoading(true)

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

      setArtistProfile(artistData)

      // Set map marker if location exists
      if (artistData?.latitude && artistData?.longitude) {
        setMapMarker({
          id: "studio",
          lat: artistData.latitude,
          lng: artistData.longitude,
          title: artistData.business_name || "Studio Location",
          description: artistData.location || "",
          color: "#F5A623",
        })
        setMapCenter([artistData.longitude, artistData.latitude])
        setMapZoom(12)
      }

      // Get travel schedule if artist is traveling
      if (artistData?.is_traveling_artist) {
        const { data: scheduleData } = await supabase
          .from("artist_travel_schedule")
          .select("*")
          .eq("artist_id", user.id)
          .order("start_date", { ascending: true })

        setTravelSchedule(scheduleData || [])
      }

      // Update form with existing data
      locationForm.reset({
        address: artistData?.location || "",
        isTravelingArtist: artistData?.is_traveling_artist || false,
        serviceRadius: artistData?.service_radius || 25,
      })
    } catch (error) {
      console.error("Error fetching artist data:", error)
      toast({
        title: "Error",
        description: "Failed to load your location data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const locationForm = useForm<z.infer<typeof locationFormSchema>>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      address: "",
      isTravelingArtist: false,
      serviceRadius: 25,
    },
  })

  const travelForm = useForm<z.infer<typeof travelScheduleSchema>>({
    resolver: zodResolver(travelScheduleSchema),
    defaultValues: {
      location: "",
      startDate: "",
      endDate: "",
    },
  })

  async function onLocationSubmit(values: z.infer<typeof locationFormSchema>) {
    setIsUpdating(true)
    try {
      // Get coordinates from address
      let latitude = null
      let longitude = null

      if (values.address) {
        const coords = await geocodeAddress(values.address)
        if (coords) {
          latitude = coords.lat
          longitude = coords.lng
        } else {
          toast({
            title: "Address not found",
            description: "We couldn't find coordinates for this address. Please try a different address.",
            variant: "destructive",
          })
          setIsUpdating(false)
          return
        }
      }

      // Update artist profile in Supabase
      const { error } = await supabase
        .from("artist_profiles")
        .update({
          location: values.address,
          latitude,
          longitude,
          is_traveling_artist: values.isTravelingArtist,
          service_radius: values.serviceRadius,
          updated_at: new Date().toISOString(),
        })
        .eq("id", artistProfile.id)

      if (error) throw error

      // Update local state
      setArtistProfile({
        ...artistProfile,
        location: values.address,
        latitude,
        longitude,
        is_traveling_artist: values.isTravelingArtist,
        service_radius: values.serviceRadius,
      })

      // Update map marker
      if (latitude && longitude) {
        setMapMarker({
          id: "studio",
          lat: latitude,
          lng: longitude,
          title: artistProfile.business_name || "Studio Location",
          description: values.address,
          color: "#F5A623",
        })
        setMapCenter([longitude, latitude])
        setMapZoom(12)
      }

      toast({
        title: "Location updated",
        description: "Your location settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating location:", error)
      toast({
        title: "Error",
        description: "Failed to update your location settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  async function onTravelScheduleSubmit(values: z.infer<typeof travelScheduleSchema>) {
    setIsUpdating(true)
    try {
      // Get coordinates from location
      let latitude = null
      let longitude = null

      if (values.location) {
        const coords = await geocodeAddress(values.location)
        if (coords) {
          latitude = coords.lat
          longitude = coords.lng
        }
      }

      // Add travel schedule to Supabase
      const { data, error } = await supabase
        .from("artist_travel_schedule")
        .insert({
          artist_id: artistProfile.id,
          location: values.location,
          latitude,
          longitude,
          start_date: new Date(values.startDate).toISOString(),
          end_date: new Date(values.endDate).toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Update local state
      setTravelSchedule([...travelSchedule, data])

      // Reset form
      travelForm.reset({
        location: "",
        startDate: "",
        endDate: "",
      })

      toast({
        title: "Travel schedule added",
        description: "Your travel schedule has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding travel schedule:", error)
      toast({
        title: "Error",
        description: "Failed to add your travel schedule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  async function deleteTravelSchedule(id: string) {
    try {
      // Delete travel schedule from Supabase
      const { error } = await supabase.from("artist_travel_schedule").delete().eq("id", id)

      if (error) throw error

      // Update local state
      setTravelSchedule(travelSchedule.filter((schedule) => schedule.id !== id))

      toast({
        title: "Travel schedule deleted",
        description: "Your travel schedule has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting travel schedule:", error)
      toast({
        title: "Error",
        description: "Failed to delete your travel schedule. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Icons.spinner className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    )
  }

  return (
    <Tabs defaultValue="location" className="space-y-8">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="location">Studio Location</TabsTrigger>
        <TabsTrigger value="travel">Travel Schedule</TabsTrigger>
      </TabsList>

      <TabsContent value="location" className="space-y-8">
        <Card className="border-gold-500/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-gold-500">Studio Location</CardTitle>
            <CardDescription>
              Set your permanent studio location or indicate if you're a traveling artist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Map
                markers={mapMarker ? [mapMarker] : []}
                center={mapCenter}
                zoom={mapZoom}
                onMapClick={(lngLat) => {
                  setMapMarker({
                    id: "studio",
                    lat: lngLat.lat,
                    lng: lngLat.lng,
                    title: artistProfile?.business_name || "Studio Location",
                    color: "#F5A623",
                  })
                  setMapCenter([lngLat.lng, lngLat.lat])
                }}
              />
              <p className="text-xs text-zinc-400 mt-2">Click on the map to set your location manually.</p>
            </div>

            <Form {...locationForm}>
              <form onSubmit={locationForm.handleSubmit(onLocationSubmit)} className="space-y-6">
                <FormField
                  control={locationForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Studio Address</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black/20 border-gold-500/30 text-white" />
                      </FormControl>
                      <FormDescription>Enter your full studio address for clients to find you.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={locationForm.control}
                  name="isTravelingArtist"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gold-500/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gold-300">Traveling Artist</FormLabel>
                        <FormDescription>
                          Enable if you travel to different locations to provide your services.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={locationForm.control}
                  name="serviceRadius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Service Radius (km): {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          min={1}
                          max={200}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="py-4"
                        />
                      </FormControl>
                      <FormDescription>
                        How far you're willing to travel from your studio location (in kilometers).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-black" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Save Location"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="travel" className="space-y-8">
        <Card className="border-gold-500/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-gold-500">Travel Schedule</CardTitle>
            <CardDescription>
              Add locations where you'll be available for appointments outside your studio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...travelForm}>
              <form onSubmit={travelForm.handleSubmit(onTravelScheduleSubmit)} className="space-y-6">
                <FormField
                  control={travelForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Location</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black/20 border-gold-500/30 text-white" />
                      </FormControl>
                      <FormDescription>Enter the city or address where you'll be available.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={travelForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold-300">Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="bg-black/20 border-gold-500/30 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={travelForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold-300">End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="bg-black/20 border-gold-500/30 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-black" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Adding...
                    </>
                  ) : (
                    "Add Travel Schedule"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gold-500 mb-4">Upcoming Travel Schedule</h3>
              {travelSchedule.length === 0 ? (
                <p className="text-zinc-400">No travel schedule added yet.</p>
              ) : (
                <div className="space-y-4">
                  {travelSchedule.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex justify-between items-center p-4 rounded-lg border border-gold-500/20 bg-black/20"
                    >
                      <div>
                        <p className="font-medium text-white">{schedule.location}</p>
                        <p className="text-sm text-zinc-400">
                          {new Date(schedule.start_date).toLocaleDateString()} -{" "}
                          {new Date(schedule.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTravelSchedule(schedule.id)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
