"use client"

import type React from "react"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onImageSelected: (file: File) => void
  onImageRemoved?: () => void
  className?: string
  defaultImage?: string
  aspectRatio?: "square" | "wide" | "tall"
  maxSizeMB?: number
  label?: string
  accept?: string
}

export function ImageUpload({
  onImageSelected,
  onImageRemoved,
  className = "",
  defaultImage,
  aspectRatio = "square",
  maxSizeMB = 10,
  label = "Upload Image",
  accept = "image/jpeg, image/png, image/webp, image/gif",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate aspect ratio class
  const aspectRatioClass = {
    square: "aspect-square",
    wide: "aspect-video",
    tall: "aspect-[3/4]",
  }[aspectRatio]

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    validateAndProcessFile(file)
  }

  const validateAndProcessFile = (file: File) => {
    // Reset error state
    setError(null)

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`Image must be smaller than ${maxSizeMB}MB`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Call the callback
    onImageSelected(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    validateAndProcessFile(file)
  }

  const removeImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onImageRemoved?.()
  }

  return (
    <div className={`w-full ${className}`}>
      {preview ? (
        <div className="relative group">
          <div className={`relative overflow-hidden rounded-lg border border-gray-200 ${aspectRatioClass}`}>
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button variant="destructive" size="icon" onClick={removeImage} className="rounded-full">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center
            ${aspectRatioClass} ${isDragging ? "border-primary bg-primary/5" : "border-gray-300"}
            transition-colors cursor-pointer hover:border-primary hover:bg-primary/5
          `}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <svg className="h-10 w-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium text-center">{label}</p>
          <p className="text-xs text-gray-500 mt-1 text-center">Drag & drop or click to browse</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
            aria-label={label}
          />
        </div>
      )}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
