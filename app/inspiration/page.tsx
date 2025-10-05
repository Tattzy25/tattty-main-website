"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import MainLayout from "@/components/main-layout"

// Define the category type
interface Category {
  id: string
  title: string
  description: string
  images: {
    id: number
    url: string
    alt: string
  }[]
  category: string
  slug: string
  isFeatured: boolean
}

export default function InspirationPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load inspiration data on mount
  useEffect(() => {
    const loadInspiration = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/inspiration')
        if (!response.ok) {
          throw new Error(`Failed to fetch inspiration: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setCategories(data.filter((cat: Category) => cat.images.length > 0))
      } catch (err) {
        console.error('Error loading inspiration:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to load inspiration gallery.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadInspiration()
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
          <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
                Tattoo Inspiration
              </h1>
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <MainLayout>
        <div className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
          <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
                Tattoo Inspiration
              </h1>
              <p className="text-zinc-300 max-w-2xl mx-auto mb-8">
                Error loading inspiration gallery.
              </p>
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  // If no categories have images yet, show a message
  if (categories.length === 0) {
    return (
      <MainLayout>
        <div className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
          <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
                Tattoo Inspiration
              </h1>
              <p className="text-zinc-300 max-w-2xl mx-auto">
                We're currently adding tattoo designs to our gallery. Check back soon for inspiration!
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
              Tattoo Inspiration
            </h1>
            <p className="text-zinc-300 max-w-2xl mx-auto">
              Explore our gallery of tattoo designs to inspire your next ink
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative group cursor-pointer overflow-hidden rounded-xl border border-zinc-800"
                onClick={() => {
                  const categorySection = document.getElementById(`category-${category.id}`)
                  if (categorySection) {
                    categorySection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
                <Image
                  src={category.images[0]?.url || "/placeholder.svg"}
                  alt={category.title}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h2 className="text-xl font-bold text-white">{category.title}</h2>
                  <p className="text-zinc-300 text-sm">{category.images.length} designs</p>
                </div>
              </div>
            ))}
          </div>

          {categories.map((category) => (
            <div key={category.id} id={`category-${category.id}`} className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-white">{category.title}</h2>
              <CategoryCarousel images={category.images} />
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

// Category Carousel Component
function CategoryCarousel({ images }: { images: Category["images"] }) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollButtons)
      window.addEventListener("resize", checkScrollButtons)
      checkScrollButtons()
      return () => {
        carousel.removeEventListener("scroll", checkScrollButtons)
        window.removeEventListener("resize", checkScrollButtons)
      }
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="relative group">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-4"
      >
        {images.map((image) => (
          <div
            key={image.id}
            className="flex-none w-64 h-64 snap-start rounded-lg overflow-hidden border border-zinc-800"
          >
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.alt}
              width={300}
              height={300}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 border-zinc-700 text-white hover:bg-black/70 z-10 opacity-0 group-hover:opacity-100 transition-opacity",
          !canScrollLeft && "hidden",
        )}
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 border-zinc-700 text-white hover:bg-black/70 z-10 opacity-0 group-hover:opacity-100 transition-opacity",
          !canScrollRight && "hidden",
        )}
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}
