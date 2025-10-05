"use client"

import { useState, useEffect } from "react"
import { type ImageObject } from "@/components/image-gallery"
import { getStyleImages } from "@/app/actions/get-style-images"
import { allInkSpecs } from "@/data/tattty-card-7"

export function useImageLoading() {
  // Card 7 - Images for all 4 categories (dynamic)
  const [categoryImages, setCategoryImages] = useState<{[key: string]: ImageObject[]}>({
    style: [],
    color: [],
    size: [],
    placement: []
  })

  // Fetch images for all categories on mount
  useEffect(() => {
    async function loadImages() {
      const images = await getStyleImages()
      
      // Convert strings to ImageObjects with labels from category data
      const createImageObjects = (urls: string[], labels: string[]): ImageObject[] => {
        return urls.map((url, index) => ({
          url,
          label: labels[index % labels.length] // Cycle through labels
        }))
      }
      
      setCategoryImages({
        style: createImageObjects(images, allInkSpecs.style.labels),
        color: createImageObjects(images, allInkSpecs.color.labels),
        size: createImageObjects(images, allInkSpecs.size.labels),
        placement: createImageObjects(images, allInkSpecs.placement.labels)
      })
    }
    loadImages()
  }, [])

  return {
    categoryImages
  }
}
