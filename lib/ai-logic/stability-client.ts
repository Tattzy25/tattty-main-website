/**
 * Stability AI Client for Tattoo Generation
 * Models: SD 3.5 Large, Medium, Flash
 * NO FALLBACKS - Errors throw with proper logging
 * SERVER-SIDE ONLY
 */

import { logError, getFriendlyErrorMessage } from "@/lib/error-logging"

// Stability AI Configuration
const STABILITY_BASE_URL = "https://api.stability.ai/v2beta/stable-image/generate/sd3"

function getStabilityApiKey(): string {
  if (typeof window !== 'undefined') {
    throw new Error("❌ Stability client cannot be initialized on client-side")
  }
  
  const apiKey = process.env.STABILITY_API_KEY
  
  if (!apiKey) {
    throw new Error("❌ STABILITY_API_KEY is not set in environment variables")
  }
  
  return apiKey
}

export type StabilityModel = "sd3.5-large" | "sd3.5-medium" | "sd3.5-flash"

export interface StabilityGenerationParams {
  prompt: string
  negativePrompt: string
  model?: StabilityModel
  aspectRatio?: "1:1" | "16:9" | "9:16" | "21:9" | "9:21" | "2:3" | "3:2" | "4:5" | "5:4"
  seed?: number
  outputFormat?: "png" | "jpeg" | "webp"
  cfgScale?: number // 1-10, how strictly to follow prompt
}

export interface GeneratedTattooImage {
  id: string
  url: string
  type: "color" | "stencil"
  seed: string
  finishReason: string
  buffer: Buffer
}

/**
 * Generate COLOR tattoo image using Stability AI
 * @throws Error if generation fails
 */
