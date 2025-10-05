"use server"

import { executeQuery } from "@/lib/neon"

export async function getStyleImages() {
  try {
    // Get all inspiration categories (styles) from database
    const { data, error } = await executeQuery<{ id: string; name: string; description: string | null; image_url: string | null }[]>(
      "SELECT id, name, description, image_url FROM inspiration_categories ORDER BY name ASC"
    )

    if (error || !data) {
      console.error("Error fetching style images:", error)
      return []
    }

    // Return image URLs, fallback to placeholder if no image_url
    return data.map(category => 
      category.image_url || `https://images.unsplash.com/photo-1590246814883-57c511548d8c?w=400&h=400&fit=crop&text=${encodeURIComponent(category.name)}`
    )
  } catch (error) {
    console.error("Error in getStyleImages:", error)
    return []
  }
}
