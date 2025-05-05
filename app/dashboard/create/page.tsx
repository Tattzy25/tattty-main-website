"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { DashboardLayout } from "@/components/dashboard/layout"
import { generateImage } from "@/lib/stability"
import { supabase } from "@/lib/supabase"

const TATTOO_STYLES = [
  "Traditional",
  "Neo-Traditional",
  "Japanese",
  "Blackwork",
  "Realism",
  "Watercolor",
  "Geometric",
  "Tribal",
  "New School",
  "Minimalist",
  "Dotwork",
  "Sketch",
  "Illustrative",
  "Chicano",
  "Biomechanical",
  "Portrait",
  "Script",
  "Ornamental",
  "Abstract",
  "Surrealism",
]

export default function TattooDesignPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null)

  const handleGenerateDesign = async () => {
    if (!prompt || !style) {
      toast({
        title: "Missing information",
        description: "Please provide a description and select a style for your tattoo.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const fullPrompt = `Tattoo design in ${style} style: ${prompt}`
      const imageUrl = await generateImage(fullPrompt, style)
      setGeneratedImage(imageUrl)

      // Auto-fill title if empty
      if (!title) {
        setTitle(`${style} Tattoo Design`)
      }

      toast({
        title: "Design generated",
        description: "Your tattoo design has been created successfully.",
      })
    } catch (error) {
      console.error("Error generating design:", error)
      toast({
        title: "Generation failed",
        description: "Failed to generate your tattoo design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveDesign = async () => {
    try {
      setIsSaving(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      let imageUrl = generatedImage

      // If user uploaded an image instead of generating one
      if (uploadedImage && !generatedImage) {
        // Upload to Supabase Storage
        const fileName = `${user.id}/${Date.now()}-${uploadedImage.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("tattoo-designs")
          .upload(fileName, uploadedImage)

        if (uploadError) throw uploadError

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("tattoo-designs").getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      if (!imageUrl) {
        throw new Error("No image available to save")
      }

      // Save to database
      const { data, error } = await supabase
        .from("tattoo_designs")
        .insert({
          user_id: user.id,
          title: title || "Untitled Design",
          description,
          prompt,
          style,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error

      toast({
        title: "Design saved",
        description: "Your tattoo design has been saved successfully.",
      })

      // Redirect to designs page
      router.push("/dashboard/designs")
    } catch (error) {
      console.error("Error saving design:", error)
      toast({
        title: "Save failed",
        description: "Failed to save your tattoo design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gold-500">Create Your Tattoo</h1>
          <Button
            variant="outline"
            className="border-gold-500/30 hover:bg-gold-500/10"
            onClick={() => router.push("/dashboard")}
          >
            <Icons.arrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-gold-500/20 bg-black/40">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Design Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for your design"
                    className="bg-zinc-800/50 border-zinc-700"
                  />
                </div>

                <div>
                  <Label htmlFor="style">Tattoo Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {TATTOO_STYLES.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your tattoo design"
                    className="bg-zinc-800/50 border-zinc-700 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="prompt">Generation Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want your tattoo to look like in detail"
                    className="bg-zinc-800/50 border-zinc-700 min-h-[150px]"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Be specific about symbols, themes, and elements you want to include.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleGenerateDesign}
                    disabled={isGenerating || !prompt || !style}
                    className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <Icons.sparkles className="mr-2 h-4 w-4" /> Generate Design
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-zinc-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-black px-2 text-zinc-500">or</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="border-zinc-700 text-zinc-300"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icons.upload className="mr-2 h-4 w-4" /> Upload Your Own Design
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gold-500/20 bg-black/40">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-full">
                {generatedImage ? (
                  <div className="space-y-4 w-full">
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-zinc-700">
                      <img
                        src={generatedImage || "/placeholder.svg"}
                        alt="Generated tattoo design"
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <Button
                      onClick={handleSaveDesign}
                      disabled={isSaving}
                      className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                    >
                      {isSaving ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Icons.save className="mr-2 h-4 w-4" /> Save Design
                        </>
                      )}
                    </Button>
                  </div>
                ) : uploadedImagePreview ? (
                  <div className="space-y-4 w-full">
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-zinc-700">
                      <img
                        src={uploadedImagePreview || "/placeholder.svg"}
                        alt="Uploaded tattoo design"
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <Button
                      onClick={handleSaveDesign}
                      disabled={isSaving}
                      className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                    >
                      {isSaving ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Icons.save className="mr-2 h-4 w-4" /> Save Design
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <Icons.image className="h-24 w-24 text-zinc-700 mx-auto" />
                    <div>
                      <h3 className="text-xl font-semibold text-gold-500">Your Design Will Appear Here</h3>
                      <p className="text-zinc-400 mt-2">
                        Fill out the form and generate your design, or upload your own image.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
