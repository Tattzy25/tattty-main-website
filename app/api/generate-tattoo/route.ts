import { NextResponse } from "next/server"
import { enhancePrompt } from "@/lib/groq-ai"
import { generateImage } from "@/lib/stability-ai"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { answers, style, colorPalette, size, placement } = body

    // Create initial prompt
    const initialPrompt = `Create a ${style} tattoo design with a ${colorPalette} color palette, suitable for ${size} on the ${placement}. The design should represent: ${answers.join(". ")}. Make it detailed, artistic, and suitable for a real tattoo.`

    console.log("Initial prompt:", initialPrompt)

    // Step 1: Enhance prompt with GROQ
    const promptResult = await enhancePrompt(initialPrompt)
    if (!promptResult.success) {
      console.error("Failed to enhance prompt:", promptResult.error)
      // Continue with original prompt if enhancement fails
      const finalPrompt = initialPrompt

      // Step 2: Generate image with Stability
      const imageResult = await generateImage(finalPrompt)
      if (!imageResult.success) {
        throw new Error(imageResult.error || "Failed to generate image")
      }

      // Return results
      return NextResponse.json({
        success: true,
        imageData: imageResult.imageData,
        prompt: finalPrompt,
      })
    } else {
      const finalPrompt = promptResult.enhancedPrompt || initialPrompt
      console.log("Enhanced prompt:", finalPrompt)

      // Step 2: Generate image with Stability
      const imageResult = await generateImage(finalPrompt)
      if (!imageResult.success) {
        throw new Error(imageResult.error || "Failed to generate image")
      }

      // Return results
      return NextResponse.json({
        success: true,
        imageData: imageResult.imageData,
        prompt: finalPrompt,
      })
    }
  } catch (error: any) {
    console.error("Error in tattoo generation pipeline:", error)
    return NextResponse.json({ error: error.message || "Failed to generate tattoo design" }, { status: 500 })
  }
}
