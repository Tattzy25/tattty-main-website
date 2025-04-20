import { generateText } from "./groq-ai"

// Play.ai integration for voice synthesis using GROQ for enhancement
export async function generateSpeech(text: string): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
  try {
    console.log("Generating speech with Play.ai:", text)

    // First, use GROQ to enhance the text for better speech quality
    const enhancedResult = await generateText(
      `Enhance this text for natural, flirty and attractive speech synthesis with Jennifer's voice: "${text}"`,
    )

    // Get the text to speak (enhanced or original)
    const textToSpeak = enhancedResult.success && enhancedResult.text ? enhancedResult.text : text

    // Call Play.ai API with the text
    const response = await fetch("https://api.play.ht/api/v2/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PLAY_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: textToSpeak,
        voice: "jennifer", // Using Jennifer's voice as requested
        quality: "premium",
        output_format: "mp3",
        speed: 1.0,
        sample_rate: 24000,
        voice_engine: "PlayHT2.0-turbo", // Using the latest engine for best quality
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Play.ai API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return {
      success: true,
      audioUrl: data.url,
    }
  } catch (error: any) {
    console.error("Error generating speech with Play.ai:", error)
    return {
      success: false,
      error: error.message || "Failed to generate speech",
    }
  }
}
