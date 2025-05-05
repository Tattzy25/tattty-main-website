"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { fetchReferenceImages, fetchCategoriesAndStyles, removeReferenceImage } from "@/app/actions/reference-images"
import { Loader2, Search, Trash2 } from "lucide-react"

type ReferenceImage = {
  id: string
  file_name: string
  category: string
  style: string
  tags: string[]
  storage_path: string
  signed_url: string
  created_at: string
}

export default function ReferenceImageBrowser() {
  const [isLoading, setIsLoading] = useState(true)
  const [images, setImages] = useState<ReferenceImage[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [styles, setStyles] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedStyle, setSelectedStyle] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 20

  useEffect(() => {
    loadCategoriesAndStyles()
    loadImages()
  }, [selectedCategory, selectedStyle, page])

  const loadCategoriesAndStyles = async () => {
    try {
      const result = await fetchCategoriesAndStyles()
      if (result.success) {
        setCategories(result.categories)
        setStyles(result.styles)
      }
    } catch (error) {
      console.error("Error loading categories and styles:", error)
    }
  }

  const loadImages = async () => {
    setIsLoading(true)
    try {
      const offset = (page - 1) * limit
      const result = await fetchReferenceImages(selectedCategory, selectedStyle, limit, offset)

      if (result.success) {
        setImages(result.data)
        setTotalCount(result.count || 0)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load images",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading images:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    // Reset page when searching
    setPage(1)
    loadImages()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      return
    }

    try {
      const result = await removeReferenceImage(id)

      if (result.success) {
        toast({
          title: "Image deleted",
          description: "The reference image has been deleted successfully",
        })

        // Remove from local state
        setImages((prev) => prev.filter((img) => img.id !== id))
      } else {
        toast({
          title: "Deletion failed",
          description: result.error || "Failed to delete the image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-white">Reference Image Library</h2>

      <div className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="category-filter">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="style-filter">Style</Label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger id="style-filter">
                <SelectValue placeholder="All Styles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                {styles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="search">Search</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by filename or tags"
              />
              <Button type="button" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <p>No reference images found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden">
                  <img
                    src={image.signed_url || "/placeholder.svg"}
                    alt={image.file_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(image.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-xs">
                  <p className="truncate font-medium">{image.file_name}</p>
                  <p className="text-zinc-400">
                    {image.category} / {image.style}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>

            <span className="text-sm">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
