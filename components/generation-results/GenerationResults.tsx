"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download, Mail, Heart, Home, RotateCcw } from "lucide-react"
import { ModernImageCard } from "@/components/modern-image-card"

export interface GeneratedImage {
  id: string
  url: string
  type: 'color' | 'stencil'
  option: 1 | 2
  label: string
}

interface GenerationResultsProps {
  images: GeneratedImage[]
  onDownload: (image: GeneratedImage) => void
  onEmail: (image: GeneratedImage) => void
  onSave: (image: GeneratedImage) => void
  onBackHome: () => void
  onStartNew: () => void
}

export function GenerationResults({
  images,
  onDownload,
  onEmail,
  onSave,
  onBackHome,
  onStartNew
}: GenerationResultsProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2" style={{ fontFamily: "'Rock Salt', cursive" }}>
            Your Ink. Your Story.
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            2 unique designs created just for you
          </p>
        </div>
      </div>

      {/* Image Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
            {images.map((image) => (
              <ModernImageCard
                key={image.id}
                imageUrl={image.url}
                imageAlt={image.label}
                title={image.label}
                onDownload={() => onDownload(image)}
                onEmail={() => onEmail(image)}
                onSave={() => onSave(image)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 py-4 px-4 z-20">
        <div className="container mx-auto max-w-4xl flex justify-center gap-4">
          <Button
            onClick={onBackHome}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl px-6"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
          <Button
            onClick={onStartNew}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 rounded-xl px-6"
          >
            <RotateCcw className="w-4 h-4" />
            Start New Design
          </Button>
        </div>
      </div>
    </div>
  )
}
