import { type ImageObject } from "@/components/image-gallery"

/**
 * Questionnaire Navigation & Validation Utilities
 * 
 * These functions handle validation logic for the tattoo questionnaire flow.
 * Used to determine if users can proceed to the next step based on current card requirements.
 */

export interface ValidationContext {
  currentStep: number
  totalQuestions: number
  sentMessages: string[]
  selectedImages: {[key: string]: ImageObject[]}
}

/**
 * Check if user can proceed to the next step based on current card
 * 
 * @param context - Validation context with current state
 * @returns boolean - true if user can proceed
 */
export function canProceedToNext(context: ValidationContext): boolean {
  const { currentStep, totalQuestions, sentMessages, selectedImages } = context
  
  // Questions 1-6: require sent message
  if (currentStep < totalQuestions) {
    return !!sentMessages[currentStep]
  }
  
  // Card 7 (Visual selection): require minimum 2 images to be selected total
  if (currentStep === totalQuestions) {
    const totalSelectedImages = 
      selectedImages.style.length + 
      selectedImages.color.length + 
      selectedImages.size.length + 
      selectedImages.placement.length
    return totalSelectedImages >= 2
  }
  
  // Card 8 (Final card): optional - user can always proceed (it's the final review)
  if (currentStep === totalQuestions + 1) {
    return true
  }
  
  return false
}

/**
 * Calculate total number of steps in the questionnaire
 * 
 * @param totalQuestions - Number of question cards (1-6)
 * @returns total steps including Card 7 and Card 8
 */
export function calculateTotalSteps(totalQuestions: number): number {
  return totalQuestions + 2 // Questions + Card 7 + Card 8
}

/**
 * Check if current step is a question card (1-6)
 * 
 * @param currentStep - Current step index
 * @param totalQuestions - Total number of question cards
 * @returns boolean
 */
export function isQuestionCard(currentStep: number, totalQuestions: number): boolean {
  return currentStep < totalQuestions
}

/**
 * Check if current step is Card 7 (Visual selection)
 * 
 * @param currentStep - Current step index
 * @param totalQuestions - Total number of question cards
 * @returns boolean
 */
export function isCard7(currentStep: number, totalQuestions: number): boolean {
  return currentStep === totalQuestions
}

/**
 * Check if current step is Card 8 (Final review)
 * 
 * @param currentStep - Current step index
 * @param totalQuestions - Total number of question cards
 * @returns boolean
 */
export function isCard8(currentStep: number, totalQuestions: number): boolean {
  return currentStep === totalQuestions + 1
}

/**
 * Get progress percentage for the questionnaire
 * 
 * @param currentStep - Current step index
 * @param totalQuestions - Total number of question cards
 * @returns percentage (0-100)
 */
export function getProgressPercentage(currentStep: number, totalQuestions: number): number {
  const totalSteps = calculateTotalSteps(totalQuestions)
  return Math.round((currentStep / (totalSteps - 1)) * 100)
}

/**
 * Get current card type name
 * 
 * @param currentStep - Current step index
 * @param totalQuestions - Total number of question cards
 * @returns card type string
 */
export function getCurrentCardType(currentStep: number, totalQuestions: number): string {
  if (isQuestionCard(currentStep, totalQuestions)) {
    return `Question ${currentStep + 1}`
  }
  if (isCard7(currentStep, totalQuestions)) {
    return 'Visual Selection'
  }
  if (isCard8(currentStep, totalQuestions)) {
    return 'Final Review'
  }
  return 'Unknown'
}
