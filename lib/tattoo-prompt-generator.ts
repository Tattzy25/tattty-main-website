/**
 * Specialized function for generating detailed tattoo design prompts
 * This can be used directly when needed without going through the API
 */
export function generateSpecializedTattooPrompt(input: {
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
 * Export as both named export and property
 */
export async function enhancePrompt(basePrompt: string): Promise<string> {
  // This is a simplified version that just returns the base prompt
  // In a real implementation, this might call an AI service to enhance the prompt
  return basePrompt
}

// Add as property on the module exports
export const enhancePromptFn = enhancePrompt

// Default export as well
export default enhancePrompt