export async function generateColorTattoo(
  params: StabilityGenerationParams
): Promise<GeneratedTattooImage> {
  console.log("🎨 [STABILITY] Generating COLOR tattoo with sd3.5-large...")
  console.log("📝 Prompt:", params.prompt.substring(0, 100) + "...")
  console.log("🚫 Negative:", params.negativePrompt.substring(0, 100) + "...")

  try {
    const formData = new FormData()
    formData.append("prompt", params.prompt)
    formData.append("negative_prompt", params.negativePrompt)
    formData.append("model", params.model || "sd3.5-large")
    formData.append("aspect_ratio", params.aspectRatio || "1:1")
    formData.append("seed", String(params.seed || 0))
    formData.append("output_format", params.outputFormat || "png")
    formData.append("mode", "text-to-image")
    
    if (params.cfgScale) {
      formData.append("cfg_scale", String(params.cfgScale))
    }

    // Add empty file field (required by API)
    formData.append("none", "")

    const apiKey = getStabilityApiKey()
    
    const response = await fetch(STABILITY_BASE_URL, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${apiKey}`,
        "accept": "image/*",
      },
      body: formData,
    })

    // Check response status
    if (!response.ok) {
      const errorText = await response.text()
      let errorJson
      try {
        errorJson = JSON.parse(errorText)
      } catch {
        errorJson = { error: errorText }
      }

      console.error("❌ [STABILITY] API Error:", response.status, errorJson)
      
      // Handle specific errors
      if (response.status === 403) {
        throw new Error("Content was flagged by moderation system")
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded - too many requests")
      } else if (response.status === 413) {
        throw new Error("Request too large - maximum 10MB")
      } else {
        throw new Error(`Stability AI error (${response.status}): ${errorJson.error || errorText}`)
      }
    }

    // Get metadata from headers
    const finishReason = response.headers.get("finish-reason") || "SUCCESS"
    const seed = response.headers.get("seed") || String(params.seed || 0)

    // Check for NSFW filter
    if (finishReason === "CONTENT_FILTERED") {
      throw new Error("Generation failed NSFW content filter")
    }

    // Get image buffer
    const imageBuffer = Buffer.from(await response.arrayBuffer())

    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error("Received empty image from Stability AI")
    }

    console.log(`✅ [STABILITY] Color tattoo generated (${imageBuffer.length} bytes, seed: ${seed})`)

    // Convert buffer to base64 data URL for frontend
    const base64 = imageBuffer.toString("base64")
    const mimeType = params.outputFormat === "jpeg" ? "image/jpeg" : "image/png"
    const dataUrl = `data:${mimeType};base64,${base64}`

    return {
      id: `color-${seed}-${Date.now()}`,
      url: dataUrl,
      type: "color",
      seed,
      finishReason,
      buffer: imageBuffer,
    }

  } catch (error) {
    console.error("❌ [STABILITY] Color generation failed:", error)
    logError(error, "AI_GENERATION", {
      model: params.model,
      promptLength: params.prompt.length,
      operation: "generateColorTattoo"
    })
    throw error
  }
}

/**
 * Generate STENCIL tattoo image (black and white outline)
 * @throws Error if generation fails
 */
export async function generateStencilTattoo(
  params: StabilityGenerationParams
): Promise<GeneratedTattooImage> {
  console.log("🖤 [STABILITY] Generating STENCIL tattoo with sd3.5-large...")

  // Override prompt for stencil style
  const stencilPrompt = `${params.prompt}, BLACK AND WHITE TATTOO STENCIL ONLY, bold black outlines, NO COLOR, pure black ink lines on white background, tattoo transfer paper style, clean linework, high contrast, professional tattoo stencil, outline drawing`

  const stencilNegative = `${params.negativePrompt}, color, colored, shading, gradients, gray, grayscale, fill, colored areas, realistic shading, soft edges`

  try {
    const formData = new FormData()
    formData.append("prompt", stencilPrompt)
    formData.append("negative_prompt", stencilNegative)
    formData.append("model", params.model || "sd3.5-large")
    formData.append("aspect_ratio", params.aspectRatio || "1:1")
    formData.append("seed", String(params.seed || 0))
    formData.append("output_format", params.outputFormat || "png")
    formData.append("mode", "text-to-image")
    formData.append("cfg_scale", String(params.cfgScale || 6)) // Higher for strict B&W
    formData.append("none", "")

    const apiKey = getStabilityApiKey()
    
    const response = await fetch(STABILITY_BASE_URL, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${apiKey}`,
        "accept": "image/*",
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorJson
      try {
        errorJson = JSON.parse(errorText)
      } catch {
        errorJson = { error: errorText }
      }
      throw new Error(`Stability AI error (${response.status}): ${errorJson.error || errorText}`)
    }

    const finishReason = response.headers.get("finish-reason") || "SUCCESS"
    const seed = response.headers.get("seed") || String(params.seed || 0)

    if (finishReason === "CONTENT_FILTERED") {
      throw new Error("Stencil generation failed NSFW content filter")
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer())

    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error("Received empty stencil image from Stability AI")
    }

    console.log(`✅ [STABILITY] Stencil tattoo generated (${imageBuffer.length} bytes, seed: ${seed})`)

    const base64 = imageBuffer.toString("base64")
    const mimeType = params.outputFormat === "jpeg" ? "image/jpeg" : "image/png"
    const dataUrl = `data:${mimeType};base64,${base64}`

    return {
      id: `stencil-${seed}-${Date.now()}`,
      url: dataUrl,
      type: "stencil",
      seed,
      finishReason,
      buffer: imageBuffer,
    }

  } catch (error) {
    console.error("❌ [STABILITY] Stencil generation failed:", error)
    logError(error, "AI_GENERATION", {
      model: params.model,
      promptLength: stencilPrompt.length,
      operation: "generateStencilTattoo"
    })
    throw error
  }
}

/**
 * Generate BOTH color and stencil tattoo images
 * This is the main function called by the generation flow
 * @throws Error if either generation fails
 */
