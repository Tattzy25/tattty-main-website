/**
 * Animation timing constants (in milliseconds)
 * Used across the application for consistent animation durations
 */
export const ANIMATION_TIMING = {
  FADE_OUT: 300,           // Content fade out duration
  FADE_IN_DELAY: 50,       // Delay before fade in starts
  WELCOME_TRANSITION: 1000, // Welcome screen dismiss duration
  MESSAGE_SLIDE: 500,      // Sent message slide-in animation
  CAROUSEL_DELAY: 300      // Carousel appear/disappear delay
} as const

/**
 * Type for animation timing keys
 */
export type AnimationTimingKey = keyof typeof ANIMATION_TIMING
