/**
 * Refinement Module for Tattoo Generation
 * Final quality pass using Stability AI upscale/enhance
 * NO FALLBACKS - Errors throw with proper logging
 */

import { logError } from "@/lib/error-logging"

const STABILITY_API_KEY = process.env.STABILITY_API_KEY
const UPSCALE_URL = "https://api.stability.ai/v2beta/stable-image/upscale/conservative"

if (!STABILITY_API_KEY) {
  throw new Error("❌ STABILITY_API_KEY is not set in environment variables")
}

export interface RefinementParams {
  sourceImage: Buffer
  prompt: string
  outputFormat?: "png" | "jpeg" | "webp"
  seed?: number
}

export interface RefinementResult {
  buffer: Buffer
  seed: string
  finishReason: string
}

/**
 * Apply final refinement to tattoo image
 * Enhances quality, sharpness, and details
 * @throws Error if refinement fails
 */
export async function applyFinalRefinement(
  params: RefinementParams
): Promise<RefinementResult> {
  console.log("✨ [REFINEMENT] Applying final quality enhancement...")

  try {
    const formData = new FormData()
    
    // Convert Buffer to Blob properly
    const blob = new Blob([new Uint8Array(params.sourceImage)], { type: "image/png" })
    formData.append("image", blob, "source.png")
    
    formData.append("prompt", params.prompt)
    formData.append("output_format", params.outputFormat || "png")
    
    if (params.seed) {
      formData.append("seed", String(params.seed))
    }

    const response = await fetch(UPSCALE_URL, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${STABILITY_API_KEY}`,
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

      console.error("❌ [REFINEMENT] API Error:", response.status, errorJson)
      
      if (response.status === 403) {
        throw new Error("Refinement content flagged by moderation")
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded")
      } else {
        throw new Error(`Refinement error (${response.status}): ${errorJson.error || errorText}`)
      }
    }

    const finishReason = response.headers.get("finish-reason") || "SUCCESS"
    const seed = response.headers.get("seed") || String(params.seed || 0)

    const imageBuffer = Buffer.from(await response.arrayBuffer())
    
    console.log(`✅ [REFINEMENT] Enhanced (${imageBuffer.length} bytes, seed: ${seed})`)

    return {
      buffer: imageBuffer,
      seed,
      finishReason,
    }

  } catch (error) {
    console.error("❌ [REFINEMENT] Failed:", error)
    logError(error, "API_CALL", {
      promptLength: params.prompt.length,
    })
    throw error
  }
}
