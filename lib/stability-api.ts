import { STABILITY_API_KEY } from "@/lib/config"
import { createBlob } from "@/lib/blob-storage"

interface StabilityResponse {
  artifacts: Array<{
    base64: string
    seed: number
    finishReason: string
  }>
}

export async function generateTattooDesign(prompt: string, references: string[] = []): Promise<string> {
  try {
    // Enhance the prompt with tattoo-specific guidance
    const enhancedPrompt = `Create a detailed tattoo design based on the following description: ${prompt}. 
    The design should have clean lines, appropriate contrast for tattooing, and meaningful symbolism. 
    Make it suitable for application on human skin with professional tattoo techniques.`

    // Set up the request to Stability AI
    const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: enhancedPrompt,
            weight: 1,
          },
          {
            text: "blurry, low quality, distorted, unrealistic tattoo, bad anatomy, text, words, writing, signature, watermark",
            weight: -1,
          },
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Stability API error: ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    const data: StabilityResponse = await response.json()

    if (!data.artifacts || data.artifacts.length === 0) {
      throw new Error("No images were generated")
    }

    // Convert the base64 image to a buffer
    const imageBase64 = data.artifacts[0].base64
    const buffer = Buffer.from(imageBase64, "base64")

    // Upload to Vercel Blob
    const blob = await createBlob(buffer, {
      contentType: "image/png",
      filename: `tattoo-design-${Date.now()}.png`,
    })

    // Return the blob URL
    return blob.url
  } catch (error) {
    console.error("Error generating tattoo design:", error)
    throw error
  }
}

// Generate multiple design variations
export async function generateDesignVariations(
  prompt: string,
  count = 3,
  references: string[] = [],
): Promise<string[]> {
  try {
    const urls: string[] = []

    // Generate multiple designs in parallel
    const promises = Array(count)
      .fill(0)
      .map(() => generateTattooDesign(prompt, references))
    const results = await Promise.allSettled(promises)

    // Filter successful results
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        urls.push(result.value)
      }
    })

    return urls
  } catch (error) {
    console.error("Error generating design variations:", error)
    throw error
  }
}

// Generate design with a specific style
export async function generateStyledDesign(prompt: string, style: string): Promise<string> {
  try {
    const styledPrompt = `${style} style tattoo design of ${prompt}`
    return await generateTattooDesign(styledPrompt)
  } catch (error) {
    console.error(`Error generating ${style} style design:`, error)
    throw error
  }
}
