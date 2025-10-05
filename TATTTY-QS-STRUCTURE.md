# Tattty Q's Structure - Documentation

## Overview

This document explains the modular structure of the Tattty questionnaire system. Each question (Q1-Q6) is organized in its own dedicated folder for maximum maintainability and scalability.

## What Was Done

Successfully extracted all 6 question cards from `app/inked/page.tsx` into separate, modular files.

## New File Structure

```
data/
  tattty-qs/
    ├── types.ts           # TypeScript interface for QuestionCard
    ├── index.ts           # Central export file with allQuestions array
    ├── tattty-q-1/
    │   └── index.ts       # Q1: "What ACTUAL things, places, or people define you?"
    ├── tattty-q-2/
    │   └── index.ts       # Q2: "What moment or achievement are you most proud of?"
    ├── tattty-q-3/
    │   └── index.ts       # Q3: "Where do you feel most yourself?"
    ├── tattty-q-4/
    │   └── index.ts       # Q4: "Who shaped who you are today?"
    ├── tattty-q-5/
    │   └── index.ts       # Q5: "What date or time period changed everything?"
    └── tattty-q-6/
        └── index.ts       # Q6: "What symbol or image represents your journey?"
```

## Files Created

### 1. `data/tattty-qs/types.ts`
- Defines `QuestionCard` interface
- Contains icon, title, subtitle, description, placeholder, and options

### 2. Individual Question Folders (tattty-q-1 through tattty-q-6)
Each folder contains an `index.ts` file with:
- Import for its specific Lucide icon
- Export of its question data object (question1, question2, etc.)
- All options/badges for that question
- Type import from parent `../types`

### 3. `data/tattty-qs/index.ts`
- Exports all individual questions from their respective folders
- Exports the QuestionCard type
- Provides `allQuestions` array combining all 6 questions

## Changes to `app/inked/page.tsx`

### Added Import:
```typescript
import { allQuestions } from "@/data/tattty-qs"
```

### Removed:
- 150+ lines of hardcoded `cardData` array
- Unused icon imports (Heart, MapPin, Users, Calendar, Building) - now in individual question files

### Simplified:
```typescript
const cardData = allQuestions
```

## Benefits

✅ **Separation of Concerns**: Questions are data, not UI logic
✅ **Easy Maintenance**: Edit one question without touching others - each has its own folder
✅ **Type Safety**: Shared QuestionCard interface ensures consistency
✅ **Scalability**: Add/remove questions by editing simple files
✅ **Reusability**: Questions can be imported anywhere in the app
✅ **Cleaner Code**: page.tsx reduced from 684 to 559 lines
✅ **Organization**: Each question in dedicated folder (tattty-q-1, tattty-q-2, etc.)
✅ **Modularity**: Can add assets, tests, or related files to each question folder

## How to Use

### Import all questions:
```typescript
import { allQuestions } from "@/data/tattty-qs"
```

### Import specific questions:
```typescript
import { question1, question3 } from "@/data/tattty-qs"
```

### Import directly from question folder:
```typescript
import { question1 } from "@/data/tattty-qs/tattty-q-1"
```

### Import type:
```typescript
import type { QuestionCard } from "@/data/tattty-qs"
```

## Next Steps

The same pattern can be applied to:
- Card 7 data (visual selection categories)
- Card 8 data (AI follow-up question template)
- Any other hardcoded configuration data

---

**Date**: October 4, 2025
**Status**: ✅ Complete
