import { NextRequest, NextResponse } from "next/server"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AIProvider {
  id: string
  name: string
  endpoint: string
  apiKeyEnv: string
  models: AIModel[]
  headers?: Record<string, string>
}

interface AIModel {
  id: string
  name: string
  maxTokens: number
  temperature: number
}

export async function POST(req: NextRequest) {
  try {
    const { messages, providerId, modelId, provider, model } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 })
    }

    if (!providerId || !modelId || !provider || !model) {
      return NextResponse.json({ error: "Provider and model required" }, { status: 400 })
    }

    const response = await callAIProvider(messages, provider, model)
    return NextResponse.json({ message: response })
  } catch (error) {
    console.error("Chat API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to process request"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

async function callAIProvider(
  messages: Message[], 
  provider: AIProvider, 
  model: AIModel
): Promise<string> {
  const apiKey = process.env[provider.apiKeyEnv] || ""
  const isLocalModel = provider.endpoint.startsWith("http://localhost") || provider.endpoint.startsWith("http://127.0.0.1")

  if (!apiKey && !isLocalModel) {
    throw new Error(`${provider.apiKeyEnv} not configured in environment variables`)
  }

  const providerId = provider.id.toLowerCase()

  if (providerId.includes("anthropic") || providerId.includes("claude")) {
    return callAnthropic(messages, provider, model, apiKey)
  }

  if (providerId.includes("google") || providerId.includes("gemini") || providerId.includes("vertex")) {
    return callGoogle(messages, provider, model, apiKey)
  }

  return callOpenAICompatible(messages, provider, model, apiKey)
}

async function callOpenAICompatible(
  messages: Message[],
  provider: AIProvider,
  model: AIModel,
  apiKey: string
): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  }

  if (provider.id === "openrouter") {
    headers["HTTP-Referer"] = process.env.NEXT_PUBLIC_APP_URL || "https://tattty.com"
    headers["X-Title"] = "Tattty Admin Dashboard"
  }

  const response = await fetch(provider.endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: model.id,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      temperature: model.temperature,
      max_tokens: model.maxTokens
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`${provider.name} API error: ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error(`Invalid response format from ${provider.name}`)
  }

  return data.choices[0].message.content
}

async function callAnthropic(
  messages: Message[],
  provider: AIProvider,
  model: AIModel,
  apiKey: string
): Promise<string> {
  const systemMessage = "You are a helpful AI assistant for the Tattty admin dashboard. Help admins understand their data, analytics, users, and tattoo generation metrics."

  const response = await fetch(provider.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: model.id,
      max_tokens: model.maxTokens,
      temperature: model.temperature,
      system: systemMessage,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`${provider.name} API error: ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  
  if (!data.content || !data.content[0] || !data.content[0].text) {
    throw new Error(`Invalid response format from ${provider.name}`)
  }

  return data.content[0].text
}

async function callGoogle(
  messages: Message[],
  provider: AIProvider,
  model: AIModel,
  apiKey: string
): Promise<string> {
  const providerId = provider.id.toLowerCase()
  const isVertexAI = providerId.includes("vertex")
  const isGemini = providerId.includes("gemini")

  // Convert messages to Google format
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  let endpoint = provider.endpoint
  let body: any

  if (isVertexAI) {
    // Vertex AI uses OAuth or service account auth
    headers["Authorization"] = `Bearer ${apiKey}`
    body = {
      contents,
      generationConfig: {
        temperature: model.temperature,
        maxOutputTokens: model.maxTokens,
      },
    }
  } else if (isGemini) {
    // Google AI (Gemini) uses API key in URL or header
    if (!endpoint.includes("key=")) {
      endpoint = `${endpoint}?key=${apiKey}`
    }
    body = {
      contents,
      generationConfig: {
        temperature: model.temperature,
        maxOutputTokens: model.maxTokens,
      },
    }
  } else {
    // Fallback: try API key in header
    headers["x-goog-api-key"] = apiKey
    body = {
      contents,
      generationConfig: {
        temperature: model.temperature,
        maxOutputTokens: model.maxTokens,
      },
    }
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`${provider.name} API error: ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  
  // Google response format: candidates[0].content.parts[0].text
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
    throw new Error(`Invalid response format from ${provider.name}`)
  }

  return data.candidates[0].content.parts[0].text
}