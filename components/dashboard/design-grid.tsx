"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { deleteDesign } from "@/app/actions/upload"

interface Design {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
  is_favorite: boolean
  style: string
}

export function DesignGrid() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchDesigns()
  }, [])

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

      // Get designs
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
        description: "Failed to load designs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDesign = async () => {
    if (!selectedDesign) return

    try {
      setIsDeleting(true)

      const result = await deleteDesign(selectedDesign.id)

      if (result.success) {
        // Remove from local state
        setDesigns(designs.filter((design) => design.id !== selectedDesign.id))

        toast({
          title: "Design deleted",
          description: "Your design has been deleted successfully.",
        })
      } else {
        throw new Error(result.error || "Failed to delete design")
      }
    } catch (error) {
      console.error("Error deleting design:", error)
      toast({
        title: "Error",
        description: "Failed to delete design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setSelectedDesign(null)
    }
  }

  const toggleFavorite = async (design: Design) => {
    try {
      const { error } = await supabase
        .from("tattoo_designs")
        .update({ is_favorite: !design.is_favorite })
        .eq("id", design.id)

      if (error) throw error

      // Update local state
      setDesigns(designs.map((d) => (d.id === design.id ? { ...d, is_favorite: !d.is_favorite } : d)))

      toast({
        title: design.is_favorite ? "Removed from favorites" : "Added to favorites",
        description: design.is_favorite ? "Design removed from your favorites." : "Design added to your favorites.",
      })
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="border-gold-500/20 bg-black/40">
            <div className="aspect-square bg-zinc-800/50 animate-pulse" />
            <CardContent className="p-4">
              <div className="h-5 bg-zinc-800/50 rounded animate-pulse mb-2" />
              <div className="h-4 bg-zinc-800/50 rounded animate-pulse w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (designs.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gold-500/20 rounded-lg">
        <Icons.image className="mx-auto h-12 w-12 text-gold-500/30" />
        <h3 className="mt-4 text-xl font-semibold text-gold-500">No designs yet</h3>
        <p className="mt-2 text-zinc-400">Create your first tattoo design to see it here.</p>
        <Button asChild className="mt-6 bg-gold-500 hover:bg-gold-600 text-black">
          <a href="/dashboard/create">
            <Icons.plus className="mr-2 h-4 w-4" />
            Create New Design
          </a>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {designs.map((design) => (
          <Card key={design.id} className="border-gold-500/20 bg-black/40 overflow-hidden group">
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={design.image_url || "/placeholder.svg"}
                alt={design.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-black/50 border-zinc-700 text-white hover:bg-black/70"
                    onClick={() => toggleFavorite(design)}
                  >
                    {design.is_favorite ? (
                      <Icons.heartFilled className="h-4 w-4 text-red-500" />
                    ) : (
                      <Icons.heart className="h-4 w-4" />
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-black/50 border-zinc-700 text-white hover:bg-black/70"
                      >
                        <Icons.moreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                      <DropdownMenuItem
                        className="text-zinc-300 focus:text-white focus:bg-zinc-800"
                        onClick={() => window.open(design.image_url, "_blank")}
                      >
                        <Icons.download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-zinc-300 focus:text-white focus:bg-zinc-800"
                        onClick={() => {
                          setSelectedDesign(design)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Icons.trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-white truncate">{design.title}</h3>
              <p className="text-sm text-zinc-400 truncate">{design.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <span className="text-xs text-zinc-500">{new Date(design.created_at).toLocaleDateString()}</span>
              {design.style && (
                <span className="text-xs bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded-full">{design.style}</span>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Delete Design</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this design? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDesign} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
