"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface GalleryItem {
  id: number
  title: string
  description: string
  imageUrl: string
}

interface GalleryCarouselProps {
  items: GalleryItem[]
}

export function GalleryCarousel({ items }: GalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Get the correct index with wrapping
  const getWrappedIndex = (index: number) => {
    return ((index % items.length) + items.length) % items.length
  }

  // Navigate to the next slide
  const goToNext = useCallback(() => {
    setActiveIndex((prev) => getWrappedIndex(prev + 1))
  }, [items.length])

  // Navigate to the previous slide
  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => getWrappedIndex(prev - 1))
  }, [items.length])

  // Auto-advance the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        goToNext()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [goToNext, isDragging])

  // Touch and mouse event handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true)
    if ("touches" in e) {
      setStartX(e.touches[0].clientX)
    } else {
      setStartX(e.clientX)
    }
  }

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return

    let currentX
    if ("touches" in e) {
      currentX = e.touches[0].clientX
    } else {
      currentX = e.clientX
    }

    const diff = startX - currentX

    // Prevent default to stop scrolling when swiping
    if (Math.abs(diff) > 5) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return

    let endX
    if ("changedTouches" in e) {
      endX = e.changedTouches[0].clientX
    } else {
      endX = e.clientX
    }

    const diff = startX - endX

    // Threshold for swipe detection
    if (diff > 50) {
      goToNext()
    } else if (diff < -50) {
      goToPrev()
    }

    setIsDragging(false)
  }

  // Prevent default on drag to avoid text selection
  useEffect(() => {
    const preventDefault = (e: Event) => {
      if (isDragging) e.preventDefault()
    }
    document.addEventListener("dragstart", preventDefault)
    return () => {
      document.removeEventListener("dragstart", preventDefault)
    }
  }, [isDragging])

  // Render the carousel items
  const renderCarouselItems = () => {
    return [-1, 0, 1].map((offset) => {
      const index = getWrappedIndex(activeIndex + offset)
      const item = items[index]

      return (
        <div
          key={`${item.id}-${offset}`}
          className={cn(
            "absolute transition-all duration-500 ease-out transform",
            offset === -1 && "left-[5%] md:left-[15%] z-10 opacity-60 scale-75",
            offset === 0 && "left-1/2 -translate-x-1/2 z-20",
            offset === 1 && "right-[5%] md:right-[15%] z-10 opacity-60 scale-75",
          )}
        >
          <div
            className={cn(
              "transition-all duration-500 ease-out",
              offset === 0
                ? "w-[250px] h-[300px] md:w-[350px] md:h-[400px]"
                : "w-[150px] h-[200px] md:w-[200px] md:h-[250px]",
            )}
          >
            {offset === 0 && (
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-xl blur-sm"></div>
            )}
            <div
              className={cn(
                "relative rounded-lg overflow-hidden h-full",
                offset === 0 ? "border-2 border-purple-500" : "border border-zinc-700",
              )}
            >
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                width={offset === 0 ? 350 : 200}
                height={offset === 0 ? 400 : 250}
                className={cn("w-full h-full object-cover", offset !== 0 && "filter grayscale")}
              />
              {offset === 0 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-zinc-300">{item.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="w-full py-10">
      <div className="relative mx-auto max-w-6xl px-4">
        {/* Navigation Buttons - Positioned outside the carousel */}
        <button
          onClick={goToPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-zinc-800/50 text-white hover:bg-zinc-700/70 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-zinc-800/50 text-white hover:bg-zinc-700/70 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-8 w-8" />
        </button>

        {/* Carousel Container with Touch Events */}
        <div
          ref={carouselRef}
          className="relative h-[350px] md:h-[450px] mx-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove as any}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove as any}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          style={{ touchAction: "pan-y" }}
        >
          {renderCarouselItems()}
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-8 gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                activeIndex === index
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 w-6"
                  : "bg-zinc-600 hover:bg-zinc-500",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
