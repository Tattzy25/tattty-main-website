/**
 * Tattty Final Question (Card 8) Data
 * Contains the final question/summary card configuration
 */

export { finalQuestionData } from './base-data'
export { finalQuestionConfig } from './config'
export type { FinalQuestionData, FinalQuestionConfig } from './types'

// Convenience function to create Card 8 data with AI question
import type { FinalQuestionData } from './types'
import { finalQuestionData } from './base-data'

export function createFinalQuestion(aiQuestion?: string): FinalQuestionData {
  return {
    ...finalQuestionData,
    subtitle: aiQuestion || finalQuestionData.subtitle
  }
}
