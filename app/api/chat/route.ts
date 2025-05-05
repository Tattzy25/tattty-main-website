import { groq } from "@ai-sdk/groq"
import { streamText, StreamingTextResponse } from "ai"
import type { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    // Extract the messages and user info from the request
    const { messages, userId } = await req.json()

    // Create system prompt for Tattty
    const systemPrompt = `You are Tattty, an empathetic AI assistant specialized in helping users create meaningful tattoo designs based on their life stories.

IMPORTANT GUIDELINES:
- Be warm, supportive, and non-judgmental when users share personal stories
- Ask thoughtful follow-up questions to understand the emotional significance of their experiences
- Identify key themes, symbols, and emotions in their stories
- When creating an image prompt, be detailed and specific about visual elements
- Format image prompts with "IMAGE PROMPT:" followed by the detailed description
- Focus on creating designs that represent personal growth, transformation, and resilience
- Avoid generic or cliché tattoo designs
- Never include inappropriate or offensive content in designs
- After a few exchanges, suggest the user select a tattoo style by saying "Now, please select a tattoo style that resonates with you."

When creating the final image prompt:
1. Incorporate specific elements from the user's story
2. Consider the requested tattoo style
3. Include details about composition, symbolism, and emotional tone
4. Make the prompt detailed enough for Stability AI to generate a meaningful design

Remember: Your goal is to help users translate their life experiences into meaningful visual art.`

    // Process the conversation with Groq
    const response = await streamText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.filter((m) => m.role === "user" || m.role === "assistant"),
      ],
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Store the conversation in the database if userId is provided
    if (userId) {
      // Get the latest messages
      const userMessage = messages.filter((m) => m.role === "user").pop()

      if (userMessage) {
        // Store the user message
        await supabase.from("chat_history").insert({
          user_id: userId,
          role: "user",
          content: userMessage.content,
          created_at: new Date().toISOString(),
        })
      }
    }

    // Return the streaming response
    return new StreamingTextResponse(response.textStream)
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// Add a GET endpoint to retrieve chat history
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Retrieve chat history for the user
    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({ messages: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error retrieving chat history:", error)
    return new Response(JSON.stringify({ error: "Failed to retrieve chat history" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
