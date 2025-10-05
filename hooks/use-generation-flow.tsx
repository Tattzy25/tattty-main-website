"use client"

import { useState } from "react"
import { type ImageObject } from "@/components/image-gallery"
import { type GeneratedImage } from "@/components/generation-results"
import { generateTattooImages } from "@/lib/ai-logic"
import { logError, getFriendlyErrorMessage } from "@/lib/error-logging"
import { ANIMATION_TIMING } from "@/lib/constants"
import { downloadImage, emailImage, saveToProfile, navigateToHome, startNewDesign } from "@/lib/result-handlers"

export function useGenerationFlow() {
  // Generation Flow States
  const [isGenerating, setIsGenerating] = useState(false) // Full-screen loading state
  const [generatedImages, setGeneratedImages] = useState<any[]>([]) // 2 generated images (1 color + 1 stencil)
  const [showResults, setShowResults] = useState(false) // Show results screen
  const [errorMessage, setErrorMessage] = useState<string | null>(null) // User-friendly error
  const [retryCount, setRetryCount] = useState(0) // Track retry attempts
  const [lastGenerationParams, setLastGenerationParams] = useState<any>(null) // Store params for retry

  // Build Button Handler - Trigger Generation
  const handleBuildClick = async (
    sentMessages: string[],
    totalQuestions: number,
    selectedImages: {[key: string]: ImageObject[]},
    uploadedImages: File[]
  ) => {
    console.log('🎨 Build button clicked - Starting generation flow')
    
    // Store params for potential retry
    setLastGenerationParams({ sentMessages, totalQuestions, selectedImages, uploadedImages })
    
    // Step 1: Start generating (triggers loading state)
    setIsGenerating(true)
    setErrorMessage(null) // Clear any previous errors
    
    // Step 2: Call AI generation function
    try {
      const images = await generateTattooImages(
        sentMessages.slice(0, totalQuestions),
        selectedImages,
        uploadedImages,
        sentMessages[totalQuestions + 1] // Card 8 additional notes
      )
      
      // Validate: Must have exactly 2 images (1 color + 1 stencil)
      if (!images || images.length !== 2) {
        throw new Error(`Expected 2 images (1 color + 1 stencil), but received ${images?.length || 0}`)
      }

      // Validate: Must have 1 color and 1 stencil
      const colorCount = images.filter(img => img.type === 'color').length
      const stencilCount = images.filter(img => img.type === 'stencil').length
      
      if (colorCount !== 1 || stencilCount !== 1) {
        throw new Error(`Invalid image types: ${colorCount} color, ${stencilCount} stencil (expected 1 of each)`)
      }
      
      // Step 3: Set generated images
      setGeneratedImages(images)
      setRetryCount(0) // Reset retry count on success
      
      // Step 4: Transition to results
      setTimeout(() => {
        setIsGenerating(false)
        setShowResults(true)
      }, ANIMATION_TIMING.FADE_OUT)
      
    } catch (error) {
      // Log error with full technical details
      console.error('❌ Generation failed:', error)
      
      try {
        logError(error, 'AI_GENERATION', {
          sentMessagesCount: sentMessages.length,
          totalQuestions,
          selectedImagesKeys: Object.keys(selectedImages),
          uploadedImagesCount: uploadedImages.length,
          retryCount
        })
      } catch (logErr) {
        // If logging fails, just log to console
        console.error('Failed to log error:', logErr)
      }
      
      // Show user-friendly error
      setIsGenerating(false)
      setErrorMessage(getFriendlyErrorMessage('AI_GENERATION'))
    }
  }

  // Retry generation (only once)
  const handleRetry = () => {
    if (retryCount >= 1) {
      console.warn('⚠️ Maximum retry attempts reached')
      return
    }

    console.log(`🔄 Retrying generation (attempt ${retryCount + 1}/1)`)
    setRetryCount(retryCount + 1)
    setErrorMessage(null)

    // Retry with last params
    if (lastGenerationParams) {
      handleBuildClick(
        lastGenerationParams.sentMessages,
        lastGenerationParams.totalQuestions,
        lastGenerationParams.selectedImages,
        lastGenerationParams.uploadedImages
      )
    }
  }

  // Close error popup
  const handleCloseError = () => {
    setErrorMessage(null)
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
    errorMessage,
    retryCount,
    
    // Handlers
    handleBuildClick,
    handleRetry,
    handleCloseError,
    handleDownload,
    handleEmail,
    handleSave,
    handleBackHome,
    handleStartNew,
  }
}
