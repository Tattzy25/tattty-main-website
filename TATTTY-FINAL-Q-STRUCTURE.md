# Tattty Final Question (Card 8) Structure - Documentation

## Overview

This document explains the modular structure of the Final Question (Card 8). This is the last card in the questionnaire flow where users can add final details, upload reference images, and receive an AI-generated follow-up question based on their previous responses.

## File Structure

```
data/
  tattty-final-q/
    ├── types.ts           # TypeScript interfaces
    ├── index.ts           # Central export file with helper function
    ├── base-data/
    │   └── index.ts       # Base question data (title, subtitle, description)
    └── config/
        └── index.ts       # Configuration (image upload, AI question settings)
```

## Files Created

### 1. `data/tattty-final-q/types.ts`
- Defines `FinalQuestionData` interface (icon, title, subtitle, description, placeholder, options)
- Defines `FinalQuestionConfig` interface (enableImageUpload, maxImages, enableAIQuestion, fallbackQuestion)

### 2. `data/tattty-final-q/base-data/index.ts`
Contains the base Final Question data:
- Icon: Sparkles
- Title: "ONE LAST THING"
- Subtitle: Fallback question text
- Description: "Your final chance to add context before we create your design"
- Placeholder: "Share your thoughts... (OPTIONAL)"
- Empty options array (no predefined options)

### 3. `data/tattty-final-q/config/index.ts`
Configuration settings:
- `enableImageUpload`: true (allows reference image uploads)
- `maxImages`: 5 (maximum number of uploadable images)
- `enableAIQuestion`: true (generates personalized follow-up question)
- `fallbackQuestion`: Default question if AI generation fails

### 4. `data/tattty-final-q/index.ts`
- Exports `finalQuestionData` from base-data
- Exports `finalQuestionConfig` from config
- Exports both TypeScript types
- Provides `createFinalQuestion()` helper function

## Key Feature: `createFinalQuestion()` Helper

This convenience function dynamically creates the final question data with AI-generated content:

```typescript
export function createFinalQuestion(aiQuestion?: string): FinalQuestionData {
  return {
    ...finalQuestionData,
    subtitle: aiQuestion || finalQuestionData.subtitle
  }
}
```

**Usage**:
- Pass AI-generated question → Uses it as subtitle
- Pass nothing/undefined → Falls back to default subtitle
- Maintains all other data (title, description, icon, etc.)

## Changes to `app/inked/page.tsx`

### Added Import:
```typescript
import { createFinalQuestion, finalQuestionConfig } from "@/data/tattty-final-q"
```

### Removed:
- 8+ lines of hardcoded Card 8 data object
- Direct Sparkles icon usage

### Updated:
```typescript
// Before
const card8Data = {
  icon: Sparkles,
  title: "ONE LAST THING",
  subtitle: aiFollowUpQuestion || "Did you forget anything?...",
  description: "Your final chance...",
  placeholder: "Share your thoughts...",
  options: []
}

// After
const card8Data = createFinalQuestion(aiFollowUpQuestion)
```

### Config Usage:
```typescript
// Check if AI question should be generated
if (isCard8 && !aiFollowUpQuestion && finalQuestionConfig.enableAIQuestion) {
  const question = generateAIFollowUpQuestion(...)
  setAiFollowUpQuestion(question)
}
```

### Result:
`page.tsx` reduced from **524 lines → 516 lines**

## Benefits

✅ **Separation of Concerns**: Final question data separate from UI logic  
✅ **Easy Maintenance**: Update question text without touching page logic  
✅ **Type Safety**: Shared interfaces ensure consistency  
✅ **Configuration**: Enable/disable features via config file  
✅ **Reusability**: Can use final question data in previews, summaries, etc.  
✅ **Flexibility**: Helper function handles AI question injection cleanly  
✅ **Testability**: Easy to test with/without AI questions

## How to Use

### Import and use with AI question:
```typescript
import { createFinalQuestion, finalQuestionConfig } from "@/data/tattty-final-q"

// With AI-generated question
const aiQuestion = "Is there a specific memory you want captured?"
const card8Data = createFinalQuestion(aiQuestion)

// Without AI question (uses fallback)
const card8Data = createFinalQuestion()
```

### Import base data directly:
```typescript
import { finalQuestionData } from "@/data/tattty-final-q"

// Use as-is
console.log(finalQuestionData.title) // "ONE LAST THING"
```

### Import and check config:
```typescript
import { finalQuestionConfig } from "@/data/tattty-final-q"

if (finalQuestionConfig.enableImageUpload) {
  // Show image upload UI
}

if (finalQuestionConfig.enableAIQuestion) {
  // Generate personalized question
}
```

### Import types:
```typescript
import type { FinalQuestionData, FinalQuestionConfig } from "@/data/tattty-final-q"
```

## Configuration Options

You can easily modify behavior by editing `config/index.ts`:

```typescript
export const finalQuestionConfig: FinalQuestionConfig = {
  enableImageUpload: true,        // Toggle image upload feature
  maxImages: 5,                   // Change max upload limit
  enableAIQuestion: true,         // Toggle AI question generation
  fallbackQuestion: "Your text"   // Change default fallback
}
```

## Future Enhancements

The modular structure allows for easy additions:
- ✨ Add multiple fallback questions with rotation
- ✨ Add category-specific final questions
- ✨ Add validation rules for image uploads
- ✨ Add user preference for skipping final question
- ✨ Add analytics tracking for question engagement
- ✨ Create reusable FinalQuestionCard component

## Why "tattty-final-q"?

**Descriptive**: Clearly indicates this is the final question  
**Consistent**: Matches naming pattern with `tattty-qs`  
**Reusable**: Can be used in:
- Questionnaire flows
- Progress indicators
- Summary views
- Edit/review screens

---

**Date**: October 4, 2025  
**Status**: ✅ Complete
