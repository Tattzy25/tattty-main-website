import type { CategoryData } from "./types"

// Import individual ink specs
import { styleSpec } from './style'
import { colorSpec } from './color'
import { sizeSpec } from './size'
import { placementSpec } from './placement'

// Export individual ink specs
export { styleSpec } from './style'
export { colorSpec } from './color'
export { sizeSpec } from './size'
export { placementSpec } from './placement'
export type { CategoryData } from './types'

// Legacy export for backwards compatibility
export const card7Categories = [
  styleSpec,
  colorSpec,
  sizeSpec,
  placementSpec
]

// Export all ink specs as an object for easy access
export const allInkSpecs = {
  style: styleSpec,
  color: colorSpec,
  size: sizeSpec,
  placement: placementSpec
}

// Array of all specs for iteration
export const inkSpecsArray = [
  styleSpec,
  colorSpec,
  sizeSpec,
  placementSpec
]
