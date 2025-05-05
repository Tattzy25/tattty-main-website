import { put, del, list, type PutBlobResult } from "@vercel/blob"
import { nanoid } from "nanoid"

// Types for our blob storage functions
export type UploadResult = {
  url: string
  path: string
  success: boolean
  error?: string
}

// File validation
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

/**
 * Validates a file for upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file provided" }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` }
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: "File type not supported" }
  }

  return { valid: true }
}

/**
 * Uploads a file to Vercel Blob
 */
export async function uploadToBlob(
  file: File | Blob,
  folder = "tattoo-designs",
  filename?: string,
): Promise<UploadResult> {
  try {
    // Generate a unique filename if not provided
    const uniqueFilename = filename || `${nanoid()}-${Date.now()}`
    const path = `${folder}/${uniqueFilename}`

    // Upload to Vercel Blob
    const blob: PutBlobResult = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return {
      url: blob.url,
      path: blob.pathname,
      success: true,
    }
  } catch (error) {
    console.error("Error uploading to Blob:", error)
    return {
      url: "",
      path: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during upload",
    }
  }
}

/**
 * Uploads a base64 image to Vercel Blob
 */
export async function uploadBase64ToBlob(base64String: string, folder = "tattoo-designs"): Promise<UploadResult> {
  try {
    // Extract the base64 data
    const base64Data = base64String.split(",")[1]
    if (!base64Data) {
      throw new Error("Invalid base64 string")
    }

    // Determine file type from the base64 string
    const mimeType = base64String.split(";")[0].split(":")[1]
    if (!ALLOWED_FILE_TYPES.includes(mimeType)) {
      throw new Error("Unsupported file type")
    }

    // Convert base64 to blob
    const byteCharacters = atob(base64Data)
    const byteArrays = []
    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512)
      const byteNumbers = new Array(slice.length)
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j)
      }
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }
    const blob = new Blob(byteArrays, { type: mimeType })

    // Generate a unique filename with appropriate extension
    const extension = mimeType.split("/")[1]
    const filename = `${nanoid()}-${Date.now()}.${extension}`

    return uploadToBlob(blob, folder, filename)
  } catch (error) {
    console.error("Error uploading base64 to Blob:", error)
    return {
      url: "",
      path: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during upload",
    }
  }
}

/**
 * Deletes a file from Vercel Blob
 */
export async function deleteFromBlob(path: string): Promise<boolean> {
  try {
    if (!path) return false
    await del(path)
    return true
  } catch (error) {
    console.error("Error deleting from Blob:", error)
    return false
  }
}

/**
 * Lists files in a Vercel Blob folder
 */
export async function listBlobFiles(prefix: string): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix })
    return blobs.map((blob) => blob.url)
  } catch (error) {
    console.error("Error listing Blob files:", error)
    return []
  }
}
