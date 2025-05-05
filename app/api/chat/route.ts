import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { groq } from "@ai-sdk/groq"
import { supabase } from "@/lib/supabase"
import { getPromptFromConversation } from "@/lib/prompt-engineering"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { messages, model = "openai" } = await req.json()

    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()

    // Generate an enhanced prompt based on the conversation
    const enhancedPrompt = await getPromptFromConversation(messages)

    // Generate the response
    const { text } = await generateText({
      model: model === "openai" ? openai("gpt-4o") : groq("llama3-70b-8192"),
      prompt: enhancedPrompt || lastUserMessage.content,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Track analytics
    try {
      const styleMatch = text.match(/style:\s*([^\n,]+)/i)
      const themeMatch = text.match(/theme:\s*([^\n,]+)/i)

      if (styleMatch && themeMatch) {
        const style = styleMatch[1].trim()
        const theme = themeMatch[1].trim()

        await supabase.from("analytics").insert({
          style,
          theme,
          count: 1,
        })
      }
    } catch (error) {
      console.error("Analytics error:", error)
    }

    // Return the response
    return new Response(text)
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