export async function generateTattooImagePair(
  positivePrompt: string,
  negativePrompt: string,
  model: StabilityModel = "sd3.5-large",
  seed?: number
): Promise<[GeneratedTattooImage, GeneratedTattooImage]> {
  console.log("🎨🖤 [STABILITY] Generating tattoo pair (color + stencil)...")
  console.log(`📊 Model: ${model}`)
  
  // Use same seed for consistency between color and stencil
  const generationSeed = seed || Math.floor(Math.random() * 4294967294)

  const params: StabilityGenerationParams = {
    prompt: positivePrompt,
    negativePrompt,
    model,
    seed: generationSeed,
    aspectRatio: "1:1",
    outputFormat: "png",
    cfgScale: 4, // Default for sd3.5-large
  }

  // Generate both in parallel
  const [colorImage, stencilImage] = await Promise.all([
    generateColorTattoo(params),
    generateStencilTattoo(params),
  ])

  console.log("✅ [STABILITY] Tattoo pair generation complete!")
  
  return [colorImage, stencilImage]
}

/**
 * Model pricing info (in credits)
 */
export const MODEL_PRICING = {
  "sd3.5-large": 6.5,
  "sd3.5-medium": 3.5,
  "sd3.5-flash": 2.5,
} as const

/**
 * Get recommended model based on user tier
 */
export function getRecommendedModel(userTier: "free" | "premium"): StabilityModel {
  return userTier === "premium" ? "sd3.5-large" : "sd3.5-medium"
}

/**
 * IMAGE-TO-IMAGE: Generate tattoo from reference image
 * Uses uploaded user images as starting point
 */
export async function generateImageToImage(
  imageBuffer: Buffer,
  prompt: string,
  negativePrompt: string,
  strength: number = 0.75,
  model: StabilityModel = "sd3.5-large"
): Promise<GeneratedTattooImage> {
  console.log("🖼️ [STABILITY] Image-to-image generation...")
  console.log(`  💪 Strength: ${strength} (0=identical, 1=completely new)`)

  try {
    const formData = new FormData()
    
    // Convert Buffer to Blob properly
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: "image/png" })
    formData.append("image", blob, "reference.png")
    
    formData.append("prompt", prompt)
    formData.append("negative_prompt", negativePrompt)
    formData.append("strength", String(strength))
    formData.append("model", model)
    formData.append("mode", "image-to-image")
    formData.append("seed", "0")
    formData.append("output_format", "png")

    const apiKey = getStabilityApiKey()
    
    const response = await fetch(STABILITY_BASE_URL, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${apiKey}`,
        "accept": "image/*",
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Image-to-image failed (${response.status}): ${errorText}`)
    }

    const finishReason = response.headers.get("finish-reason") || "SUCCESS"
    const seed = response.headers.get("seed") || "0"

    if (finishReason === "CONTENT_FILTERED") {
      throw new Error("Image-to-image failed NSFW content filter")
    }

    const resultBuffer = Buffer.from(await response.arrayBuffer())
    const base64 = resultBuffer.toString("base64")
    const dataUrl = `data:image/png;base64,${base64}`

    console.log(`✅ [STABILITY] Image-to-image complete (seed: ${seed})`)

    return {
      id: `img2img-${seed}-${Date.now()}`,
      url: dataUrl,
      type: "color",
      seed,
      finishReason,
      buffer: resultBuffer,
    }

  } catch (error) {
    console.error("❌ [STABILITY] Image-to-image failed:", error)
    logError(error, "AI_GENERATION", {
      operation: "generateImageToImage",
      strength,
      model
    })
    throw error
  }
}

/**
 * CONTROLNET SKETCH: Use sketch/line art to guide generation
 * Perfect for converting sketches to tattoo designs
 */
