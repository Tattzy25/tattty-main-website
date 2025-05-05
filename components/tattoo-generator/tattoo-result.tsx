"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"

interface TattooResultProps {
  imageUrl: string
  prompt: string
  style: string
}

export function TattooResult({ imageUrl, prompt, style }: TattooResultProps) {
  const [showDetails, setShowDetails] = useState(false)

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `tattty-design-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(imageUrl)
        const blob = await response.blob()

        await navigator.share({
          title: "My Tattty Design",
          text: "Check out this tattoo design created with Tattty!",
          files: [new File([blob], "tattty-design.png", { type: "image/png" })],
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      alert("Sharing is not supported on this browser")
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative rounded-lg overflow-hidden border-4 border-amber-500/50 shadow-2xl">
        <div className="aspect-square relative">
          <Image src={imageUrl || "/placeholder.svg"} alt="Generated tattoo design" fill className="object-contain" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleDownload}
          className="flex-1 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Design
        </Button>

        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share Design
        </Button>
      </div>

      <Button
        variant="link"
        className="text-amber-500 hover:text-amber-400 w-full"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide Details" : "Show Design Details"}
      </Button>

      {showDetails && (
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 space-y-3">
          <div>
            <h3 className="text-amber-500 font-semibold">Style:</h3>
            <p className="text-zinc-300">{style}</p>
          </div>
          <div>
            <h3 className="text-amber-500 font-semibold">Design Prompt:</h3>
            <p className="text-zinc-300">{prompt}</p>
          </div>
        </div>
      )}
    </div>
  )
}
