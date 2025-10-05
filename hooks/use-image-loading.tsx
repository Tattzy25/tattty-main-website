"use client"

import { useState, useEffect } from "react"
import { type ImageObject } from "@/components/image-gallery"
import { allInkSpecs } from "@/data/tattty-card-7"

export function useImageLoading() {
  // Card 7 - Images for all 4 categories (from Pexels API)
  const [categoryImages, setCategoryImages] = useState<{[key: string]: ImageObject[]}>({
    style: [],
    color: [],
    size: [],
    placement: []
  })
  const [loading, setLoading] = useState(true)

  // Load images from Pexels API for all categories
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)

      // Fetch tattoo images for different categories
      const categories = [
        { key: 'style', query: 'tattoo art design' },
        { key: 'color', query: 'colorful tattoo ink' },
        { key: 'size', query: 'tattoo body art' },
        { key: 'placement', query: 'body tattoo placement' }
      ]

      console.log('[IMAGE LOADING] Starting to fetch images for all categories')

      const imagePromises = categories.map(async (category) => {
        console.log(`[IMAGE LOADING] Fetching ${category.key} images...`)
        
        const response = await fetch(`/api/pexels?query=${encodeURIComponent(category.query)}&per_page=12`)
        
        if (!response.ok) {
          const error = await response.json()
          console.error(`[IMAGE LOADING ERROR] Failed to fetch ${category.key}:`, error)
          throw new Error(`Failed to fetch ${category.key} images: ${error.error || response.statusText}`)
        }
        
        const images = await response.json()
        
        if (!images || !Array.isArray(images) || images.length === 0) {
          console.error(`[IMAGE LOADING ERROR] No images for ${category.key}`)
          throw new Error(`No images returned from Pexels API for ${category.key}`)
        }
        
        console.log(`[IMAGE LOADING SUCCESS] Got ${images.length} images for ${category.key}`)
        return { key: category.key, images }
      })

      const results = await Promise.all(imagePromises)
      const newCategoryImages: {[key: string]: ImageObject[]} = {}

      results.forEach(result => {
        newCategoryImages[result.key] = result.images
      })

      console.log('[IMAGE LOADING COMPLETE] All categories loaded:', {
        style: newCategoryImages.style?.length || 0,
        color: newCategoryImages.color?.length || 0,
        size: newCategoryImages.size?.length || 0,
        placement: newCategoryImages.placement?.length || 0
      })

      setCategoryImages(newCategoryImages)
      setLoading(false)
    }

    loadImages()
  }, [])

  return {
    categoryImages,
    loading
  }
}
