/**
 * Question Cards Data
 * Each question is in its own folder for easy management
 */

export { question1 } from './tattty-q-1'
export { question2 } from './tattty-q-2'
export { question3 } from './tattty-q-3'
export { question4 } from './tattty-q-4'
export { question5 } from './tattty-q-5'
export { question6 } from './tattty-q-6'
export type { QuestionCard } from './types'

// Combined array export for convenience
import { question1 } from './tattty-q-1'
import { question2 } from './tattty-q-2'
import { question3 } from './tattty-q-3'
import { question4 } from './tattty-q-4'
import { question5 } from './tattty-q-5'
import { question6 } from './tattty-q-6'

export const allQuestions = [
  question1,
  question2,
  question3,
  question4,
  question5,
  question6
]
