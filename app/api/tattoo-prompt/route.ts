import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { enhancePrompt } from "@/lib/tattoo-prompt-generator"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { prompt, style, placement, size } = await req.json()

    // Enhance the prompt with style, placement, and size information
    const enhancedPrompt = enhancePrompt(prompt, style, placement, size)

    // Generate the response
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: enhancedPrompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    return new Response(JSON.stringify({ prompt: text }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Tattoo prompt generation error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate tattoo prompt" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
