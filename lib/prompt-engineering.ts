import type { Message } from "ai"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

type PromptElements = {
  lifeEvents: string[]
  emotions: string[]
  symbols: string[]
  style: string
  colors?: string[]
  placement?: string
  themes: string[]
  personalDetails: string[]
}

/**
 * Extracts key elements from a conversation to use in prompt generation
 * Uses AI to analyze the conversation and extract meaningful elements
 */
export async function extractPromptElements(messages: Message[]): Promise<PromptElements> {
  try {
    // Get only user messages
    const userMessages = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n")

    // Use AI to extract elements from the conversation
    const prompt = `
      Analyze the following conversation about tattoo design preferences and extract key elements.
      Return the results as a valid JSON object with the following structure:
      {
        "lifeEvents": ["event1", "event2"],
        "emotions": ["emotion1", "emotion2"],
        "symbols": ["symbol1", "symbol2"],
        "style": "preferred style",
        "colors": ["color1", "color2"],
        "placement": "body placement",
        "themes": ["theme1", "theme2"],
        "personalDetails": ["detail1", "detail2"]
      }
      
      Conversation:
      ${userMessages}
    `

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      maxTokens: 1000,
    })

    // Parse the JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }

      const jsonStr = jsonMatch[0]
      const elements = JSON.parse(jsonStr) as PromptElements

      // Ensure we have default values for required fields
      return {
        lifeEvents: elements.lifeEvents || [],
        emotions: elements.emotions || [],
        symbols: elements.symbols || [],
        style: elements.style || "realistic",
        colors: elements.colors || [],
        placement: elements.placement || undefined,
        themes: elements.themes || [],
        personalDetails: elements.personalDetails || [],
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      // Fall back to basic extraction
      return fallbackExtractPromptElements(messages)
    }
  } catch (error) {
    console.error("Error in AI-based prompt element extraction:", error)
    // Fall back to basic extraction
    return fallbackExtractPromptElements(messages)
  }
}

/**
 * Fallback function for extracting prompt elements without AI
 */
