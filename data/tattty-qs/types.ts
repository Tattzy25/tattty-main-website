import type { LucideIcon } from "lucide-react"

export interface QuestionCard {
  icon: LucideIcon
  title: string
  subtitle: string
  description: string
  placeholder: string
  options: string[]
}
