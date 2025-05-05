"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { uploadReferenceImages } from "@/app/actions/reference-images"
import { Loader2, Upload, X } from "lucide-react"

export default function ReferenceImageUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [category, setCategory] = useState("")
  const [style, setStyle] = useState("")
  const [tags, setTags] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [progress, setProgress] = useState({ total: 0, current: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!category || !style) {
      toast({
        title: "Missing information",
        description: "Please provide both category and style",
        variant: "destructive",
      })
      return
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setProgress({ total: selectedFiles.length, current: 0 })

    try {
      const formData = new FormData()
      formData.append("category", category)
      formData.append("style", style)
      formData.append("tags", tags)

      selectedFiles.forEach((file) => {
        formData.append("files", file)
      })

      const result = await uploadReferenceImages(formData)

      if (result.success) {
        toast({
          title: "Upload successful",
          description: `Successfully uploaded ${result.successCount} files. ${result.failureCount} failed.`,
        })

        // Reset form
        setSelectedFiles([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload files",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-white">Upload Reference Images</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Traditional, Japanese, Geometric"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Input
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g., Blackwork, Watercolor, Minimalist"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Textarea
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., flowers, animals, geometric, linework"
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="files">Select Files</Label>
          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
            <Input
              ref={fileInputRef}
              id="files"
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Images
            </Button>
            <p className="mt-2 text-sm text-zinc-400">JPG, PNG, GIF, WebP up to 10MB each</p>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Files ({selectedFiles.length})</Label>
            <div className="max-h-[200px] overflow-y-auto border border-zinc-800 rounded-lg p-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between py-2 px-3 hover:bg-zinc-800 rounded-md"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-zinc-700 rounded flex items-center justify-center mr-3">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={file.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-zinc-700 rounded" />
                      )}
                    </div>
                    <div className="truncate max-w-[200px]">{file.name}</div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button type="submit" disabled={isUploading || selectedFiles.length === 0} className="w-full">
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading ({progress.current}/{progress.total})
            </>
          ) : (
            "Upload Images"
          )}
        </Button>
      </form>

      <div className="mt-6 text-sm text-zinc-400">
        <p>Tips:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Use descriptive categories and styles for better organization</li>
          <li>Add relevant tags to make images searchable</li>
          <li>You can upload multiple files at once</li>
          <li>These images will only be used for AI reference, not shown to users</li>
        </ul>
      </div>
    </div>
  )
}
