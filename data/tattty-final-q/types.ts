import type { LucideIcon } from "lucide-react"

export interface FinalQuestionData {
  icon: LucideIcon
  title: string
  subtitle: string
  description: string
  placeholder: string
  options: string[]
}

export interface FinalQuestionConfig {
  enableImageUpload: boolean
  maxImages: number
  enableAIQuestion: boolean
  fallbackQuestion: string
}
