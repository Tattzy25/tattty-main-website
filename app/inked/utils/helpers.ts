/**
 * Inked Page Helper Functions
 * Utility functions for the tattoo design questionnaire flow
 */

import { CARD_DATA } from "./constants"
import type { ImageObject } from "@/components/image-gallery"

/**
 * Check if the current step is Card 7 (visual selection)
 */
export function isCard7(currentStep: number): boolean {
  return currentStep === CARD_DATA.length
}

/**
 * Check if the current step is Card 8 (AI follow-up)
 */
export function isCard8(currentStep: number): boolean {
  return currentStep === CARD_DATA.length + 1
}

/**
 * Check if the current step is Card 9 (final)
 */
export function isCard9(currentStep: number): boolean {
  return currentStep === CARD_DATA.length + 2
}

/**
 * Validate if user can proceed to next step
 * @param currentStep - Current question/card index
 * @param sentMessages - Array of sent message flags
 * @param selectedImages - Selected images for Card 7 categories
 * @returns boolean - Whether user can proceed
 */
export function canProceedToNext(
  currentStep: number,
  sentMessages: string[],
  selectedImages: { [key: string]: ImageObject[] }
): boolean {
  // Questions 1-6: require sent message
  if (currentStep < CARD_DATA.length) {
    return !!sentMessages[currentStep]
  }
  
  // Card 7: require Style AND Color to be selected
  if (isCard7(currentStep)) {
    return selectedImages.style.length > 0 && selectedImages.color.length > 0
  }
  
  // Card 8+: require sent message
  return !!sentMessages[currentStep]
}

/**
 * Convert string URLs to ImageObjects with labels
 * @param urls - Array of image URLs
 * @param labels - Array of labels to cycle through
 * @returns Array of ImageObjects
 */
export function createImageObjects(urls: string[], labels: string[]): ImageObject[] {
  return urls.map((url, index) => ({
    url,
    label: labels[index % labels.length] // Cycle through labels
  }))
}

/**
 * Get the current card data based on step
 */
export function getCurrentCardData(currentStep: number) {
  if (currentStep < CARD_DATA.length) {
    return CARD_DATA[currentStep]
  }
  return null
}

/**
 * Calculate total number of steps in the questionnaire
 * @returns Total number of steps
 */
export function getTotalSteps(): number {
  return CARD_DATA.length + 3 // Text cards + Card 7, 8, 9
}

/**
 * Format card title for display (remove underscores, proper case)
 * @param title - Raw title string
 * @returns Formatted title
 */
export function formatCardTitle(title: string): string {
  return title.replace(/_/g, ' ')
}

/**
 * Check if user has completed all required fields for current step
 * @param currentStep - Current step index
 * @param responses - User text responses
 * @param selectedOptions - Selected badge options
 * @param sentMessages - Sent message flags
 * @param selectedImages - Selected images for Card 7
 * @returns boolean - Whether current step is complete
 */
export function isStepComplete(
  currentStep: number,
  responses: string[],
  selectedOptions: number[],
  sentMessages: string[],
  selectedImages: { [key: string]: ImageObject[] }
): boolean {
  if (isCard7(currentStep)) {
    return selectedImages.style.length > 0 && selectedImages.color.length > 0
  }
  
  return !!sentMessages[currentStep]
}

/**
 * Get progress percentage
 * @param currentStep - Current step index
 * @returns Progress percentage (0-100)
 */
export function getProgressPercentage(currentStep: number): number {
  const total = getTotalSteps()
  return Math.round((currentStep / total) * 100)
}
