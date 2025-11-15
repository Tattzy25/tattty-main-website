"use server"

/**
 * Server Actions for Stability AI
 * All Stability AI API calls MUST happen server-side only
 */

import { 
  generateColorTattoo, 
  generateStencilTattoo, 
  generateTattooImagePair,
  type StabilityModel,
  type GeneratedTattooImage,
  type StabilityGenerationParams
} from "@/lib/ai-logic/stability-client"

/**
 * Server action: Generate a pair of tattoo images (color + stencil)
 * Called when user clicks "Generate" button
 */
export async function generateTattooImagePairAction(
  positivePrompt: string,
  negativePrompt: string,
  model: StabilityModel = "sd3.5-large"
): Promise<{ 
  success: true; 
  images: [GeneratedTattooImage, GeneratedTattooImage] 
} | { 
  success: false; 
  error: string 
}> {
  try {
    console.log("🎨 [SERVER ACTION] Generating tattoo image pair...")
    
    const images = await generateTattooImagePair(positivePrompt, negativePrompt, model)
    
    console.log("✅ [SERVER ACTION] Image pair generated successfully")
    return { success: true, images }
    
  } catch (err) {
    const error = err as Error
    console.error("❌ [SERVER ACTION] Failed to generate images:", error)
    
    // Log error details for debugging (without throwing)
    console.error("Error context:", {
      operation: "generateTattooImagePair",
      model,
      promptLength: positivePrompt.length,
      stack: error.stack
    })
    
    return {
      success: false,
      error: error.message || "Failed to generate tattoo images"
    }
  }
}

/**
 * Server action: Generate single color tattoo
 */
export async function generateColorTattooAction(
  positivePrompt: string,
  negativePrompt: string,
  model: StabilityModel = "sd3.5-large"
): Promise<{ 
  success: true; 
  image: GeneratedTattooImage 
} | { 
  success: false; 
  error: string 
}> {
  try {
    console.log("🎨 [SERVER ACTION] Generating color tattoo...")
    
    const image = await generateColorTattoo({
      prompt: positivePrompt,
      negativePrompt,
      model
    })
    
    console.log("✅ [SERVER ACTION] Color tattoo generated")
    return { success: true, image }
    
  } catch (err) {
    const error = err as Error
    console.error("❌ [SERVER ACTION] Failed to generate color tattoo:", error)
    
    // Log error details for debugging (without throwing)
    console.error("Error context:", {
      operation: "generateColorTattoo",
      model,
      stack: error.stack
    })
    
    return {
      success: false,
      error: error.message || "Failed to generate color tattoo"
    }
  }
}

/**
 * Server action: Generate single stencil tattoo
 */
export async function generateStencilTattooAction(
  positivePrompt: string,
  negativePrompt: string,
  model: StabilityModel = "sd3.5-large"
): Promise<{ 
  success: true; 
  image: GeneratedTattooImage 
} | { 
  success: false; 
  error: string 
}> {
  try {
    console.log("🎨 [SERVER ACTION] Generating stencil tattoo...")
    
    const image = await generateStencilTattoo({
      prompt: positivePrompt,
      negativePrompt,
      model
    })
    
    console.log("✅ [SERVER ACTION] Stencil tattoo generated")
    return { success: true, image }
    
  } catch (err) {
    const error = err as Error
    console.error("❌ [SERVER ACTION] Failed to generate stencil tattoo:", error)
    
    // Log error details for debugging (without throwing)
    console.error("Error context:", {
      operation: "generateStencilTattoo",
      model,
      stack: error.stack
    })
    
    return {
      success: false,
      error: error.message || "Failed to generate stencil tattoo"
    }
  }
}
