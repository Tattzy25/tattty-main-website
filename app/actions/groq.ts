"use server"

/**
 * Server Actions for Groq AI
 * All Groq API calls MUST happen server-side only
 */

import { generateFollowUpQuestion, generateFinalPrompts } from "@/lib/ai-logic/groq-client"
import type { UserAnswers, FinalPromptResponse } from "@/lib/ai-logic/groq-prompts"
import { logError } from "@/lib/error-logging"

/**
 * Server action: Generate AI follow-up question
 * Called from client after Cards 1-7 are completed
 */
export async function generateFollowUpQuestionAction(
  answers: UserAnswers
): Promise<{ success: true; question: string } | { success: false; error: string }> {
  try {
    console.log("🔄 [SERVER ACTION] Generating follow-up question...")
    
    const question = await generateFollowUpQuestion(answers)
    
    console.log("✅ [SERVER ACTION] Follow-up question generated")
    return { success: true, question }
    
  } catch (err) {
    const error = err as Error
    console.error("❌ [SERVER ACTION] Failed to generate follow-up:", error)
    
    logError(error, "AI_GENERATION", {
      operation: "generateFollowUpQuestion",
      answers: JSON.stringify(answers)
    })
    
    return {
      success: false,
      error: error.message || "Failed to generate follow-up question"
    }
  }
}

/**
 * Server action: Generate final prompts for image generation
 * Called when user clicks "Generate" button
 */
export async function generateFinalPromptsAction(
  answers: UserAnswers
): Promise<{ success: true; prompts: FinalPromptResponse } | { success: false; error: string }> {
  try {
    console.log("🔄 [SERVER ACTION] Generating final prompts...")
    
    const prompts = await generateFinalPrompts(answers)
    
    console.log("✅ [SERVER ACTION] Final prompts generated")
    return { success: true, prompts }
    
  } catch (err) {
    const error = err as Error
    console.error("❌ [SERVER ACTION] Failed to generate prompts:", error)
    
    logError(error, "AI_GENERATION", {
      operation: "generateFinalPrompts",
      answers: JSON.stringify(answers)
    })
    
    return {
      success: false,
      error: error.message || "Failed to generate prompts"
    }
  }
}
