"use client"

import { useState } from "react"
import Image from "next/image"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ImageObject = {
  url: string
  label: string
}

interface ImageGalleryProps {
  images: ImageObject[]
  selectedImages: ImageObject[]
  onImageSelect: (image: ImageObject) => void
  title?: string
  initialDisplayCount?: number
  loadMoreCount?: number
}

export function ImageGallery({
  images = [],
  selectedImages = [],
  onImageSelect,
  title = "Select Style",
  initialDisplayCount = 12,
  loadMoreCount = 8
}: ImageGalleryProps) {
  const [displayCount, setDisplayCount] = useState(initialDisplayCount)
  
  const visibleImages = images.slice(0, displayCount)
  const hasMore = displayCount < images.length
  
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + loadMoreCount)
  }
  
  return (
    <div className="w-full mb-8">
      {title && (
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {visibleImages.map((image, index) => {
          const isSelected = selectedImages.some(selected => selected.url === image.url)
          
          return (
            <button
              key={`${image.url}-${index}`}
              onClick={() => onImageSelect(image)}
              className={`bg-black/90 backdrop-blur-md rounded-[2rem] overflow-hidden border transition-all duration-300 group ${
                isSelected
                  ? 'border-orange-500 shadow-2xl shadow-orange-500/20 scale-[1.02]'
                  : 'border-white/10 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-[1.02]'
              }`}
            >
              {/* Image Section - Rounded with padding */}
              <div className="relative aspect-square p-3">
                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                  <Image
                    src={image.url}
                    alt={`${image.label} - ${title}`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover"
                    unoptimized
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Selected overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Info Section - Bottom card */}
              <div className="px-4 pb-4">
                <p className={`text-sm font-semibold truncate transition-colors duration-300 ${
                  isSelected ? 'text-orange-400' : 'text-white group-hover:text-orange-400'
                }`}>
                  {image.label}
                </p>
              </div>
            </button>
          )
        })}
      </div>
      
      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
