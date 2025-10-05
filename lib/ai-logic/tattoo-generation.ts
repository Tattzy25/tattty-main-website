/**
 * AI Logic for Tattoo Generation
 * Handles follow-up question generation and tattoo image generation
 */

import type { GeneratedImage } from "@/components/generation-results"

/**
 * Generates personalized AI follow-up question based on user responses
 * Analyzes Cards 1-7 to create contextual questions
 */
export function generateAIFollowUpQuestion(
  sentMessages: string[],
  selectedImages: any,
  cardDataLength: number
): string {
  // Analyze user's responses from Cards 1-7
  const hasResponses = sentMessages.slice(0, cardDataLength).some(msg => msg.trim())
  const hasVisualSelections = selectedImages.style?.length > 0 || selectedImages.color?.length > 0
  const skippedCards = sentMessages.slice(0, cardDataLength).filter(msg => !msg.trim()).length
  
  let question = ""
  
  if (skippedCards >= 3) {
    // User skipped multiple questions - ask about that
    question = "I noticed you skipped a few questions. Is there anything specific about your story or vision that you'd like to share before we create your design?"
  } else if (hasResponses && hasVisualSelections) {
    // User engaged well - personalized follow-up based on first response
    const firstResponse = sentMessages[0]
    if (firstResponse?.toLowerCase().includes("family") || firstResponse?.toLowerCase().includes("mother") || firstResponse?.toLowerCase().includes("father")) {
      question = "Family seems important to you. Is there a specific memory or moment with them that you want captured in this design?"
    } else if (firstResponse?.toLowerCase().includes("car") || firstResponse?.toLowerCase().includes("bike") || firstResponse?.toLowerCase().includes("motorcycle")) {
      question = "That vehicle sounds special. What makes it more than just transportation to you?"
    } else if (firstResponse?.toLowerCase().includes("place") || firstResponse?.toLowerCase().includes("home") || firstResponse?.toLowerCase().includes("city")) {
      question = "Places hold powerful memories. What's the feeling you get when you think about that location?"
    } else {
      question = "Before we create your design, is there any emotional significance or hidden meaning you want woven into the artwork?"
    }
  } else {
    // Generic fallback
    question = "Did you forget anything? Want to add more details to help us capture your vision perfectly?"
  }
  
  return question
}

/**
 * Generates tattoo images using AI
 * Currently mock implementation - replace with actual backend API call
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
    responses,
    selectedImages,
    uploadedImages: uploadedImages.length,
    additionalNotes
  })

  // TODO: Replace this entire block with actual backend API call
  // Expected endpoint: POST /api/tattoo-generate
  // Expected body: { responses, selectedImages, uploadedImages, additionalNotes }
  // Expected response: { images: GeneratedImage[] }
  
  try {
    // Mock delay to simulate 5 AI models processing
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Mock generated images (2 color + 2 stencil)
    const mockImages: GeneratedImage[] = [
      {
        id: '1',
        url: '/placeholder.svg',
        type: 'color',
        option: 1,
        label: 'Full Color - Option 1'
      },
      {
        id: '2',
        url: '/placeholder.svg',
        type: 'color',
        option: 2,
        label: 'Full Color - Option 2'
      },
      {
        id: '3',
        url: '/placeholder.svg',
        type: 'stencil',
        option: 1,
        label: 'Stencil - Option 1'
      },
      {
        id: '4',
        url: '/placeholder.svg',
        type: 'stencil',
        option: 2,
        label: 'Stencil - Option 2'
      }
    ]
    
    console.log('✅ AI Generation complete:', mockImages)
    return mockImages
    
  } catch (error) {
    console.error('❌ AI Generation failed:', error)
    throw new Error('Failed to generate tattoo images')
  }
}

/**
 * TODO: Replace mock implementation with actual API call
 * 
 * Example implementation:
 * 
 * export async function generateTattooImages(...) {
 *   const response = await fetch('/api/tattoo-generate', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({
 *       responses,
 *       selectedImages,
 *       uploadedImages: await Promise.all(
 *         uploadedImages.map(file => fileToBase64(file))
 *       ),
 *       additionalNotes
 *     })
 *   })
 *   
 *   if (!response.ok) {
 *     throw new Error('Generation failed')
 *   }
 *   
 *   const data = await response.json()
 *   return data.images
 * }
 */
