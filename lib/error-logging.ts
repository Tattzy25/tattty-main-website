/**
 * Error Logging System for Tattty
 * Logs all errors to console and (future) external service
 * NO FALLBACKS - Errors are logged and re-thrown
 */

export interface ErrorLog {
  timestamp: string
  errorType: 'AI_GENERATION' | 'API_CALL' | 'DATABASE' | 'VALIDATION' | 'STYLE_TRANSFER' | 'UNKNOWN'
  message: string
  stack?: string
  context?: Record<string, any>
  userId?: string
  sessionId?: string
}

/**
 * Log error with full context
 * @throws Re-throws the error after logging
 */
export function logError(
  error: Error | unknown,
  errorType: ErrorLog['errorType'],
  context?: Record<string, any>
): never {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    errorType,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    // TODO: Add actual user/session tracking
    userId: 'dev-user',
    sessionId: generateSessionId(),
  }

  // Console logging with emoji indicators
  console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ ERROR LOGGED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕒 Time: ${errorLog.timestamp}
🏷️  Type: ${errorLog.errorType}
💬 Message: ${errorLog.message}
📍 Context: ${JSON.stringify(errorLog.context, null, 2)}
📚 Stack: ${errorLog.stack}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)

  // TODO: Send to external logging service (Sentry, LogRocket, etc.)
  // await sendToLoggingService(errorLog)

  // Re-throw the error - NO FALLBACKS
  throw error
}

/**
 * Generate session ID for error tracking
 */
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(7)}`
}

/**
 * User-friendly error messages (what we show to users)
 * Technical details stay in logs
 */
export const FRIENDLY_ERROR_MESSAGES = {
  AI_GENERATION: "We're having trouble creating your design right now. Please try again.",
  API_CALL: "Something went wrong connecting to our services. Please try again.",
  DATABASE: "We're having trouble accessing your information. Please try again.",
  VALIDATION: "Please check your answers and try again.",
  STYLE_TRANSFER: "We're having trouble applying the style to your design. Please try again.",
  UNKNOWN: "Something unexpected happened. Please try again.",
} as const

/**
 * Get user-friendly error message
 */
export function getFriendlyErrorMessage(errorType: ErrorLog['errorType']): string {
  return FRIENDLY_ERROR_MESSAGES[errorType]
}
