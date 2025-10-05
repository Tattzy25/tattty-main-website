import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"
import { list } from "@vercel/blob"

export async function GET() {
  try {
    // Get inspiration categories from database
    const { data, error } = await executeQuery<{
      id: string
      name: string
      description: string | null
      slug: string
    }[]>(
      "SELECT id, name, description, slug FROM inspiration_categories ORDER BY name ASC"
    )

    if (error || !data) {
      console.error("Error fetching inspiration:", error)
      return NextResponse.json({ error: "Failed to fetch inspiration" }, { status: 500 })
    }

    // Get blob images
    const blobResult = await list()
    const blobs = blobResult.blobs || []

    // Group blobs by category folders
    const categoryImages: { [key: string]: string[] } = {}

    blobs.forEach(blob => {
      // Skip folder entries (they have size 0)
      if (blob.size === 0) return

      const pathParts = blob.pathname.split('/')
      if (pathParts.length >= 2) {
        const folder = pathParts[0]
        if (!categoryImages[folder]) {
          categoryImages[folder] = []
        }
        categoryImages[folder].push(blob.url)
      }
    })

    // Map database categories to blob images
    const inspiration = data.map(category => {
      // Try to match category with blob folders
      let images: string[] = []

      // Map category names to blob folders
      const folderMappings: { [key: string]: string } = {
        'Traditional': 'row_1_style_inkd',
        'Neo-Traditional': 'row_1_style_inkd',
        'Realism': 'row_1_style_inkd',
        'Watercolor': 'row_1_style_inkd',
        'Blackwork': 'row_1_style_inkd',
        'Japanese': 'row_1_style_inkd',
        'Tribal': 'row_1_style_inkd',
        'Minimalist': 'row_1_style_inkd',
        'Geometric': 'row_1_style_inkd',
        'Dotwork': 'row_1_style_inkd',
        'Old School': 'row_1_style_inkd',
        'New School': 'row_1_style_inkd',
        'Biomechanical': 'row_1_style_inkd',
        'Portrait': 'row_1_style_inkd',
        'Script': 'row_1_style_inkd',
        'Floral': 'row_1_style_inkd',
        'Animal': 'row_1_style_inkd',
        'Mandala': 'row_1_style_inkd',
        'Abstract': 'row_1_style_inkd',
        'Surrealism': 'row_1_style_inkd'
      }

      const folderName = folderMappings[category.name] || 'row_1_style_inkd'
      images = categoryImages[folderName] || []

      return {
        id: category.id,
        title: category.name,
        description: category.description || `${category.name} tattoo style inspiration`,
        images: images.map((url, index) => ({
          id: index + 1,
          url: url,
          alt: `${category.name} tattoo design ${index + 1}`
        })),
        category: category.name,
        slug: category.slug,
        isFeatured: images.length > 0
      }
    })

    return NextResponse.json(inspiration)
  } catch (error) {
    console.error("Error in inspiration API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}