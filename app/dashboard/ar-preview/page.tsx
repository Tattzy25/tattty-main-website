"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Icons } from "@/components/icons"
import { getDesignById } from "@/lib/supabase"

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
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (designId) {
      fetchDesign(designId)
    } else {
      setLoading(false)
    }
  }, [designId])

  const fetchDesign = async (id: string) => {
    try {
      const designData = await getDesignById(id)
      setDesign(designData)
    } catch (error) {
      console.error("Error fetching design:", error)
    } finally {
      setLoading(false)
    }
  }

  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setCameraActive(true)
          startARPreview()
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
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

    const tattooImage = new Image()
    tattooImage.src = design.image_url
    tattooImage.crossOrigin = "anonymous"

    const drawFrame = () => {
      if (!canvasRef.current || !videoRef.current) return

      // Set canvas dimensions to match video
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight

      // Draw video frame
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

      // Calculate tattoo position and size
      const tattooWidth = (canvasRef.current.width * scale) / 100
      const tattooHeight = (tattooImage.height / tattooImage.width) * tattooWidth
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
      ctx.drawImage(tattooImage, -tattooWidth / 2, -tattooHeight / 2, tattooWidth, tattooHeight)

      // Restore context state
      ctx.restore()

      // Continue animation
      animationRef.current = requestAnimationFrame(drawFrame)
    }

    tattooImage.onload = () => {
      drawFrame()
    }
  }

  const takeScreenshot = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `tattty-ar-preview-${Date.now()}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gold-500">AR Tattoo Preview</h1>
          {cameraActive && (
            <Button onClick={takeScreenshot} className="bg-gold-500 hover:bg-gold-600 text-black">
              <Icons.camera className="mr-2 h-4 w-4" />
              Take Screenshot
            </Button>
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
                      <canvas ref={canvasRef} className="w-full h-auto rounded-lg" />
                      <Button
                        onClick={stopCamera}
                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600"
                        size="sm"
                      >
                        <Icons.x className="mr-2 h-4 w-4" />
                        Stop Camera
                      </Button>
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
