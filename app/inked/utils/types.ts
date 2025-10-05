/**
 * Inked Page Type Definitions
 * TypeScript types for the questionnaire flow
 */

import type { LucideIcon } from "lucide-react"
import type { ImageObject } from "@/components/image-gallery"

export interface CardDataItem {
  icon: LucideIcon
  title: string
  subtitle: string
  description: string
  placeholder: string
  options: string[]
}

export interface CategoryData {
  id: string
  name: string
  label: string
}

export interface SelectedImagesState {
  [categoryId: string]: ImageObject[]
}

export interface CategoryImagesState {
  [categoryId: string]: ImageObject[]
}

export interface InkedPageState {
  currentStep: number
  showWelcomeOverlay: boolean
  isTransitioning: boolean
  isContentFading: boolean
  responses: string[]
  selectedOptions: number[]
  sentMessages: string[]
  isListening: boolean
  showMessageAnimation: boolean
  selectedImages: SelectedImagesState
  categoryImages: CategoryImagesState
}
