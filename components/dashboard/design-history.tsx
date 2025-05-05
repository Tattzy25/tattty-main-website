"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Icons } from "@/components/icons"
import { formatDate } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

interface Design {
  id: string
  title: string
  description: string
  image_url: string
  style: string
  created_at: string
}

interface DesignHistoryProps {
  initialDesigns?: Design[]
}

export function DesignHistory({ initialDesigns = [] }: DesignHistoryProps) {
  const [designs, setDesigns] = useState<Design[]>(initialDesigns)
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [loading, setLoading] = useState(initialDesigns.length === 0)

  useEffect(() => {
    if (initialDesigns.length === 0) {
      fetchDesigns()
    }
  }, [initialDesigns.length])

  const fetchDesigns = async () => {
    try {
      setLoading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Get designs from database
      const { data, error } = await supabase
        .from("tattoo_designs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setDesigns(data || [])
    } catch (error) {
      console.error("Error fetching designs:", error)
      toast({
        title: "Error",
        description: "Failed to load your design history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Icons.spinner className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    )
  }

  if (designs.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed border-gold-500/20 p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <Icons.image className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-gold-500">No designs created</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven&apos;t created any designs yet. Start creating your first tattoo design.
          </p>
          <Link href="/tattoo-generator">
            <Button className="mt-4 bg-gold-500 hover:bg-gold-600 text-black">Create your first design</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {designs.map((design) => (
          <Card key={design.id} className="overflow-hidden border-gold-500/20 bg-black/40 group">
            <div className="aspect-square relative cursor-pointer" onClick={() => setSelectedDesign(design)}>
              <Image
                src={design.image_url || "/placeholder.svg"}
                alt={design.title || "Tattoo design"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-lg font-semibold text-white">{design.title || "Untitled Design"}</h3>
                <p className="text-sm text-zinc-300">{design.style}</p>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gold-500 truncate">{design.title || "Untitled Design"}</h3>
              <p className="text-sm text-muted-foreground mt-1">Style: {design.style}</p>
              <p className="text-xs text-muted-foreground mt-2">Created on {formatDate(design.created_at)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="border-gold-500/30 hover:bg-gold-500/10"
                onClick={() => setSelectedDesign(design)}
              >
                <Icons.eye className="mr-2 h-4 w-4" />
                View
              </Button>
              <Link href={`/dashboard/ar-preview?design=${design.id}`}>
                <Button variant="outline" size="sm" className="border-gold-500/30 hover:bg-gold-500/10">
                  <Icons.share className="mr-2 h-4 w-4" />
                  AR Preview
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedDesign} onOpenChange={(open) => !open && setSelectedDesign(null)}>
        {selectedDesign && (
          <DialogContent className="sm:max-w-[725px] bg-zinc-900 border-gold-500/20">
            <DialogHeader>
              <DialogTitle className="text-gold-500">{selectedDesign.title || "Untitled Design"}</DialogTitle>
              <DialogDescription>Created on {formatDate(selectedDesign.created_at)}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="relative aspect-square w-full max-w-[600px] mx-auto rounded-lg overflow-hidden">
                <Image
                  src={selectedDesign.image_url || "/placeholder.svg"}
                  alt={selectedDesign.title || "Tattoo design"}
                  fill
                  className="object-contain"
                />
              </div>
              {selectedDesign.description && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gold-500">Description</h4>
                  <p className="text-sm text-zinc-300 mt-1">{selectedDesign.description}</p>
                </div>
              )}
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gold-500">Style</h4>
                <p className="text-sm text-zinc-300 mt-1">{selectedDesign.style}</p>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                className="border-gold-500/30 hover:bg-gold-500/10"
                onClick={async () => {
                  try {
                    const response = await fetch(selectedDesign.image_url)
                    const blob = await response.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = `${selectedDesign.title || "tattoo-design"}.png`
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(url)
                    document.body.removeChild(a)

                    toast({
                      title: "Success",
                      description: "Design downloaded successfully",
                    })
                  } catch (error) {
                    console.error("Error downloading design:", error)
                    toast({
                      title: "Error",
                      description: "Failed to download design",
                      variant: "destructive",
                    })
                  }
                }}
              >
                <Icons.download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Link href={`/dashboard/ar-preview?design=${selectedDesign.id}`}>
                <Button className="bg-gold-500 hover:bg-gold-600 text-black">
                  <Icons.share className="mr-2 h-4 w-4" />
                  Try in AR
                </Button>
              </Link>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
