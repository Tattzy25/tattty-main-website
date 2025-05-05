import { STABILITY_API_KEY } from "@/lib/config"

interface StabilityResponse {
  artifacts: Array<{
    base64: string
    seed: number
    finishReason: string
  }>
}

export async function generateImage(prompt: string, style: string): Promise<string> {
  try {
    // Enhance the prompt with style information
    const enhancedPrompt = `${prompt} Style: ${style} tattoo design, detailed linework, suitable for tattooing on skin, professional tattoo art`

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
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      }),
    })

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.statusText}`)
    }

    const data: StabilityResponse = await response.json()

    // Convert the base64 image to a data URL
    const imageBase64 = data.artifacts[0].base64
    return `data:image/png;base64,${imageBase64}`
  } catch (error) {
    console.error("Error generating image:", error)
    throw error
  }
}
