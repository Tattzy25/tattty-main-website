/**
 * Groq AI Prompt Templates for Tattoo Generation
 * Model: openai/gpt-oss-120b
 * 
 * NO FALLBACKS - If it breaks, it breaks LOUD
 */

export interface UserAnswers {
  card1: string // Style preference - REQUIRED
  card2: string // Color preference - REQUIRED
  card3: string // Placement - REQUIRED
  card4: string // Size - REQUIRED
  card5: string // Meaning/Story - REQUIRED
  card6: string // What to AVOID (negative) - REQUIRED
  card7: string // Additional details - REQUIRED
  card8?: string // Follow-up answer (only for second call)
}

// Re-export from groq-prompts for convenience
export type { UserAnswers as GroqUserAnswers }

/**
 * FIRST CALL - After Cards 1-7
 * Purpose: Analyze user answers and generate ONE intelligent follow-up question
 * 
 * NO FALLBACKS - All cards must be answered or this will THROW
 */
export function generateFollowUpPrompt(answers: UserAnswers): string {
  // VALIDATE - NO FALLBACKS
  if (!answers.card1) throw new Error("Card 1 (Style) is required")
  if (!answers.card2) throw new Error("Card 2 (Color) is required")
  if (!answers.card3) throw new Error("Card 3 (Placement) is required")
  if (!answers.card4) throw new Error("Card 4 (Size) is required")
  if (!answers.card5) throw new Error("Card 5 (Meaning) is required")
  if (!answers.card6) throw new Error("Card 6 (Avoid) is required")
  if (!answers.card7) throw new Error("Card 7 (Details) is required")

  return `You are an expert tattoo design consultant with deep understanding of tattoo artistry, symbolism, and personal storytelling through body art. Please help The user build and create a meaningful tattoo Prompt

USER'S ANSWERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Style Preference: ${answers.card1}
Color Palette: ${answers.card2}
Body Placement: ${answers.card3}
Size Range: ${answers.card4}
Personal Meaning: ${answers.card5}
Elements to AVOID: ${answers.card6}
Additional Details: ${answers.card7}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TASK: Generate ONE follow-up question that addresses:
- Any ambiguity in their choices
- Missing critical design elements
- Opportunities to deepen the personal meaning
- Refinement of style or symbolism
- Cultural or emotional context that could enhance the design

CONSTRAINTS:
- Must be ONE question only
- Should be open-ended but focused
- Must lead to actionable design insights
- Should feel personal and thoughtful, not generic
- Maximum 2 sentences

Return ONLY the follow-up question text. No preamble, no explanation, no JSON.`
}

/**
 * SECOND CALL - After Card 8 (Follow-up Answer)
 * Purpose: Generate final AI-ready prompts for image generation
 * 
 * NO FALLBACKS - Card 8 answer is REQUIRED
 */
export function generateFinalPrompt(answers: UserAnswers): string {
  // VALIDATE - NO FALLBACKS
  if (!answers.card1) throw new Error("Card 1 (Style) is required")
  if (!answers.card2) throw new Error("Card 2 (Color) is required")
  if (!answers.card3) throw new Error("Card 3 (Placement) is required")
  if (!answers.card4) throw new Error("Card 4 (Size) is required")
  if (!answers.card5) throw new Error("Card 5 (Meaning) is required")
  if (!answers.card6) throw new Error("Card 6 (Avoid) is required")
  if (!answers.card7) throw new Error("Card 7 (Details) is required")
  if (!answers.card8) throw new Error("Card 8 (Follow-up) is required for final prompt generation")

  return `You are an expert AI prompt engineer specializing in tattoo design generation using Stability AI Diffusion models.

ROLE: Transform user answers into optimized positive and negative prompts for tattoo image generation.

COMPLETE USER PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Style: ${answers.card1}
Colors: ${answers.card2}
Placement: ${answers.card3}
Size: ${answers.card4}
Meaning: ${answers.card5}
Avoid: ${answers.card6}
Details: ${answers.card7}
Follow-up: ${answers.card8}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TASK: Generate prompts optimized for Stability AI Diffusion 3.5 with the following requirements:

POSITIVE PROMPT Guidelines:
- Lead with art style keywords (e.g., "traditional tattoo", "realistic black and grey", "watercolor style")
- Include specific visual elements, composition, and details
- Incorporate emotional tone and symbolism
- Mention technical qualities (linework, shading, detail level)
- Keep it focused and descriptive (100-200 words max)
- Use tattoo industry terminology

NEGATIVE PROMPT Guidelines:
- Include user's explicit "avoid" preferences from Card 6
- Add standard tattoo quality exclusions (blurry, distorted, amateur, etc.)
- List unwanted styles, elements, or themes
- Keep it concise (50-100 words max)

STYLE PARAMETERS:
- Determine primary art style category
- Identify mood/emotional tone
- Note any cultural or symbolic themes

OUTPUT FORMAT (Return as valid JSON):
{
  "positivePrompt": "detailed positive prompt here",
  "negativePrompt": "detailed negative prompt here",
  "style": "primary art style",
  "mood": "emotional tone",
  "culturalThemes": "any cultural/symbolic elements"
}

Return ONLY valid JSON. No markdown, no code blocks, no explanation.`
}

/**
 * Groq API Configuration - Based on Real SDK
 * Using: from groq import Groq
 */
export const GROQ_CONFIG = {
  model: "openai/gpt-oss-120b",
  temperature: 1,
  max_completion_tokens: 65536,
  top_p: 1,
  reasoning_effort: "high" as const,
  stream: true, // Enable streaming
  stop: null,
  // MCP Tools for web search and enhanced reasoning - OPTIONAL
  tools: process.env.TAVILY_API_KEY ? [
    { type: "browser_search" },
    {
      type: "mcp",
      server_label: "Tavily",
      server_url: `https://mcp.tavily.com/mcp/?tavilyApiKey=${process.env.TAVILY_API_KEY}`,
      headers: {}
    }
  ] : []
}

/**
 * Type for final prompt response
 * NO OPTIONAL FIELDS - If it's missing, we THROW
 */
export interface FinalPromptResponse {
  positivePrompt: string
  negativePrompt: string
  style: string
  mood: string
  culturalThemes: string
}
