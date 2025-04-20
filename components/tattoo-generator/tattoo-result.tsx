"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface TattooResultProps {
  imageUrl?: string
  imageData?: string // Add support for base64 image data
  prompt: string
  onRegenerate: () => void
  onStartOver: () => void
}

export function TattooResult({ imageUrl, imageData, prompt, onRegenerate, onStartOver }: TattooResultProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // Create a download link for the image
      const link = document.createElement("a")

      if (imageData) {
        // If we have base64 data
        link.href = `data:image/png;base64,${imageData}`
      } else if (imageUrl) {
        // If we have a URL
        link.href = imageUrl
      } else {
        throw new Error("No image data available")
      }

      link.download = `tattoo-design-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download Complete",
        description: "Your tattoo design has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download your tattoo design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // In a real implementation, this would save the image to the user's account
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Design Saved",
        description: "Your tattoo design has been saved to your account.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save your tattoo design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      // In a real implementation, this would share the image to the gallery
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Design Shared",
        description: "Your tattoo design has been shared to the gallery.",
      })
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share your tattoo design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  // Determine the image source
  const imageSrc = imageData
    ? `data:image/png;base64,${imageData}`
    : imageUrl || "/placeholder.svg?height=512&width=512&text=No+Image"

  return (
    <Card className="border-gold-500/20 bg-black/40 max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gold-500 text-center">Your Unique Tattoo Design</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gold-500">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-amber-500 to-purple-600 rounded-lg blur-sm"></div>
              <div className="relative rounded-lg overflow-hidden h-full">
                {/* Use the image source determined above */}
                <Image
                  src={imageSrc || "/placeholder.svg"}
                  alt="Generated tattoo design"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Design Prompt</h3>
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-4 text-zinc-300 text-sm">
                  {prompt}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
                  disabled={isDownloading || (!imageUrl && !imageData)}
                >
                  {isDownloading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Downloading...
                    </>
                  ) : (
                    <>
                      <Icons.download className="mr-2 h-4 w-4" /> Download
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleSave}
                  variant="outline"
                  className="border-gold-500/30 hover:bg-gold-500/10"
                  disabled={isSaving || (!imageUrl && !imageData)}
                >
                  {isSaving ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Icons.save className="mr-2 h-4 w-4" /> Save to Account
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-gold-500/30 hover:bg-gold-500/10"
                  disabled={isSharing || (!imageUrl && !imageData)}
                >
                  {isSharing ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Sharing...
                    </>
                  ) : (
                    <>
                      <Icons.share className="mr-2 h-4 w-4" /> Share to Gallery
                    </>
                  )}
                </Button>

                <Button onClick={onRegenerate} variant="outline" className="border-gold-500/30 hover:bg-gold-500/10">
                  <Icons.refresh className="mr-2 h-4 w-4" /> Regenerate
                </Button>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <Button
                  onClick={onStartOver}
                  variant="ghost"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <Icons.arrowLeft className="mr-2 h-4 w-4" /> Start Over
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
