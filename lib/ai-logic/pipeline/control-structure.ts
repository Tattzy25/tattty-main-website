/**
 * Control & Structure Module for Tattoo Generation
 * Applies ControlNet sketch and structure guidance
 * NO FALLBACKS - Errors throw with proper logging
 */

import { logError } from "@/lib/error-logging"

const STABILITY_API_KEY = process.env.STABILITY_API_KEY
const SKETCH_CONTROL_URL = "https://api.stability.ai/v2beta/stable-image/control/sketch"
const STRUCTURE_CONTROL_URL = "https://api.stability.ai/v2beta/stable-image/control/structure"

if (!STABILITY_API_KEY) {
  throw new Error("❌ STABILITY_API_KEY is not set in environment variables")
}

export interface ControlParams {
  sourceImage: Buffer
  prompt: string
  negativePrompt: string
  controlStrength: number // 0-1
  seed?: number
}

export interface ControlResult {
  buffer: Buffer
  seed: string
  finishReason: string
}

/**
 * Apply sketch control to maintain line work
 * @throws Error if control fails
 */
export async function applySketchControl(
  params: ControlParams
): Promise<ControlResult> {
  console.log("✏️ [SKETCH CONTROL] Applying sketch guidance...")
  console.log(`  🎚️ Control strength: ${params.controlStrength}`)

  try {
    const formData = new FormData()
    
    const blob = new Blob([new Uint8Array(params.sourceImage)], { type: "image/png" })
    formData.append("image", blob, "sketch.png")
    
    formData.append("prompt", params.prompt)
    formData.append("negative_prompt", params.negativePrompt)
    formData.append("control_strength", String(params.controlStrength))
    formData.append("seed", String(params.seed || 0))
    formData.append("output_format", "png")

    const response = await fetch(SKETCH_CONTROL_URL, {
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

      console.error("❌ [SKETCH CONTROL] API Error:", response.status, errorJson)
      
      if (response.status === 403) {
        throw new Error("Sketch control content flagged by moderation")
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded")
      } else {
        throw new Error(`Sketch control error (${response.status}): ${errorJson.error || errorText}`)
      }
    }

    const finishReason = response.headers.get("finish-reason") || "SUCCESS"
    const seed = response.headers.get("seed") || String(params.seed || 0)

    const imageBuffer = Buffer.from(await response.arrayBuffer())
    
    console.log(`✅ [SKETCH CONTROL] Applied (${imageBuffer.length} bytes, seed: ${seed})`)

    return {
      buffer: imageBuffer,
      seed,
      finishReason,
    }

  } catch (error) {
    console.error("❌ [SKETCH CONTROL] Failed:", error)
    logError(error, "API_CALL", {
      controlStrength: params.controlStrength,
      promptLength: params.prompt.length,
    })
    throw error
  }
}

/**
 * Apply structure control to maintain composition
 * @throws Error if control fails
 */
export async function applyStructureControl(
  params: ControlParams
): Promise<ControlResult> {
  console.log("🏗️ [STRUCTURE CONTROL] Applying structure guidance...")
  console.log(`  🎚️ Control strength: ${params.controlStrength}`)

  try {
    const formData = new FormData()
    
    const blob = new Blob([new Uint8Array(params.sourceImage)], { type: "image/png" })
    formData.append("image", blob, "structure.png")
    
    formData.append("prompt", params.prompt)
    formData.append("negative_prompt", params.negativePrompt)
    formData.append("control_strength", String(params.controlStrength))
    formData.append("seed", String(params.seed || 0))
    formData.append("output_format", "png")

    const response = await fetch(STRUCTURE_CONTROL_URL, {
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

      console.error("❌ [STRUCTURE CONTROL] API Error:", response.status, errorJson)
      
      if (response.status === 403) {
        throw new Error("Structure control content flagged by moderation")
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded")
      } else {
        throw new Error(`Structure control error (${response.status}): ${errorJson.error || errorText}`)
      }
    }

    const finishReason = response.headers.get("finish-reason") || "SUCCESS"
    const seed = response.headers.get("seed") || String(params.seed || 0)

    const imageBuffer = Buffer.from(await response.arrayBuffer())
    
    console.log(`✅ [STRUCTURE CONTROL] Applied (${imageBuffer.length} bytes, seed: ${seed})`)

    return {
      buffer: imageBuffer,
      seed,
      finishReason,
    }

  } catch (error) {
    console.error("❌ [STRUCTURE CONTROL] Failed:", error)
    logError(error, "API_CALL", {
      controlStrength: params.controlStrength,
      promptLength: params.prompt.length,
    })
    throw error
  }
}
