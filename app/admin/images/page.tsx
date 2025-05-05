import type { Metadata } from "next"
import ImageUploader from "@/components/admin/image-uploader"

export const metadata: Metadata = {
  title: "Image Uploader | Tattty Admin",
  description: "Upload and manage tattoo images for the inspiration gallery",
}

export default function ImageUploaderPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Image Uploader</h1>
      <ImageUploader />
    </div>
  )
}
