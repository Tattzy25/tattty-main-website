"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

interface Design {
  id: string
  name: string
  description: string
  image_url: string
  created_at: string
}

export function DesignList() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    fetchDesigns()
  }, [])

  const fetchDesigns = async () => {
    try {
      setIsFetching(true)

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
        .select("id, title as name, description, image_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3)

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
      setIsFetching(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(id)

      // Delete from database
      const { error } = await supabase.from("tattoo_designs").delete().eq("id", id)

      if (error) throw error

      // Update local state
      setDesigns(designs.filter((design) => design.id !== id))

      toast({
        title: "Design deleted",
        description: "Your design has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting design:", error)
      toast({
        title: "Error",
        description: "Failed to delete design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Icons.spinner className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    )
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {designs.map((design) => (
        <Card key={design.id} className="overflow-hidden border-gold-500/20 bg-black/40">
          <div className="aspect-square relative">
            <img
              src={design.image_url || "/placeholder.svg"}
              alt={design.name}
              className="object-cover w-full h-full"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gold-500">{design.name}</h3>
            <p className="text-sm text-muted-foreground">{design.description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Created on {new Date(design.created_at).toLocaleDateString()}
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
