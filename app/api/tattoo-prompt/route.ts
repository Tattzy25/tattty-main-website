import { NextResponse } from "next/server"
import type { CoreMessage } from "ai"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json()
    } catch (parseError) {
      console.error("Invalid JSON in request body:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Since we've removed the rule-based system, we'll generate the prompt directly with AI
    const userMessages = messages.filter(m => m.role === "user").map(m => m.content).join("\n\n")
    const basicPrompt = `Create a tattoo design based on: ${userMessages}`
    
    // Enhance with AI
    const enhancedPrompt = await enhancePromptWithAI(basicPrompt, messages)

    return NextResponse.json({ prompt: enhancedPrompt })
  } catch (error) {
    console.error("Error generating tattoo prompt:", error)
    return NextResponse.json({ error: "Failed to generate tattoo prompt" }, { status: 500 })
  }
}

async function enhancePromptWithAI(basicPrompt: string, messages: CoreMessage[]) {
  try {
    // Extract user messages for context
    const userContext = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n\n")

    // Use Groq to enhance the prompt
    const { text } = await generateText({
      model: groq("openai/gpt-oss-120b") as any,
      prompt: `You are a professional tattoo artist and prompt engineer specializing in creating detailed prompts for tattoo designs. 
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
      
      Your output should be a single paragraph prompt, no more than 200 words.

      Here is a conversation with a client about their tattoo design:

      ${userContext}

      Based on this conversation, I've created a basic prompt: "${basicPrompt}"

      Please enhance this prompt to make it more detailed and specific for generating a tattoo design image. Focus on visual elements, composition, style details, and symbolism.`,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error enhancing prompt with AI:", error)
    // Fallback to basic prompt if AI enhancement fails
    return basicPrompt
  }
}
