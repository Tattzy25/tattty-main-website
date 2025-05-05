import type { Message } from "ai"

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
 */
export function extractPromptElements(messages: Message[]): PromptElements {
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

  // Tattoo styles to detect
  const styleKeywords: Record<string, string[]> = {
    traditional: ["traditional", "old school", "americana", "classic", "sailor jerry"],
    "neo-traditional": ["neo-traditional", "neo traditional", "new traditional"],
    realism: ["realism", "realistic", "photorealistic", "portrait", "hyperrealism"],
    watercolor: ["watercolor", "watercolour", "painterly", "abstract", "fluid"],
    tribal: ["tribal", "polynesian", "maori", "hawaiian", "samoan", "indigenous"],
    japanese: ["japanese", "irezumi", "oriental", "yakuza", "asian"],
    blackwork: ["blackwork", "black work", "solid black", "black ink", "negative space"],
    minimalist: ["minimalist", "minimal", "simple", "line art", "linework", "fine line"],
    geometric: ["geometric", "geometry", "shapes", "pattern", "sacred geometry"],
    dotwork: ["dotwork", "dot work", "stippling", "pointillism", "dots"],
    sketch: ["sketch", "sketchy", "drawing", "pencil", "illustrative"],
    "trash polka": ["trash polka", "abstract", "red and black", "chaotic"],
    "new school": ["new school", "cartoon", "graffiti", "bold", "colorful"],
    biomechanical: ["biomechanical", "biomech", "mechanical", "cyborg", "sci-fi"],
    chicano: ["chicano", "mexican", "latin", "hispanic", "prison"],
    "fine line": ["fine line", "single needle", "delicate", "thin line", "subtle"],
    woodcut: ["woodcut", "woodblock", "engraving", "etching", "vintage"],
    surrealism: ["surreal", "surrealism", "dreamlike", "fantasy", "dali"],
    ornamental: ["ornamental", "decorative", "filigree", "baroque", "intricate"],
    cosmic: ["cosmic", "space", "galaxy", "universe", "celestial", "astronomical"],
  }

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

  // Extract style preference
  for (const [style, keywords] of Object.entries(styleKeywords)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "i")
      const found = userMessages.some((message) => regex.test(message))
      if (found) {
        elements.style = style
        break
      }
    }
  }

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
 */
export function generateTattooPrompt(elements: PromptElements): string {
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
export function engineerTattooPrompt(messages: Message[]): string {
  const elements = extractPromptElements(messages)
  return generateTattooPrompt(elements)
}

/**
 * Alias for engineerTattooPrompt to maintain backward compatibility
 */
export function getPromptFromConversation(messages: Message[]): string {
  return engineerTattooPrompt(messages)
}
