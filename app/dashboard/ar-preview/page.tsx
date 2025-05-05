"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Icons } from "@/components/icons"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

export default function ARPreviewPage() {
  const searchParams = useSearchParams()
  const designId = searchParams.get("design")
  const [design, setDesign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cameraActive, setCameraActive] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [scale, setScale] = useState(50)
  const [rotation, setRotation] = useState(0)
  const [opacity, setOpacity] = useState(80)
  const [isDragging, setIsDragging] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const tattooImageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (designId) {
      fetchDesign(designId)
    } else {
      setLoading(false)
    }

    // Cleanup function to stop camera when component unmounts
    return () => {
      stopCamera()
    }
  }, [designId])

  const fetchDesign = async (id: string) => {
    try {
      // Get design from database
      const { data, error } = await supabase.from("tattoo_designs").select("*").eq("id", id).single()

      if (error) throw error

      setDesign(data)

      // Preload the tattoo image
      if (data?.image_url) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = data.image_url
        img.onload = () => {
          tattooImageRef.current = img
        }
      }
    } catch (error) {
      console.error("Error fetching design:", error)
      toast({
        title: "Error",
        description: "Failed to load the design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in your browser")
      }

      if (videoRef.current) {
        // Try to use the environment-facing camera first (back camera on mobile)
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          })
          videoRef.current.srcObject = stream
        } catch (err) {
          // Fall back to any available camera
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          })
          videoRef.current.srcObject = stream
        }

        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
            setCameraActive(true)
            startARPreview()
          }
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: error instanceof Error ? error.message : "Failed to access your camera",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }

  const startARPreview = () => {
    if (!canvasRef.current || !videoRef.current || !design) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // If we haven't preloaded the image yet, do it now
    if (!tattooImageRef.current) {
      const tattooImage = new Image()
      tattooImage.crossOrigin = "anonymous"
      tattooImage.src = design.image_url
      tattooImage.onload = () => {
        tattooImageRef.current = tattooImage
      }
    }

    const drawFrame = () => {
      if (!canvasRef.current || !videoRef.current) return

      // Set canvas dimensions to match video
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight

      // Draw video frame
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

      // Draw tattoo if image is loaded
      if (tattooImageRef.current) {
        // Calculate tattoo position and size
        const tattooWidth = (canvasRef.current.width * scale) / 100
        const tattooHeight = (tattooImageRef.current.height / tattooImageRef.current.width) * tattooWidth
        const tattooX = (canvasRef.current.width * position.x) / 100 - tattooWidth / 2
        const tattooY = (canvasRef.current.height * position.y) / 100 - tattooHeight / 2

        // Save context state
        ctx.save()

        // Translate to center of tattoo for rotation
        ctx.translate(tattooX + tattooWidth / 2, tattooY + tattooHeight / 2)
        ctx.rotate((rotation * Math.PI) / 180)

        // Set opacity
        ctx.globalAlpha = opacity / 100

        // Draw tattoo
        ctx.drawImage(tattooImageRef.current, -tattooWidth / 2, -tattooHeight / 2, tattooWidth, tattooHeight)

        // Restore context state
        ctx.restore()
      }

      // Continue animation
      animationRef.current = requestAnimationFrame(drawFrame)
    }

    drawFrame()
  }

  const takeScreenshot = () => {
    if (!canvasRef.current) return

    try {
      // Create a download link
      const link = document.createElement("a")
      link.download = `tattzy-ar-preview-${Date.now()}.png`
      link.href = canvasRef.current.toDataURL("image/png")
      link.click()

      // Save screenshot to database if user is logged in
      saveScreenshot(link.href)

      toast({
        title: "Screenshot Saved",
        description: "Your AR preview has been saved to your device.",
      })
    } catch (error) {
      console.error("Error taking screenshot:", error)
      toast({
        title: "Error",
        description: "Failed to save screenshot. Please try again.",
        variant: "destructive",
      })
    }
  }

  const saveScreenshot = async (screenshotUrl: string) => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return // Not logged in

      // Convert data URL to blob
      const res = await fetch(screenshotUrl)
      const blob = await res.blob()

      // Upload to Supabase Storage
      const fileName = `ar-previews/${user.id}/${Date.now()}.png`
      const { error: uploadError } = await supabase.storage.from("tattoo-designs").upload(fileName, blob)

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("tattoo-designs").getPublicUrl(fileName)

      // Save to ar_previews table
      await supabase.from("ar_previews").insert({
        user_id: user.id,
        design_id: design.id,
        image_url: publicUrl,
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error saving screenshot to database:", error)
      // Don't show error to user since the local download still worked
    }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    setIsDragging(true)
    updateTattooPosition(e)
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      updateTattooPosition(e)
    }
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
  }

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    setIsDragging(true)
    updateTattooPositionTouch(e)
  }

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      updateTattooPositionTouch(e)
      // Prevent scrolling while dragging
      e.preventDefault()
    }
  }

  const handleCanvasTouchEnd = () => {
    setIsDragging(false)
  }

  const updateTattooPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPosition({ x, y })
  }

  const updateTattooPositionTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !e.touches[0]) return

    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100

    setPosition({ x, y })
  }

  const switchCamera = async () => {
    if (!videoRef.current) return

    // Stop current stream
    if (videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }

    try {
      // Get current facing mode
      const currentStream = videoRef.current.srcObject as MediaStream
      const currentTrack = currentStream?.getVideoTracks()[0]
      const currentFacingMode = currentTrack?.getSettings()?.facingMode

      // Switch to opposite facing mode
      const newFacingMode = currentFacingMode === "environment" ? "user" : "environment"

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
      })

      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.play()
        }
      }
    } catch (error) {
      console.error("Error switching camera:", error)
      toast({
        title: "Camera Error",
        description: "Failed to switch camera. Your device may only have one camera.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gold-500">AR Tattoo Preview</h1>
          {cameraActive && (
            <div className="flex gap-2">
              <Button onClick={switchCamera} className="bg-gold-500/80 hover:bg-gold-600 text-black">
                <Icons.flipHorizontal className="mr-2 h-4 w-4" />
                Switch Camera
              </Button>
              <Button onClick={takeScreenshot} className="bg-gold-500 hover:bg-gold-600 text-black">
                <Icons.camera className="mr-2 h-4 w-4" />
                Take Screenshot
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[500px]">
            <Icons.spinner className="h-8 w-8 animate-spin text-gold-500" />
          </div>
        ) : !design && !designId ? (
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-8 text-center">
            <Icons.image className="h-12 w-12 text-gold-500/50 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gold-500 mb-2">No Design Selected</h2>
            <p className="text-zinc-400 mb-6">Select a tattoo design from your collection to preview it in AR.</p>
            <Button asChild className="bg-gold-500 hover:bg-gold-600 text-black">
              <a href="/dashboard/designs">Browse My Designs</a>
            </Button>
          </div>
        ) : !design && designId ? (
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-8 text-center">
            <Icons.alertTriangle className="h-12 w-12 text-amber-500/50 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-amber-500 mb-2">Design Not Found</h2>
            <p className="text-zinc-400 mb-6">
              The requested design could not be found. It may have been deleted or you may not have access to it.
            </p>
            <Button asChild className="bg-gold-500 hover:bg-gold-600 text-black">
              <a href="/dashboard/designs">Browse My Designs</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-4 h-full">
                  {!cameraActive ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <div className="relative w-full max-w-[300px] aspect-square mb-8">
                        <Image
                          src={design.image_url || "/placeholder.svg"}
                          alt={design.title || "Tattoo design"}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h2 className="text-xl font-bold text-gold-500 mb-2">{design.title || "Untitled Design"}</h2>
                      <p className="text-zinc-400 mb-6">
                        Use the AR preview to see how this tattoo would look on your body.
                      </p>
                      <Button onClick={startCamera} className="bg-gold-500 hover:bg-gold-600 text-black">
                        <Icons.camera className="mr-2 h-4 w-4" />
                        Start AR Preview
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        className="w-full h-auto rounded-lg"
                        playsInline
                        muted
                        style={{ display: "none" }}
                      />
                      <canvas
                        ref={canvasRef}
                        className="w-full h-auto rounded-lg cursor-move touch-none"
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                        onTouchStart={handleCanvasTouchStart}
                        onTouchMove={handleCanvasTouchMove}
                        onTouchEnd={handleCanvasTouchEnd}
                      />
                      <Button
                        onClick={stopCamera}
                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600"
                        size="sm"
                      >
                        <Icons.x className="mr-2 h-4 w-4" />
                        Stop Camera
                      </Button>
                      <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg">
                        <p className="text-xs text-white/80 mb-2">Drag the tattoo to position it on your body</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
                <h2 className="text-xl font-bold text-gold-500 mb-6">Adjust Tattoo</h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-zinc-300">Size</label>
                      <span className="text-sm text-zinc-400">{scale}%</span>
                    </div>
                    <Slider
                      value={[scale]}
                      min={10}
                      max={100}
                      step={1}
                      onValueChange={(value) => setScale(value[0])}
                      disabled={!cameraActive}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-zinc-300">Rotation</label>
                      <span className="text-sm text-zinc-400">{rotation}°</span>
                    </div>
                    <Slider
                      value={[rotation]}
                      min={0}
                      max={360}
                      step={1}
                      onValueChange={(value) => setRotation(value[0])}
                      disabled={!cameraActive}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-zinc-300">Opacity</label>
                      <span className="text-sm text-zinc-400">{opacity}%</span>
                    </div>
                    <Slider
                      value={[opacity]}
                      min={20}
                      max={100}
                      step={1}
                      onValueChange={(value) => setOpacity(value[0])}
                      disabled={!cameraActive}
                    />
                  </div>

                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-sm text-zinc-400 mb-4">
                      Drag the tattoo to position it on your body. Use the controls above to adjust size, rotation, and
                      opacity.
                    </p>
                    <p className="text-sm text-zinc-400">
                      For best results, ensure good lighting and hold your device steady.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
