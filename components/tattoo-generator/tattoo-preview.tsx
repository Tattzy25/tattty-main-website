"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TattooPreviewProps {
  imageUrl: string
  className?: string
}

export function TattooPreview({ imageUrl, className }: TattooPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [zoom, setZoom] = useState(1)

  const handleZoomIn = () => {
    if (zoom < 2) setZoom(zoom + 0.25)
  }

  const handleZoomOut = () => {
    if (zoom > 0.5) setZoom(zoom - 0.25)
  }

  return (
    <div className={cn("relative rounded-lg overflow-hidden border border-zinc-700", className)}>
      <div className="aspect-square relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
          </div>
        )}
        <div
          className="relative h-full w-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Tattoo design"
            fill
            className="object-contain"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-md p-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-black/40"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs text-white font-medium">{Math.round(zoom * 100)}%</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-black/40"
          onClick={handleZoomIn}
          disabled={zoom >= 2}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
