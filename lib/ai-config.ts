// AI model configuration
export const AI_CONFIG = {
  groq: {
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    apiKey: process.env.GROQ_API_KEY,
  },
  stability: {
    endpoint: "https://api.stability.ai/v2beta/stable-image/generate/ultra",
    apiKey: process.env.STABILITY_API_KEY,
  },
}
