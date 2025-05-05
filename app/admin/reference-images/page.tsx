import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReferenceImageUploader from "@/components/admin/reference-image-uploader"
import ReferenceImageBrowser from "@/components/admin/reference-image-browser"

export default function ReferenceImagesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Reference Image Management</h1>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
          <TabsTrigger value="browse">Browse Library</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <ReferenceImageUploader />
        </TabsContent>

        <TabsContent value="browse">
          <ReferenceImageBrowser />
        </TabsContent>
      </Tabs>
    </div>
  )
}
