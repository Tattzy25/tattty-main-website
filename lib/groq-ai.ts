// Enhanced implementation for GROQ API integration with LLaMA 4 Scout
export async function generateText(prompt: string) {
  try {
    console.log("Generating text with GROQ LLaMA 4 Scout:", prompt)

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a tattoo expert with god-level experience. You provide detailed, creative, and artistic guidance for tattoo designs. Your tone is flirty and attractive, like Jennifer's voice.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || `Failed to generate text: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      text: data.choices[0].message.content.trim(),
    }
  } catch (error: any) {
    console.error("GROQ API error:", error)
    return {
      success: false,
      error: error.message,
      text: null,
    }
  }
}

export async function enhancePrompt(prompt: string) {
  try {
    console.log("Enhancing tattoo prompt with GROQ LLaMA 4 Scout:", prompt)

    // Use generateText to enhance the prompt
    const result = await generateText(
      `As a tattoo genius master with god-level experience, enhance this tattoo design prompt with more details, artistic elements, and creative direction to create a legendary ultimate prompt for Stability Ultra API: "${prompt}"`,
    )

    if (!result.success || !result.text) {
      throw new Error(result.error || "Failed to enhance prompt")
    }

    return {
      success: true,
      enhancedPrompt: result.text,
    }
  } catch (error: any) {
    console.error("Error enhancing prompt:", error)
    return {
      success: false,
      error: error.message,
      enhancedPrompt: prompt, // Fall back to original prompt
    }
  }
}
