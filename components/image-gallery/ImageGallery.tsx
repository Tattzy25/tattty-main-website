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
  images,
  selectedImages,
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
              className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? 'ring-4 ring-orange-500 shadow-lg shadow-orange-500/50'
                  : 'ring-2 ring-white/20 hover:ring-white/40'
              }`}
            >
              <Image
                src={image.url}
                alt={`${image.label} - ${title}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover"
                unoptimized
              />
              
              {/* Label Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                <p className="text-white text-sm font-medium truncate">{image.label}</p>
              </div>
              
              {isSelected && (
                <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
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
