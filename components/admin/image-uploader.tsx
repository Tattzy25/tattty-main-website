"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// Define the category options
const CATEGORIES = [
  { id: 1, name: "Traditional" },
  { id: 2, name: "Neo-Traditional" },
  { id: 3, name: "Realism" },
  { id: 4, name: "Watercolor" },
  { id: 5, name: "Tribal" },
  { id: 6, name: "Japanese" },
  { id: 7, name: "Blackwork" },
  { id: 8, name: "Minimalist" },
  { id: 9, name: "Geometric" },
  { id: 10, name: "Dotwork" },
  { id: 11, name: "Old School" },
  { id: 12, name: "New School" },
  { id: 13, name: "Biomechanical" },
  { id: 14, name: "Portrait" },
  { id: 15, name: "Script" },
  { id: 16, name: "Floral" },
  { id: 17, name: "Animal" },
  { id: 18, name: "Mandala" },
  { id: 19, name: "Abstract" },
  { id: 20, name: "Surrealism" },
]

export default function ImageUploader() {
  const [categoryId, setCategoryId] = useState<string>("")
  const [imageUrls, setImageUrls] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoryId) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      })
      return
    }

    if (!imageUrls.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one image URL",
        variant: "destructive",
      })
      return
    }

    // Parse the image URLs (one per line)
    const urls = imageUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)

    if (urls.length === 0) {
      toast({
        title: "Error",
        description: "No valid image URLs found",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/inspiration/add-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: Number.parseInt(categoryId),
          imageUrls: urls,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Added ${urls.length} images to the category`,
        })

        // Clear the form
        setImageUrls("")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add images",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-900 rounded-lg border border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-white">Add Images to Categories</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrls">Image URLs (one per line)</Label>
          <Textarea
            id="imageUrls"
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
            className="min-h-[200px]"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Adding Images..." : "Add Images"}
        </Button>
      </form>

      <div className="mt-6 text-sm text-zinc-400">
        <p>Tips:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Enter one image URL per line</li>
          <li>Make sure all URLs are publicly accessible</li>
          <li>Supported formats: JPG, PNG, WebP, GIF</li>
          <li>Recommended image size: 600x600 pixels or larger</li>
        </ul>
      </div>
    </div>
  )
}
