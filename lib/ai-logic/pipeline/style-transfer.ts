/**
 * Style Transfer Module for Tattoo Generation
 * Applies style transformations using Stability AI
 * NO FALLBACKS - Errors throw with proper logging
 */

import { logError } from "@/lib/error-logging"

const STABILITY_API_KEY = process.env.STABILITY_API_KEY
const STYLE_TRANSFER_URL = "https://api.stability.ai/v2beta/stable-image/control/style"

if (!STABILITY_API_KEY) {
  throw new Error("❌ STABILITY_API_KEY is not set in environment variables")
}

export interface StyleTransferParams {
  sourceImage: Buffer
  prompt: string
  negativePrompt: string
  styleStrength: number // 0-1, how strongly to apply style
  seed?: number
}

export interface StyleTransferResult {
  buffer: Buffer
  seed: string
  finishReason: string
}

/**
 * Apply style transfer to an image
 * Takes a base image and applies tattoo-specific styling
 * @throws Error if style transfer fails
 */
export async function applyStyleTransfer(
  params: StyleTransferParams
): Promise<StyleTransferResult> {
  console.log("🎨 [STYLE TRANSFER] Applying style transformation...")
  console.log(`  💪 Style strength: ${params.styleStrength}`)

  try {
    const formData = new FormData()
    
    // Convert Buffer to Blob properly
    const blob = new Blob([new Uint8Array(params.sourceImage)], { type: "image/png" })
    formData.append("image", blob, "source.png")
    
    formData.append("prompt", params.prompt)
    formData.append("negative_prompt", params.negativePrompt)
    formData.append("control_strength", String(params.styleStrength))
    if (typeof params.seed !== "undefined") {
      formData.append("seed", String(params.seed))
    }
    formData.append("output_format", "png")

    const response = await fetch(STYLE_TRANSFER_URL, {
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

      console.error("❌ [STYLE TRANSFER] API Error:", response.status, errorJson)
      
      if (response.status === 403) {
        throw new Error("Style transfer content flagged by moderation")
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded")
      } else {
        throw new Error(`Style transfer error (${response.status}): ${errorJson.error || errorText}`)
      }
    }

    const finishReason = response.headers.get("finish-reason") || "SUCCESS"
    const seed = response.headers.get("seed") || String(params.seed || 0)
    const arrayBuffer = await response.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)
    
    console.log(`✅ [STYLE TRANSFER] Applied (${imageBuffer.length} bytes, seed: ${seed})`)

    return {
      buffer: imageBuffer,
      seed,
      finishReason,
    }

  } catch (error) {
    console.error("❌ [STYLE TRANSFER] Failed:", error)
    logError(error, "STYLE_TRANSFER", {
      styleStrength: params.styleStrength,
      promptLength: params.prompt.length,
    })
    throw error
  }
}
