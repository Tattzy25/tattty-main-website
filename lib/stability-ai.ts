// Enhanced implementation for Stability AI integration
export async function generateImage(prompt: string) {
  try {
    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/ultra", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1.0,
          },
        ],
        height: 1024,
        width: 1024,
        steps: 40,
        cfg_scale: 7,
        samples: 1,
        style_preset: "tattoo",
        seed: Math.floor(Math.random() * 2147483647),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to generate image")
    }

    const data = await response.json()
    return {
      success: true,
      imageData: data.artifacts[0].base64,
    }
  } catch (error: any) {
    console.error("Stability API error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}
