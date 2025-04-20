"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

// Mock data for designs
const mockDesigns = [
  {
    id: "1",
    name: "Dragon Tattoo",
    description: "A fierce dragon design for upper arm",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-05-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Floral Sleeve",
    description: "Elegant floral pattern for full sleeve",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-06-20T14:30:00Z",
  },
  {
    id: "3",
    name: "Geometric Wolf",
    description: "Modern geometric wolf design",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-07-05T09:15:00Z",
  },
]

export function DesignList() {
  const [designs, setDesigns] = useState(mockDesigns)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setIsLoading(id)
    // Simulate API call
    setTimeout(() => {
      setDesigns(designs.filter((design) => design.id !== id))
      setIsLoading(null)
    }, 1000)
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
          <Link href="/dashboard/new">
            <Button className="mt-4 bg-gold-500 hover:bg-gold-600 text-black">Create your first design</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {designs.map((design) => (
        <Card key={design.id} className="overflow-hidden border-gold-500/20 bg-black/40">
          <div className="aspect-square relative">
            <img src={design.image || "/placeholder.svg"} alt={design.name} className="object-cover w-full h-full" />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gold-500">{design.name}</h3>
            <p className="text-sm text-muted-foreground">{design.description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Created on {new Date(design.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button variant="outline" size="sm" className="border-gold-500/30 hover:bg-gold-500/10">
              <Link href={`/dashboard/designs/${design.id}`}>Edit</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 hover:bg-red-500/10 text-red-500"
              onClick={() => handleDelete(design.id)}
              disabled={isLoading === design.id}
            >
              {isLoading === design.id ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Deleting
                </>
              ) : (
                <>
                  <Icons.trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
