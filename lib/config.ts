// Environment variables
export const STABILITY_API_KEY = process.env.STABILITY_API_KEY || ""
export const GROQ_API_KEY = process.env.GROQ_API_KEY || ""
export const PEXELS_API_KEY = process.env.PEXELS_API_KEY || ""

// Site configuration
export const siteConfig = {
  name: "Tattty",
  description: "Create personalized tattoo designs based on your life story",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://tattty.com",
  ogImage: "https://tattty.com/og.jpg",
  links: {
    twitter: "https://twitter.com/tattty",
    instagram: "https://instagram.com/tattty",
    facebook: "https://facebook.com/tattty",
  },
}

export const pricingConfig = {
  currency: "USD",
  freePreviewSize: 500, // Max size in pixels for free preview
  standardResolution: 1080, // Standard resolution in pixels
  premiumResolution: 4000, // Premium resolution in pixels (4K)
}

export const aiConfig = {
  maxQuestions: 4,
  maxRegenerations: 3,
}