export async function generateWithSketchControl(
  sketchImageBuffer: Buffer,
  prompt: string,
  negativePrompt: string,
  controlStrength: number = 0.7
): Promise<GeneratedTattooImage> {
  console.log("✏️ [STABILITY] Sketch control generation...")
  console.log(`  🎚️ Control strength: ${controlStrength}`)

  try {
    const formData = new FormData()
    
    const blob = new Blob([new Uint8Array(sketchImageBuffer)], { type: "image/png" })
    formData.append("image", blob, "sketch.png")
    
    formData.append("prompt", prompt)
    formData.append("negative_prompt", negativePrompt)
    formData.append("control_strength", String(controlStrength))
    formData.append("seed", "0")
    formData.append("output_format", "png")

    const apiKey = getStabilityApiKey()
    
    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/control/sketch",
      {
        method: "POST",
        headers: {
          "authorization": `Bearer ${apiKey}`,
          "accept": "image/*",
        },
        body: formData,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Sketch control failed (${response.status}): ${errorText}`)
    }

    const finishReason = response.headers.get("finish-reason") || "SUCCESS"
    const seed = response.headers.get("seed") || "0"

    if (finishReason === "CONTENT_FILTERED") {
      throw new Error("Sketch control failed NSFW content filter")
    }

    const resultBuffer = Buffer.from(await response.arrayBuffer())
    const base64 = resultBuffer.toString("base64")
    const dataUrl = `data:image/png;base64,${base64}`

    console.log(`✅ [STABILITY] Sketch control complete (seed: ${seed})`)

    return {
      id: `sketch-${seed}-${Date.now()}`,
      url: dataUrl,
      type: "color",
      seed,
      finishReason,
      buffer: resultBuffer,
    }

  } catch (error) {
    console.error("❌ [STABILITY] Sketch control failed:", error)
    logError(error, "AI_GENERATION", {
      operation: "generateWithSketchControl",
      controlStrength
    })
    throw error
  }
}

/**
 * CONTROLNET STRUCTURE: Preserve structure/composition from reference
 * Perfect for maintaining tattoo placement/shape while changing style
 */
export async function generateWithStructureControl(
  structureImageBuffer: Buffer,
  prompt: string,
  negativePrompt: string,
  controlStrength: number = 0.7
): Promise<GeneratedTattooImage> {
  console.log("🏗️ [STABILITY] Structure control generation...")
  console.log(`  🎚️ Control strength: ${controlStrength}`)

  try {
    const formData = new FormData()
    
    const blob = new Blob([new Uint8Array(structureImageBuffer)], { type: "image/png" })
    formData.append("image", blob, "structure.png")
    
    formData.append("prompt", prompt)
    formData.append("negative_prompt", negativePrompt)
    formData.append("control_strength", String(controlStrength))
    formData.append("seed", "0")
    formData.append("output_format", "png")

    const apiKey = getStabilityApiKey()
    
    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/control/structure",
      {
        method: "POST",
        headers: {
          "authorization": `Bearer ${apiKey}`,
          "accept": "image/*",
        },
        body: formData,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Structure control failed (${response.status}): ${errorText}`)
    }

    const finishReason = response.headers.get("finish-reason") || "SUCCESS"
    const seed = response.headers.get("seed") || "0"

    if (finishReason === "CONTENT_FILTERED") {
      throw new Error("Structure control failed NSFW content filter")
    }

    const resultBuffer = Buffer.from(await response.arrayBuffer())
    const base64 = resultBuffer.toString("base64")
    const dataUrl = `data:image/png;base64,${base64}`

    console.log(`✅ [STABILITY] Structure control complete (seed: ${seed})`)

    return {
      id: `structure-${seed}-${Date.now()}`,
      url: dataUrl,
      type: "color",
      seed,
      finishReason,
      buffer: resultBuffer,
    }

  } catch (error) {
    console.error("❌ [STABILITY] Structure control failed:", error)
    logError(error, "AI_GENERATION", {
      operation: "generateWithStructureControl",
      controlStrength
    })
    throw error
  }
}
