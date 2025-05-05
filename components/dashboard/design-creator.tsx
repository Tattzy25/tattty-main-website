"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/ui/image-upload"
import { uploadTattooDesign } from "@/app/actions/upload"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  style: z.string().optional(),
  size: z.string().optional(),
  placement: z.string().optional(),
  colorScheme: z.string().optional(),
  complexity: z.number().min(1).max(10).default(5),
  detailLevel: z.number().min(1).max(10).default(5),
  includeText: z.boolean().default(false),
  textContent: z.string().optional(),
})

export function DesignCreator() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("guided")
  const [userId, setUserId] = useState<string | null>(null)

  // Get the current user ID
  useState(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUserId(data.user.id)
      }
    }
    getUserId()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      style: undefined,
      size: undefined,
      placement: undefined,
      colorScheme: undefined,
      complexity: 5,
      detailLevel: 5,
      includeText: false,
      textContent: "",
    },
  })

  const watchIncludeText = form.watch("includeText")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to create a design",
        variant: "destructive",
      })
      return
    }

    if (selectedFile) {
      // Upload the file
      setIsUploading(true)

      const formData = new FormData()
      formData.append("userId", userId)
      formData.append("title", values.name)
      formData.append("description", values.description)
      formData.append("style", values.style || "custom")
      formData.append("file", selectedFile)

      const result = await uploadTattooDesign(formData)

      setIsUploading(false)

      if (result.success) {
        toast({
          title: "Design uploaded!",
          description: "Your tattoo design has been saved successfully.",
        })

        // Navigate to the designs page
        router.push("/dashboard/designs")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to upload design. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      // Generate AI design
      setIsGenerating(true)
      try {
        // Simulate design generation
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Set a placeholder image
        setGeneratedImage("/placeholder.svg?height=400&width=400")

        toast({
          title: "Design generated!",
          description: "Your tattoo design has been created successfully.",
        })

        // In a real app, you would save the design to the database here
        // For now, we'll just simulate a successful generation
        setTimeout(() => {
          router.push("/dashboard/designs")
        }, 3000)
      } catch (error) {
        console.error("Error generating design:", error)
        toast({
          title: "Error",
          description: "Failed to generate design. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsGenerating(false)
      }
    }
  }

  const handleFileUpload = (file: File) => {
    setSelectedFile(file)
    setGeneratedImage(null) // Clear any generated image
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_400px]">
      <div>
        <Tabs defaultValue="guided" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="guided">Guided Creation</TabsTrigger>
            <TabsTrigger value="freeform">Freeform Description</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold-300">Design Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My Awesome Tattoo"
                        {...field}
                        className="bg-black/20 border-gold-500/30 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <TabsContent value="guided" className="space-y-6 mt-0">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold-300">Tattoo Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-gold-500/30 text-white">
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="traditional">Traditional</SelectItem>
                            <SelectItem value="neo-traditional">Neo-Traditional</SelectItem>
                            <SelectItem value="realism">Realism</SelectItem>
                            <SelectItem value="watercolor">Watercolor</SelectItem>
                            <SelectItem value="tribal">Tribal</SelectItem>
                            <SelectItem value="japanese">Japanese</SelectItem>
                            <SelectItem value="blackwork">Blackwork</SelectItem>
                            <SelectItem value="minimalist">Minimalist</SelectItem>
                            <SelectItem value="geometric">Geometric</SelectItem>
                            <SelectItem value="dotwork">Dotwork</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold-300">Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-gold-500/30 text-white">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="small">Small (2-3 inches)</SelectItem>
                            <SelectItem value="medium">Medium (4-6 inches)</SelectItem>
                            <SelectItem value="large">Large (7-10 inches)</SelectItem>
                            <SelectItem value="extra-large">Extra Large (11+ inches)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="placement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold-300">Placement</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-gold-500/30 text-white">
                              <SelectValue placeholder="Select placement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="arm">Arm</SelectItem>
                            <SelectItem value="forearm">Forearm</SelectItem>
                            <SelectItem value="shoulder">Shoulder</SelectItem>
                            <SelectItem value="back">Back</SelectItem>
                            <SelectItem value="chest">Chest</SelectItem>
                            <SelectItem value="leg">Leg</SelectItem>
                            <SelectItem value="ankle">Ankle</SelectItem>
                            <SelectItem value="wrist">Wrist</SelectItem>
                            <SelectItem value="neck">Neck</SelectItem>
                            <SelectItem value="ribs">Ribs</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="colorScheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold-300">Color Scheme</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-gold-500/30 text-white">
                              <SelectValue placeholder="Select colors" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="black-and-gray">Black & Gray</SelectItem>
                            <SelectItem value="full-color">Full Color</SelectItem>
                            <SelectItem value="black-and-red">Black & Red</SelectItem>
                            <SelectItem value="blue-tones">Blue Tones</SelectItem>
                            <SelectItem value="earth-tones">Earth Tones</SelectItem>
                            <SelectItem value="pastel">Pastel</SelectItem>
                            <SelectItem value="vibrant">Vibrant</SelectItem>
                            <SelectItem value="monochromatic">Monochromatic</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Design Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what you want in your tattoo design..."
                          className="min-h-[120px] bg-black/20 border-gold-500/30 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide details about the elements, theme, and meaning you want in your tattoo.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Upload your own design */}
                <div className="border border-gold-500/20 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gold-300 mb-4">Upload Your Own Design</h3>
                  <ImageUpload
                    onUpload={handleFileUpload}
                    onRemove={handleFileRemove}
                    label="Upload a design image"
                    loading={isUploading}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="complexity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold-300">Complexity: {field.value}/10</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-4"
                          />
                        </FormControl>
                        <FormDescription>
                          Higher complexity means more intricate designs with more elements.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="detailLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold-300">Detail Level: {field.value}/10</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-4"
                          />
                        </FormControl>
                        <FormDescription>Higher detail means finer lines and more precise elements.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="includeText"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gold-500/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gold-300">Include Text</FormLabel>
                        <FormDescription>Add text or lettering to your tattoo design.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchIncludeText && (
                  <FormField
                    control={form.control}
                    name="textContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold-300">Text Content</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter text for your tattoo..."
                            {...field}
                            className="bg-black/20 border-gold-500/30 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>

              <TabsContent value="freeform" className="mt-0">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your tattoo in detail..."
                          className="min-h-[300px] bg-black/20 border-gold-500/30 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Be as specific as possible. Include style, elements, colors, size, placement, and any other
                        details that will help create your perfect tattoo design.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Upload your own design */}
                <div className="border border-gold-500/20 rounded-lg p-4 mt-6">
                  <h3 className="text-lg font-medium text-gold-300 mb-4">Upload Your Own Design</h3>
                  <ImageUpload
                    onUpload={handleFileUpload}
                    onRemove={handleFileRemove}
                    label="Upload a design image"
                    loading={isUploading}
                  />
                </div>
              </TabsContent>

              <Button
                type="submit"
                className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                disabled={isGenerating || isUploading}
              >
                {isGenerating ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Generating Design...
                  </>
                ) : isUploading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Uploading Design...
                  </>
                ) : selectedFile ? (
                  <>
                    <Icons.upload className="mr-2 h-4 w-4" /> Upload Design
                  </>
                ) : (
                  <>
                    <Icons.image className="mr-2 h-4 w-4" /> Generate Design
                  </>
                )}
              </Button>
            </form>
          </Form>
        </Tabs>
      </div>

      <div className="sticky top-24 self-start">
        <Card className="border-gold-500/20 bg-black/40">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gold-500 mb-4">Preview</h3>
            {generatedImage ? (
              <div className="aspect-square rounded-md overflow-hidden">
                <img
                  src={generatedImage || "/placeholder.svg"}
                  alt="Generated tattoo design"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : selectedFile ? (
              <div className="aspect-square rounded-md overflow-hidden">
                <img
                  src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                  alt="Selected tattoo design"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square rounded-md bg-black/40 border border-dashed border-gold-500/20 flex items-center justify-center">
                <div className="text-center p-4">
                  <Icons.image className="h-12 w-12 text-gold-500/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">
                    Your design preview will appear here after generation or upload.
                  </p>
                </div>
              </div>
            )}
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                {selectedFile
                  ? "Your uploaded design will be saved to your account."
                  : "The design will be generated based on your specifications. You can save, edit, or regenerate the design after it's created."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
