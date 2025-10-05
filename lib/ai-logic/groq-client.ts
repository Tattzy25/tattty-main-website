/**
 * Groq API Client for Tattoo Generation
 * NO FALLBACKS - If it breaks, it breaks LOUD
 * 
 * Based on: from groq import Groq
 */

import Groq from "groq-sdk"
import { GROQ_CONFIG, generateFollowUpPrompt, generateFinalPrompt, type UserAnswers, type FinalPromptResponse } from "./groq-prompts"

// Initialize Groq client lazily (server-side only)
let groqClient: Groq | null = null

function getGroqClient(): Groq {
  if (!groqClient) {
    if (typeof window !== 'undefined') {
      throw new Error("❌ Groq client cannot be initialized on client-side")
    }
    
    if (!process.env.GROQ_API_KEY) {
      throw new Error("❌ GROQ_API_KEY is not set in environment variables")
    }
    
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }
  
  return groqClient
}

/**
 * FIRST CALL: Generate follow-up question (Card 8)
 * Streams the response for real-time display
 * 
 * @throws Error if any required card is missing
 * @throws Error if API call fails
 */
export async function generateFollowUpQuestion(
  answers: UserAnswers,
  onChunk?: (text: string) => void
): Promise<string> {
  console.log("🔄 [GROQ] Generating follow-up question...")
  
  const client = getGroqClient()
  const systemPrompt = generateFollowUpPrompt(answers)
  
  try {
    const completion = await client.chat.completions.create({
      model: GROQ_CONFIG.model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: "Based on my answers, what follow-up question would help perfect my tattoo design?",
        },
      ],
      temperature: GROQ_CONFIG.temperature,
      max_completion_tokens: GROQ_CONFIG.max_completion_tokens,
      top_p: GROQ_CONFIG.top_p,
      // @ts-ignore - Groq SDK might not have full types for reasoning_effort
      reasoning_effort: GROQ_CONFIG.reasoning_effort,
      stream: true, // Force stream to true
      stop: GROQ_CONFIG.stop,
      // @ts-ignore - Tools might not be fully typed
      tools: GROQ_CONFIG.tools,
    })

    let fullResponse = ""

    // Check if streaming
    if (Symbol.asyncIterator in completion) {
      // Stream the response
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || ""
        if (content) {
          fullResponse += content
          if (onChunk) {
            onChunk(content)
          }
        }
      }
    } else {
      // Non-streaming fallback (should not happen with stream: true)
      throw new Error("❌ Groq API did not return streaming response")
    }

    if (!fullResponse.trim()) {
      throw new Error("❌ Groq returned empty response for follow-up question")
    }

    console.log("✅ [GROQ] Follow-up question generated")
    return fullResponse.trim()

  } catch (error) {
    console.error("❌ [GROQ] Failed to generate follow-up question:", error)
    throw new Error(`Groq API Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * SECOND CALL: Generate final prompts for Stability AI
 * Returns structured JSON with positive/negative prompts
 * 
 * @throws Error if Card 8 is missing
 * @throws Error if API call fails
 * @throws Error if JSON parsing fails
 */
export async function generateFinalPrompts(
  answers: UserAnswers,
  onChunk?: (text: string) => void
): Promise<FinalPromptResponse> {
  console.log("🔄 [GROQ] Generating final prompts for image generation...")
  
  const client = getGroqClient()
  const systemPrompt = generateFinalPrompt(answers)
  
  try {
    const completion = await client.chat.completions.create({
      model: GROQ_CONFIG.model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: "Generate the final positive and negative prompts for my tattoo design in JSON format.",
        },
      ],
      temperature: GROQ_CONFIG.temperature,
      max_completion_tokens: GROQ_CONFIG.max_completion_tokens,
      top_p: GROQ_CONFIG.top_p,
      // @ts-ignore
      reasoning_effort: GROQ_CONFIG.reasoning_effort,
      stream: true, // Force stream to true
      stop: GROQ_CONFIG.stop,
      // @ts-ignore
      tools: GROQ_CONFIG.tools,
    })

    let fullResponse = ""

    // Check if streaming
    if (Symbol.asyncIterator in completion) {
      // Stream the response
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || ""
        if (content) {
          fullResponse += content
          if (onChunk) {
            onChunk(content)
          }
        }
      }
    } else {
      // Non-streaming fallback (should not happen with stream: true)
      throw new Error("❌ Groq API did not return streaming response")
    }

    if (!fullResponse.trim()) {
      throw new Error("❌ Groq returned empty response for final prompts")
    }

    console.log("🔍 [GROQ] Raw response:", fullResponse)

    // Parse JSON response
    let parsedResponse: FinalPromptResponse
    try {
      // Remove any markdown code blocks if present
      const jsonString = fullResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      
      parsedResponse = JSON.parse(jsonString)
    } catch (parseError) {
      console.error("❌ [GROQ] Failed to parse JSON response:", fullResponse)
      throw new Error(`Failed to parse Groq response as JSON: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}`)
    }

    // VALIDATE - NO FALLBACKS
    if (!parsedResponse.positivePrompt) {
      throw new Error("❌ Missing 'positivePrompt' in Groq response")
    }
    if (!parsedResponse.negativePrompt) {
      throw new Error("❌ Missing 'negativePrompt' in Groq response")
    }
    if (!parsedResponse.style) {
      throw new Error("❌ Missing 'style' in Groq response")
    }
    if (!parsedResponse.mood) {
      throw new Error("❌ Missing 'mood' in Groq response")
    }
    if (!parsedResponse.culturalThemes) {
      throw new Error("❌ Missing 'culturalThemes' in Groq response")
    }

    console.log("✅ [GROQ] Final prompts generated successfully")
    console.log("  📝 Positive prompt:", parsedResponse.positivePrompt.substring(0, 100) + "...")
    console.log("  🚫 Negative prompt:", parsedResponse.negativePrompt.substring(0, 100) + "...")
    console.log("  🎨 Style:", parsedResponse.style)
    console.log("  💭 Mood:", parsedResponse.mood)

    return parsedResponse

  } catch (error) {
    console.error("❌ [GROQ] Failed to generate final prompts:", error)
    throw new Error(`Groq API Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Health check for Groq API
 * @throws Error if API key is missing or invalid
 */
export async function testGroqConnection(): Promise<boolean> {
  try {
    const client = getGroqClient()
    const testCompletion = await client.chat.completions.create({
      model: GROQ_CONFIG.model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'OK' if you can hear me." },
      ],
      temperature: 0.5,
      max_completion_tokens: 10,
      stream: false,
    })

    const response = testCompletion.choices[0]?.message?.content
    console.log("✅ [GROQ] Connection test successful:", response)
    return true
  } catch (error) {
    console.error("❌ [GROQ] Connection test failed:", error)
    throw new Error(`Groq connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
