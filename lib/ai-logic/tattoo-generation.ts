/**
 * AI Logic for Tattoo Generation
 * Handles follow-up question generation and tattoo image generation
 */

import type { GeneratedImage } from "@/components/generation-results"

/**
 * Generates personalized AI follow-up question based on user responses
 * Analyzes Cards 1-7 responses and creates contextual follow-up questions
 */
export function generateAIFollowUpQuestion(
  sentMessages: string[],
  selectedImages: any,
  cardDataLength: number
): string {
  // Analyze user responses to generate contextual question
  const hasStyleSelections = Object.keys(selectedImages).some(
    key => selectedImages[key] && selectedImages[key].length > 0
  )
  
  if (hasStyleSelections) {
    return "Based on your style selections, is there anything specific you'd like us to know about placement, size, or personal meaning of your tattoo?"
  }
  
  if (sentMessages.length > 0) {
    return "Looking at what you've shared so far, are there any additional details or reference images that would help bring your vision to life?"
  }
  
  return "Is there anything else you'd like to share about your tattoo vision? Any reference images or specific details we should know?"
}

/**
 * Generates tattoo images using AI
 * Integrates with AI orchestration system to generate tattoo designs
 * 
 * @param responses - User text responses from Cards 1-6
 * @param selectedImages - Visual selections from Card 7 (style, color, size, placement)
 * @param uploadedImages - Reference images uploaded on Card 8
 * @param additionalNotes - Optional text from Card 8
 * @returns Promise resolving to 4 generated images (2 color + 2 stencil)
 */
export async function generateTattooImages(
  responses: string[],
  selectedImages: any,
  uploadedImages: File[],
  additionalNotes?: string
): Promise<GeneratedImage[]> {
  console.log('🎨 AI Generation started with:', {
    responsesCount: responses.length,
    responses,
    selectedImages,
    uploadedImagesCount: uploadedImages.length,
    additionalNotes
  })

  // Build the comprehensive prompt from all user inputs
  const userResponses = responses.filter(r => r && r.trim()).join('. ')
  
  // Extract image selections for reference
  const styleSelections = selectedImages.style?.map((img: any) => img.label).join(', ') || 'not specified'
  const colorSelections = selectedImages.color?.map((img: any) => img.label).join(', ') || 'not specified'
  const sizeSelections = selectedImages.size?.map((img: any) => img.label).join(', ') || 'not specified'
  const placementSelections = selectedImages.placement?.map((img: any) => img.label).join(', ') || 'not specified'
  
  // Construct AI prompt
  const fullPrompt = `Create a tattoo design based on the following:
User responses: ${userResponses}
Style preferences: ${styleSelections}
Color preferences: ${colorSelections}
Size preferences: ${sizeSelections}
Placement preferences: ${placementSelections}
${additionalNotes ? `Additional notes: ${additionalNotes}` : ''}`

  console.log('🎯 Generated prompt for AI:', fullPrompt)

  try {
    // Call the tattoo generation API endpoint
    const response = await fetch('/api/tattoo-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        userResponses,
        selectedImages,
        uploadedImages: uploadedImages.length,
        additionalNotes
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to generate tattoo images')
    }

    const result = await response.json()
    
    console.log('✅ AI Generation complete, received images:', result)
    
    // Return the generated images
    return result.images || []
    
  } catch (error) {
    console.error('❌ Error generating tattoo images:', error)
    throw error
  }
}
