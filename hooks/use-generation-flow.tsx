"use client"

import { useState } from "react"
import { type ImageObject } from "@/components/image-gallery"
import { type GeneratedImage } from "@/components/generation-results"
import { generateTattooImages } from "@/lib/ai-logic"
import { ANIMATION_TIMING } from "@/lib/constants"
import { downloadImage, emailImage, saveToProfile, navigateToHome, startNewDesign } from "@/lib/result-handlers"

export function useGenerationFlow() {
  // Generation Flow States
  const [isGenerating, setIsGenerating] = useState(false) // Full-screen loading state
  const [generatedImages, setGeneratedImages] = useState<any[]>([]) // 4 generated images
  const [showResults, setShowResults] = useState(false) // Show results screen

  // Build Button Handler - Trigger Generation
  const handleBuildClick = async (
    sentMessages: string[],
    totalQuestions: number,
    selectedImages: {[key: string]: ImageObject[]},
    uploadedImages: File[]
  ) => {
    console.log('🎨 Build button clicked - Starting generation flow')
    
    // Step 1: Start generating (triggers loading state)
    setIsGenerating(true)
    
    // Step 2: Call AI generation function
    try {
      const images = await generateTattooImages(
        sentMessages.slice(0, totalQuestions),
        selectedImages,
        uploadedImages,
        sentMessages[totalQuestions + 1] // Card 8 additional notes
      )
      
      // Step 3: Set generated images
      setGeneratedImages(images)
      
      // Step 4: Transition to results
      setTimeout(() => {
        setIsGenerating(false)
        setShowResults(true)
      }, ANIMATION_TIMING.FADE_OUT)
      
    } catch (error) {
      console.error('Generation failed:', error)
      setIsGenerating(false)
      alert('Failed to generate tattoo images. Please try again.')
    }
  }

  // Results Screen - Download Image
  const handleDownload = (image: GeneratedImage) => {
    downloadImage(image)
  }

  // Results Screen - Email Image
  const handleEmail = (image: GeneratedImage) => {
    emailImage(image)
  }

  // Results Screen - Save to Profile
  const handleSave = (image: GeneratedImage) => {
    saveToProfile(image)
  }

  // Results Screen - Back to Home
  const handleBackHome = () => {
    navigateToHome()
  }

  // Results Screen - Start New Design
  const handleStartNew = () => {
    startNewDesign()
  }

  return {
    // State
    isGenerating,
    generatedImages,
    showResults,
    
    // Handlers
    handleBuildClick,
    handleDownload,
    handleEmail,
    handleSave,
    handleBackHome,
    handleStartNew,
  }
}
