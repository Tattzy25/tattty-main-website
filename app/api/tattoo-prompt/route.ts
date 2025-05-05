import { NextResponse } from "next/server"
import type { Message } from "ai"
import { engineerTattooPrompt } from "@/lib/prompt-engineering"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // First approach: Use our rule-based system
    const basicPrompt = engineerTattooPrompt(messages as Message[])

    // Second approach: Enhance with AI
    const enhancedPrompt = await enhancePromptWithAI(basicPrompt, messages)

    return NextResponse.json({ prompt: enhancedPrompt })
  } catch (error) {
    console.error("Error generating tattoo prompt:", error)
    return NextResponse.json({ error: "Failed to generate tattoo prompt" }, { status: 500 })
  }
}

async function enhancePromptWithAI(basicPrompt: string, messages: Message[]) {
  try {
    // Extract user messages for context
    const userContext = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n\n")

    // Use Groq to enhance the prompt
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      system: `You are a professional tattoo artist and prompt engineer specializing in creating detailed prompts for tattoo designs. 
      Your task is to enhance the given basic prompt by adding more specific details about visual elements, composition, artistic style, 
      symbolism, and technical considerations for tattooing. The final prompt should be a single, detailed paragraph without any explanations 
      or introductions - just the prompt itself. Make it detailed enough for an AI image generator to create a meaningful tattoo design.
      
      Focus on:
      1. Specific visual elements and their arrangement
      2. Artistic style details (line weight, shading technique, etc.)
      3. Color palette and how colors interact
      4. Symbolic meaning of elements
      5. Composition and flow
      6. Technical considerations for tattoo application
      
      Your output should be a single paragraph prompt, no more than 200 words.`,
      messages: [
        {
          role: "user",
          content: `Here is a conversation with a client about their tattoo design:\n\n${userContext}\n\nBased on this conversation, I've created a basic prompt: "${basicPrompt}"\n\nPlease enhance this prompt to make it more detailed and specific for generating a tattoo design image. Focus on visual elements, composition, style details, and symbolism.`,
        },
      ],
      temperature: 0.7,
      maxTokens: 500,
    })

    return text
  } catch (error) {
    console.error("Error enhancing prompt with AI:", error)
    // Fall back to the basic prompt if AI enhancement fails
    return basicPrompt
  }
}