function fallbackExtractPromptElements(messages: Message[]): PromptElements {
  // Get only user messages
  const userMessages = messages.filter((m) => m.role === "user").map((m) => m.content)

  // Default elements
  const elements: PromptElements = {
    lifeEvents: [],
    emotions: [],
    symbols: [],
    style: "realistic",
    colors: [],
    themes: [],
    personalDetails: [],
  }

  // Extract style from messages
  const styleRegex = /I'd like my tattoo in (\w+(?:-\w+)*) style/i
  for (const message of userMessages) {
    const match = message.match(styleRegex)
    if (match && match[1]) {
      elements.style = match[1].toLowerCase()
      break
    }
  }

  // Common emotions to detect
  const emotionKeywords = [
    "happy",
    "sad",
    "joy",
    "grief",
    "love",
    "hate",
    "anger",
    "peace",
    "anxiety",
    "calm",
    "fear",
    "courage",
    "hope",
    "despair",
    "strength",
    "weakness",
    "pride",
    "shame",
    "excitement",
    "boredom",
    "gratitude",
    "resilience",
    "determination",
    "freedom",
    "rebirth",
    "transformation",
    "growth",
    "balance",
    "harmony",
  ]

  // Common symbols to detect
  const symbolKeywords = [
    "tree",
    "bird",
    "flower",
    "mountain",
    "ocean",
    "river",
    "sun",
    "moon",
    "star",
    "heart",
    "hand",
    "eye",
    "clock",
    "compass",
    "anchor",
    "arrow",
    "feather",
    "butterfly",
    "dragon",
    "lion",
    "wolf",
    "phoenix",
    "cross",
    "lotus",
    "infinity",
    "wave",
    "fire",
    "water",
    "earth",
    "air",
    "skull",
    "rose",
    "snake",
    "owl",
    "geometric",
    "mandala",
    "spiral",
    "triangle",
    "circle",
    "square",
    "diamond",
  ]

  // Common themes to detect
  const themeKeywords = [
    "family",
    "journey",
    "rebirth",
    "strength",
    "freedom",
    "protection",
    "memory",
    "heritage",
    "nature",
    "spirituality",
    "balance",
    "growth",
    "transformation",
    "resilience",
    "healing",
    "connection",
    "ancestry",
    "achievement",
    "overcoming",
    "survival",
    "hope",
    "faith",
    "love",
    "friendship",
    "motherhood",
    "fatherhood",
  ]

  // Extract life events (look for longer sentences with personal narratives)
  userMessages.forEach((message) => {
    const sentences = message.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    sentences.forEach((sentence) => {
      if (sentence.length > 40 && (sentence.includes("I") || sentence.includes("my") || sentence.includes("me"))) {
        elements.lifeEvents.push(sentence.trim())
      }
    })
  })

  // Extract personal details (shorter phrases about the person)
  userMessages.forEach((message) => {
    const sentences = message.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    sentences.forEach((sentence) => {
      if (
        sentence.length < 40 &&
        (sentence.includes("I am") ||
          sentence.includes("I'm") ||
          sentence.includes("I like") ||
          sentence.includes("I love"))
      ) {
        elements.personalDetails.push(sentence.trim())
      }
    })
  })

  // Extract emotions
  emotionKeywords.forEach((emotion) => {
    const regex = new RegExp(`\\b${emotion}\\b`, "i")
    userMessages.forEach((message) => {
      if (regex.test(message) && !elements.emotions.includes(emotion)) {
        elements.emotions.push(emotion)
      }
    })
  })

  // Extract symbols
  symbolKeywords.forEach((symbol) => {
    const regex = new RegExp(`\\b${symbol}\\b`, "i")
    userMessages.forEach((message) => {
      if (regex.test(message) && !elements.symbols.includes(symbol)) {
        elements.symbols.push(symbol)
      }
    })
  })

  // Extract themes
  themeKeywords.forEach((theme) => {
    const regex = new RegExp(`\\b${theme}\\b`, "i")
    userMessages.forEach((message) => {
      if (regex.test(message) && !elements.themes.includes(theme)) {
        elements.themes.push(theme)
      }
    })
  })

  // Extract color preferences
  const colorKeywords = [
    "black",
    "white",
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "pink",
    "orange",
    "gray",
    "brown",
    "colorful",
    "monochrome",
    "gold",
    "silver",
    "teal",
    "turquoise",
    "navy",
    "crimson",
    "scarlet",
    "emerald",
    "jade",
    "amber",
    "bronze",
    "copper",
    "indigo",
    "violet",
    "magenta",
    "pastel",
  ]

  colorKeywords.forEach((color) => {
    const regex = new RegExp(`\\b${color}\\b`, "i")
    userMessages.forEach((message) => {
      if (regex.test(message) && !elements.colors?.includes(color)) {
        elements.colors?.push(color)
      }
    })
  })

  // Extract placement if mentioned
  const placementKeywords = [
    "arm",
    "forearm",
    "bicep",
    "shoulder",
    "back",
    "chest",
    "leg",
    "thigh",
    "calf",
    "ankle",
    "wrist",
    "hand",
    "finger",
    "neck",
    "ribs",
    "spine",
    "hip",
    "stomach",
    "sleeve",
    "half-sleeve",
    "quarter-sleeve",
    "full-back",
    "sternum",
    "collarbone",
    "behind ear",
    "foot",
    "side",
    "underarm",
  ]

  placementKeywords.forEach((placement) => {
    const regex = new RegExp(`\\b${placement}\\b`, "i")
    userMessages.forEach((message) => {
      if (regex.test(message) && !elements.placement) {
        elements.placement = placement
      }
    })
  })

  return elements
}

/**
 * Generates a detailed prompt for tattoo design based on conversation elements
 * Uses AI to create a high-quality prompt
 */
