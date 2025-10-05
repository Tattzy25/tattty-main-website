/**
 * Session Management API Routes
 * Handles complete user journey tracking
 * NO FALLBACKS - Fails hard on errors
 */

// POST /api/session/start
// Creates new session, returns session token

// POST /api/session/save-answer
// Saves individual question answer
// Body: { sessionToken, questionId, stepNumber, answerText?, selectedOptions? }

// POST /api/session/save-style-selection  
// Saves Card 7 style selection
// Body: { sessionToken, category, optionId, optionName, imageUrl }

// POST /api/session/save-ai-question
// Saves Card 8 AI-generated question
// Body: { sessionToken, aiQuestion }

// POST /api/session/save-ai-answer
// Saves Card 8 user answer to AI question
// Body: { sessionToken, userAnswer }

// POST /api/session/save-upload
// Saves uploaded reference image
// Body: { sessionToken, fileName, fileUrl, fileSize, mimeType }

// GET /api/session/summary/[sessionToken]
// Returns complete user journey summary
// Response: { session, answers, styleSelections, aiQuestion, uploads, summary }

// POST /api/session/complete
// Marks session as completed, generates final summary
// Body: { sessionToken, completePrompt, stylePrompt, userJourney, generationConfig }

// GET /api/session/current/[sessionToken]
// Returns current session state and progress
// Response: { session, currentStep, totalSteps, status }