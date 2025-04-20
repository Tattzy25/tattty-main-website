"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

// Mock data for designs
const mockDesigns = [
  {
    id: "1",
    name: "Dragon Tattoo",
    description: "A fierce dragon design for upper arm",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-05-15T10:00:00Z",
    isFavorite: true,
  },
  {
    id: "2",
    name: "Floral Sleeve",
    description: "Elegant floral pattern for full sleeve",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-06-20T14:30:00Z",
    isFavorite: false,
  },
  {
    id: "3",
    name: "Geometric Wolf",
    description: "Modern geometric wolf design",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-07-05T09:15:00Z",
    isFavorite: true,
  },
  {
    id: "4",
    name: "Minimalist Mountain",
    description: "Simple line art mountain design",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-08-12T11:20:00Z",
    isFavorite: false,
  },
  {
    id: "5",
    name: "Tribal Pattern",
    description: "Traditional tribal pattern for shoulder",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-09-03T16:45:00Z",
    isFavorite: false,
  },
  {
    id: "6",
    name: "Japanese Koi",
    description: "Colorful koi fish design for back",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-10-18T13:10:00Z",
    isFavorite: true,
  },
]

export function DesignGrid() {
  const [designs, setDesigns] = useState(mockDesigns)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setIsLoading(id)
    // Simulate API call
    setTimeout(() => {
      setDesigns(designs.filter((design) => design.id !== id))
      setIsLoading(null)
      toast({
        title: "Design deleted",
        description: "The design has been deleted successfully.",
      })
    }, 1000)
  }

  const toggleFavorite = (id: string) => {
    setDesigns(designs.map((design) => (design.id === id ? { ...design, isFavorite: !design.isFavorite } : design)))
    const design = designs.find((d) => d.id === id)
    toast({
      title: design?.isFavorite ? "Removed from favorites" : "Added to favorites",
      description: design?.isFavorite
        ? "The design has been removed from your favorites."
        : "The design has been added to your favorites.",
    })
  }

  if (designs.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed border-gold-500/20 p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <Icons.image className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-gold-500">No designs created</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven&apos;t created any designs yet. Start creating your first tattoo design.
          </p>
          <Link href="/dashboard/create">
            <Button className="mt-4 bg-gold-500 hover:bg-gold-600 text-black">Create your first design</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {designs.map((design) => (
        <Card key={design.id} className="overflow-hidden border-gold-500/20 bg-black/40">
          <div className="aspect-square relative group">
            <img src={design.image || "/placeholder.svg"} alt={design.name} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex gap-2">
                <Link href={`/dashboard/designs/${design.id}`}>
                  <Button size="sm" className="bg-gold-500 hover:bg-gold-600 text-black">
                    <Icons.edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gold-500/30 hover:bg-gold-500/10"
                  onClick={() => toggleFavorite(design.id)}
                >
                  <Icons.heart
                    className={`h-4 w-4 ${design.isFavorite ? "fill-gold-500 text-gold-500" : "text-gold-300"}`}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gold-500/30 hover:bg-gold-500/10"
                  onClick={() => {
                    toast({
                      title: "Design copied",
                      description: "The design has been duplicated.",
                    })
                  }}
                >
                  <Icons.copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gold-500">{design.name}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Icons.ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/designs/${design.id}`}>
                      <Icons.edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleFavorite(design.id)}>
                    <Icons.heart className={`mr-2 h-4 w-4 ${design.isFavorite ? "fill-gold-500" : ""}`} />
                    {design.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/designs/${design.id}/export`}>
                      <Icons.download className="mr-2 h-4 w-4" />
                      Export
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(design.id)} className="text-red-500 focus:text-red-500">
                    {isLoading === design.id ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Icons.trash className="mr-2 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{design.description}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <p className="text-xs text-muted-foreground">{new Date(design.createdAt).toLocaleDateString()}</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gold-300"
              onClick={() => toggleFavorite(design.id)}
            >
              <Icons.heart className={`h-4 w-4 ${design.isFavorite ? "fill-gold-500 text-gold-500" : ""}`} />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