export async function generateTattooPrompt(elements: PromptElements): Promise<string> {
  try {
    // Use AI to generate a high-quality prompt
    const prompt = `
      Create a detailed prompt for an AI image generator to create a tattoo design.
      Use these extracted elements from a conversation:
      
      Style: ${elements.style}
      Symbols: ${elements.symbols.join(", ")}
      Themes: ${elements.themes.join(", ")}
      Emotions: ${elements.emotions.join(", ")}
      Life Events: ${elements.lifeEvents.join("; ")}
      Personal Details: ${elements.personalDetails.join("; ")}
      Colors: ${elements.colors?.join(", ") || "not specified"}
      Placement: ${elements.placement || "not specified"}
      
      The prompt should be detailed, descriptive, and optimized for generating a high-quality tattoo design.
      Focus on creating a prompt that will result in a design with clean lines suitable for tattooing,
      proper contrast that will age well, and a meaningful composition that flows with the body's natural contours.
      
      Return only the prompt text with no additional commentary.
    `

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      maxTokens: 500,
    })

    return text.trim()
  } catch (error) {
    console.error("Error in AI-based prompt generation:", error)
    // Fall back to basic prompt generation
    return fallbackGenerateTattooPrompt(elements)
  }
}

/**
 * Fallback function for generating a tattoo prompt without AI
 */
function fallbackGenerateTattooPrompt(elements: PromptElements): string {
  // Start with style and composition
  let prompt = `A ${elements.style} style tattoo design `

  // Add symbols if available
  if (elements.symbols.length > 0) {
    prompt += `featuring ${elements.symbols.join(", ")} `
  }

  // Add themes if available
  if (elements.themes.length > 0) {
    prompt += `representing themes of ${elements.themes.join(", ")} `
  }

  // Add emotions and meaning
  if (elements.emotions.length > 0) {
    prompt += `that conveys a sense of ${elements.emotions.join(", ")} `
  }

  // Add life events context if available
  if (elements.lifeEvents.length > 0) {
    // Take the most detailed life event
    const mainEvent = elements.lifeEvents.sort((a, b) => b.length - a.length)[0]
    prompt += `symbolizing "${mainEvent}" `
  }

  // Add personal details if available
  if (elements.personalDetails.length > 0) {
    const detail = elements.personalDetails[0]
    prompt += `reflecting the personal aspect "${detail}" `
  }

  // Add color information
  if (elements.colors && elements.colors.length > 0) {
    prompt += `using ${elements.colors.join(", ")} colors `
  } else {
    // Default color scheme based on style
    switch (elements.style) {
      case "traditional":
        prompt += "using bold black outlines with vibrant red, green, and yellow fills "
        break
      case "watercolor":
        prompt += "with flowing, vibrant colors that blend and drip like watercolor paint "
        break
      case "blackwork":
        prompt += "using only solid black ink with strong contrast and negative space "
        break
      case "minimalist":
        prompt += "with clean, thin black lines and minimal detail "
        break
      case "japanese":
        prompt += "with bold black outlines, vibrant colors, and dynamic composition "
        break
      case "neo-traditional":
        prompt += "with bold lines, rich colors, and detailed shading "
        break
      case "realism":
        prompt += "with photorealistic details, subtle shading, and depth "
        break
      case "geometric":
        prompt += "with precise lines, geometric shapes, and mathematical patterns "
        break
      case "surrealism":
        prompt += "with dreamlike imagery, unexpected juxtapositions, and symbolic elements "
        break
      default:
        prompt += "with balanced color harmony and strong contrast "
    }
  }

  // Add placement context if available
  if (elements.placement) {
    prompt += `designed to fit on the ${elements.placement} `
  }

  // Add technical quality requirements
  prompt +=
    "with clean lines suitable for tattooing, proper contrast that will age well, and meaningful composition that flows with the body's natural contours. The design should be detailed enough to convey deep symbolism while maintaining clarity at different sizes."

  return prompt
}

/**
 * Main function to process a conversation and generate a tattoo design prompt
 */
export async function engineerTattooPrompt(messages: Message[]): Promise<string> {
  const elements = await extractPromptElements(messages)
  return await generateTattooPrompt(elements)
}

/**
 * Alias for engineerTattooPrompt to maintain backward compatibility
 * Export as both named export and property
 */
export async function getPromptFromConversation(messages: Message[]): Promise<string> {
  return await engineerTattooPrompt(messages)
}

// Add as property on the module exports
export const getPromptFromConversation2 = getPromptFromConversation

// Default export as well
export default getPromptFromConversation
