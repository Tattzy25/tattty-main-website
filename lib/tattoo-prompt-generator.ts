import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

/**
 * Specialized function for generating detailed tattoo design prompts
 * Uses AI to create high-quality prompts based on user input
 */
export async function generateSpecializedTattooPrompt(input: {
  lifeStory?: string
  emotions?: string[]
  symbols?: string[]
  style?: string
  themes?: string[]
  placement?: string
  colors?: string[]
}): Promise<string> {
  try {
    const {
      lifeStory = "",
      emotions = [],
      symbols = [],
      style = "realistic",
      themes = [],
      placement = "",
      colors = [],
    } = input

    // Create a prompt for the AI to generate a specialized tattoo prompt
    const aiPrompt = `
      Create a detailed prompt for an AI image generator to create a tattoo design.
      Use these elements provided by the user:
      
      ${lifeStory ? `Life Story: ${lifeStory}` : ""}
      ${emotions.length > 0 ? `Emotions: ${emotions.join(", ")}` : ""}
      ${symbols.length > 0 ? `Symbols: ${symbols.join(", ")}` : ""}
      Style: ${style}
      ${themes.length > 0 ? `Themes: ${themes.join(", ")}` : ""}
      ${placement ? `Placement: ${placement}` : ""}
      ${colors.length > 0 ? `Colors: ${colors.join(", ")}` : ""}
      
      The prompt should be detailed, descriptive, and optimized for generating a high-quality tattoo design.
      Focus on creating a prompt that will result in a design with clean lines suitable for tattooing,
      proper contrast that will age well, and a meaningful composition that flows with the body's natural contours.
      
      Return only the prompt text with no additional commentary.
    `

    // Generate the specialized prompt using AI
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: aiPrompt,
      maxTokens: 500,
    })

    return text.trim()
  } catch (error) {
    console.error("Error generating specialized tattoo prompt:", error)

    // Fall back to manual prompt generation
    return fallbackGeneratePrompt(input)
  }
}

/**
 * Fallback function for generating a prompt without AI
 */
function fallbackGeneratePrompt(input: {
  lifeStory?: string
  emotions?: string[]
  symbols?: string[]
  style?: string
  themes?: string[]
  placement?: string
  colors?: string[]
}): string {
  const {
    lifeStory = "",
    emotions = [],
    symbols = [],
    style = "realistic",
    themes = [],
    placement = "",
    colors = [],
  } = input

  // Build the core design description
  let prompt = `A ${style} style tattoo design `

  // Add symbols if available
  if (symbols.length > 0) {
    prompt += `featuring ${symbols.join(", ")} `
  }

  // Add themes if available
  if (themes.length > 0) {
    prompt += `representing themes of ${themes.join(", ")} `
  }

  // Add emotions and meaning
  if (emotions.length > 0) {
    prompt += `that conveys a sense of ${emotions.join(", ")} `
  }

  // Add life story context if available
  if (lifeStory) {
    prompt += `symbolizing "${lifeStory}" `
  }

  // Add color information
  if (colors.length > 0) {
    prompt += `using ${colors.join(", ")} colors `
  } else {
    // Default color scheme based on style
    switch (style) {
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
  if (placement) {
    prompt += `designed to fit on the ${placement} `
  }

  // Add technical quality requirements
  prompt +=
    "with clean lines suitable for tattooing, proper contrast that will age well, and meaningful composition that flows with the body's natural contours. The design should be detailed enough to convey deep symbolism while maintaining clarity at different sizes."

  return prompt
}

/**
 * Enhances a basic prompt with additional details and styling
 * Uses AI to improve the prompt quality
 */
export async function enhancePrompt(basePrompt: string): Promise<string> {
  try {
    // Create a prompt for the AI to enhance the base prompt
    const aiPrompt = `
      Enhance the following tattoo design prompt to make it more detailed and optimized for AI image generation.
      Add specific details about composition, style, lighting, and technical aspects that would make it a better tattoo.
      
      Original prompt: "${basePrompt}"
      
      Return only the enhanced prompt with no additional commentary.
    `

    // Generate the enhanced prompt using AI
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: aiPrompt,
      maxTokens: 500,
    })

    return text.trim()
  } catch (error) {
    console.error("Error enhancing prompt:", error)

    // If AI enhancement fails, return the original prompt
    return basePrompt
  }
}

// Add as property on the module exports
export const enhancePromptFn = enhancePrompt

// Default export as well
export default enhancePrompt
