/**
 * AI Logic for Tattoo Generation
 * Handles follow-up question generation and tattoo image generation
 * Ful    // Step 3: Generate images with Stability AI server action
    console.log("🖼️ [STABILITY] Generating tattoo images...")
    
    const imageResult = await generateTattooImagePairAction(
      promptResponse.positivePrompt,
      promptResponse.negativePrompt,
      "sd3.5-large" // Use best model for now
    )

    if (!imageResult.success) {
      throw new Error(imageResult.error)
    }

    const [colorImage, stencilImage] = imageResult.images
 * 
 * NOTE: This file is CLIENT-SIDE safe. All API calls go through server actions.
 */

import type { GeneratedImage } from "@/components/generation-results"
import type { UserAnswers } from "./groq-prompts"
import { logError } from "@/lib/error-logging"
import { generateFollowUpQuestionAction, generateFinalPromptsAction } from "@/app/actions/groq"
import { generateTattooImagePairAction } from "@/app/actions/stability"

/**
 * Generates personalized AI follow-up question based on user responses
 * Uses session data from database instead of hook state
 */
export async function generateAIFollowUpQuestion(
  sessionToken: string
): Promise<string> {
  console.log("🤔 [AI] Generating follow-up question from session data...")
  
  try {
    // Fetch complete session summary from database
    const sessionResponse = await fetch(`/api/session/summary/${sessionToken}`)
    if (!sessionResponse.ok) {
      throw new Error(`Failed to fetch session: ${sessionResponse.status}`)
    }
    
    const sessionData = await sessionResponse.json()
    
    // Build UserAnswers from session data
    const answers: UserAnswers = {
      card1: sessionData.answers[0]?.answer_text || "",
      card2: sessionData.answers[1]?.answer_text || "",
      card3: sessionData.answers[2]?.answer_text || "",
      card4: sessionData.answers[3]?.answer_text || "",
      card5: sessionData.answers[4]?.answer_text || "",
      card6: sessionData.answers[5]?.answer_text || "",
      card7: formatStyleSelections(sessionData.styleSelections),
    }
    
    // Call Groq server action to generate intelligent follow-up
    const result = await generateFollowUpQuestionAction(answers)
    
    if (!result.success) {
      throw new Error(result.error)
    }
    
    return result.question
    
  } catch (error) {
    console.error("❌ [AI] Failed to generate follow-up question:", error)
    
    logError(error, "AI_GENERATION", {
      operation: "generateAIFollowUpQuestion",
      sessionToken
    })
    throw error
  }
}

/**
 * Format style selections from session into Card 7 text
 */
function formatStyleSelections(styleSelections: any[]): string {
  if (!styleSelections || styleSelections.length === 0) return ""
  
  return styleSelections
    .map(selection => `${selection.category}: ${selection.selected_option_name}`)
    .join(", ")
}

/**
 * Generates tattoo images using AI
 * Full pipeline: User responses → Groq prompts → Stability AI generation
 * 
 * @param responses - User text responses from Cards 1-6
 * @param selectedImages - Visual selections from Card 7 (style, color, size, placement)
 * @param uploadedImages - Reference images uploaded on Card 8
 * @param additionalNotes - Optional text from Card 8
 * @returns Promise resolving to 2 generated images (1 color + 1 stencil)
 */
export async function generateTattooImages(
  responses: string[],
  selectedImages: any,
  uploadedImages: File[],
  additionalNotes?: string
): Promise<GeneratedImage[]> {
  console.log("🎨 [AI] Starting tattoo generation pipeline...")
  console.log("📊 Input:", {
    responsesCount: responses.length,
    selectedImagesKeys: Object.keys(selectedImages),
    uploadedImagesCount: uploadedImages.length,
    hasAdditionalNotes: !!additionalNotes
  })

  try {
    // Step 1: Build UserAnswers for Groq
    // Card 7 has TWO sources:
    // 1. selectedImages (style, color, optional placement/size from gallery)
    // 2. responses[6] (optional text note)
    
    // Extract with fallbacks
    const styleLabel = selectedImages?.style?.[0]?.label || selectedImages?.style?.[0]?.alt || "Traditional"
    const colorLabel = selectedImages?.color?.[0]?.label || selectedImages?.color?.[0]?.alt || "Black and White"
    
    const placementLabels = selectedImages?.placement && selectedImages.placement.length > 0
      ? selectedImages.placement.map((img: any) => img.label || img.alt).join(", ")
      : "Chest"
    
    const sizeLabels = selectedImages?.size && selectedImages.size.length > 0
      ? selectedImages.size.map((img: any) => img.label || img.alt).join(", ")
      : "Large"
    
    // Build image selections summary
    const imageSelections = [
      `Style: ${styleLabel}`,
      `Color: ${colorLabel}`,
      `Placement: ${placementLabels}`,
      `Size: ${sizeLabels}`
    ]
    
    // Combine image selections with optional text note
    const card7Parts = [imageSelections.join(" | ")]
    if (responses[6]) {
      card7Parts.push(`Note: ${responses[6]}`)
    }
    
    const card7Content = card7Parts.join(" - ")
    
    const answers: UserAnswers = {
      card1: responses[0] || "",
      card2: responses[1] || "",
      card3: responses[2] || "",
      card4: responses[3] || "",
      card5: responses[4] || "",
      card6: responses[5] || "",
      card7: card7Content, // Combine selectedImages + text note
      card8: additionalNotes || "",
    }

    console.log("🤖 [GROQ] Generating optimized prompts...")
    console.log("📋 User Answers:", answers)
    
    // Step 2: Get prompts from Groq server action
    const promptResult = await generateFinalPromptsAction(answers)
    
    if (!promptResult.success) {
      throw new Error(promptResult.error)
    }
    
    const promptResponse = promptResult.prompts
    
    console.log("✅ [GROQ] Prompts generated:")
    console.log("  📝 Positive:", promptResponse.positivePrompt.substring(0, 100) + "...")
    console.log("  🚫 Negative:", promptResponse.negativePrompt.substring(0, 100) + "...")
    console.log("  🎨 Style:", promptResponse.style)
    console.log("  💭 Mood:", promptResponse.mood)

    // Step 3: Generate images with Stability AI server action
    console.log("🖼️ [STABILITY] Generating tattoo images...")
    
    const imageResult = await generateTattooImagePairAction(
      promptResponse.positivePrompt,
      promptResponse.negativePrompt,
      "sd3.5-large" // Use best model for now
    )

    if (!imageResult.success) {
      throw new Error(imageResult.error)
    }

    const [colorImage, stencilImage] = imageResult.images

    // Step 4: Format for frontend
    const generatedImages: GeneratedImage[] = [
      {
        id: colorImage.id,
        url: colorImage.url,
        type: "color",
        option: 1,
        label: `${promptResponse.style} - Full Color`,
      },
      {
        id: stencilImage.id,
        url: stencilImage.url,
        type: "stencil",
        option: 1,
        label: `${promptResponse.style} - Stencil Outline`,
      }
    ]

    console.log("✅ [AI] Generation pipeline complete!")
    console.log(`  🎨 Generated ${generatedImages.length} images`)
    
    return generatedImages

  } catch (error) {
    console.error("❌ [AI] Tattoo generation failed:", error)
    
    // Log with full context
    logError(error, "AI_GENERATION", {
      operation: "generateTattooImages",
      responsesCount: responses.length,
      selectedImagesKeys: Object.keys(selectedImages),
      uploadedImagesCount: uploadedImages.length,
      hasAdditionalNotes: !!additionalNotes
    })
    
    // Re-throw to trigger user-friendly error popup
    throw error
  }
}
