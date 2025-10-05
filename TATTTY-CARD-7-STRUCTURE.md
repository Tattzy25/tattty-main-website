# Tattty Card 7 & InkSpecs Structure - Documentation

## Overview

This document explains the modular structure of Card 7 (Visual Selection) and the reusable InkSpecs system. Card 7 handles visual vibe selection with ink specifications (Style, Color, Size, Placement) that can be used throughout the app.

## File Structure

```
data/
  tattty-card-7/
    ├── types.ts           # TypeScript interfaces
    ├── index.ts           # Central export file
    ├── visual-data/
    │   └── index.ts       # Main card data (title, subtitle, style options)
    └── ink-specs/         # Reusable ink specifications
        ├── types.ts       # CategoryData interface
        ├── index.ts       # InkSpecs exports and collections
        ├── style/
        │   └── index.ts   # Style spec data (styleSpec)
        ├── color/
        │   └── index.ts   # Color spec data (colorSpec)
        ├── size/
        │   └── index.ts   # Size spec data (sizeSpec)
        └── placement/
            └── index.ts   # Placement spec data (placementSpec)

components/
  ink-specs-block/         # Reusable InkSpecs component
    ├── types.ts           # Component prop types
    ├── InkSpecsBlock.tsx  # Main component
    ├── index.ts           # Exports
    └── README.md          # Component documentation
```

## Files Created

### 1. `data/tattty-card-7/types.ts`
- Defines `Card7Data` interface (title, subtitle, description, placeholder, options)
- Defines `Card7Category` interface (id, name, label)
- Defines `CategoryData` interface extending Card7Category (adds labels array)

### 2. `data/tattty-card-7/visual-data/index.ts`
Contains the main Card 7 data:
- Title: "Pick Your Vibes"
- Subtitle: "Pick your visual vibe"
- Style options array (Traditional, Realism, Watercolor, etc.)

### 3. `data/tattty-card-7/ink-specs/` (4 separate spec folders)

#### 3a. `ink-specs/style/index.ts`
- Exports `styleSpec`
- Labels: Traditional, Realism, Tribal, Japanese, Watercolor, Geometric, Minimalist, Neo-Traditional

#### 3b. `ink-specs/color/index.ts`
- Exports `colorSpec`
- Labels: Black & Grey, Full Color, Pastel, Vibrant, Monochrome, Earth Tones, Neon, Muted

#### 3c. `ink-specs/size/index.ts`
- Exports `sizeSpec`
- Labels: Small, Medium, Large, Sleeve, Half Sleeve, Full Back, Tiny, XL

#### 3d. `ink-specs/placement/index.ts`
- Exports `placementSpec`
- Labels: Arm, Leg, Back, Chest, Shoulder, Wrist, Neck, Ribs

### 4. `data/tattty-card-7/ink-specs/index.ts`
- Exports all 4 individual specs
- Exports `card7Categories` array (legacy compatibility)
- Exports `allInkSpecs` object for easy access
- Exports `inkSpecsArray` for iteration
- Exports CategoryData type

### 5. `components/ink-specs-block/` (Reusable Component)
- **InkSpecsBlock.tsx**: Flexible component for displaying ink specs
- **types.ts**: InkSpec and InkSpecsBlockProps interfaces
- **README.md**: Full component documentation with examples
- **Features**:
  - Layout-agnostic (works anywhere)
  - Multiple variants (default, compact, grid)
  - Optional selection handling
  - Fully typed with TypeScript

## Changes to `app/inked/page.tsx`

### Added Import:
```typescript
import { card7Data, card7Categories, allInkSpecs } from "@/data/tattty-card-7"
```

### Removed:
- 35+ lines of hardcoded Card 7 data and categories
- Hardcoded label arrays (styleLabels, colorLabels, sizeLabels, placementLabels)

### Updated:
- Image loading now uses `allInkSpecs.style.labels`, `allInkSpecs.color.labels`, etc.
- Renamed from "categories" to "ink-specs" for broader reusability
- Created reusable `InkSpecsBlock` component

### Result:
`page.tsx` remains clean at **~518 lines**

## Benefits

✅ **Separation of Concerns**: Visual selection data is separate from UI logic  
✅ **Easy Maintenance**: Update specs or options without touching page logic  
✅ **Type Safety**: Shared interfaces ensure consistency  
✅ **Scalability**: Add new specs or options in dedicated files  
✅ **Reusability**: InkSpecs can be used anywhere - pricing, galleries, filters, etc.  
✅ **Organization**: Each spec in its own folder with clear naming  
✅ **Component-based**: InkSpecsBlock component works across any layout  
✅ **Flexible**: Multiple display variants (default, compact, grid)

## How to Use

### Import all Card 7 data:
```typescript
import { card7Data, card7Categories, allInkSpecs } from "@/data/tattty-card-7"
```

### Import specific specs:
```typescript
import { styleSpec, colorSpec } from "@/data/tattty-card-7"
```

### Import individual spec from folder:
```typescript
import { styleSpec } from "@/data/tattty-card-7/ink-specs/style"
```

### Access spec labels:
```typescript
// Using allInkSpecs object
const styleLabels = allInkSpecs.style.labels

// Using individual imports
import { styleSpec } from "@/data/tattty-card-7"
const labels = styleSpec.labels
```

### Use InkSpecsBlock component:
```typescript
import { InkSpecsBlock } from "@/components/ink-specs-block"
import { inkSpecsArray } from "@/data/tattty-card-7"

// Simple display
<InkSpecsBlock specs={inkSpecsArray} />

// With selection handling
<InkSpecsBlock 
  specs={inkSpecsArray}
  selectedSpecs={selectedSpecs}
  onSpecChange={(specId, value) => handleSelection(specId, value)}
  variant="grid"
/>
```

### Import types:
```typescript
import type { Card7Data, Card7Category, CategoryData } from "@/data/tattty-card-7"
import type { InkSpec, InkSpecsBlockProps } from "@/components/ink-specs-block"
```

## Future Enhancements

The modular structure allows for easy additions:
- ✨ Add images for each style option in spec folders
- ✨ Add validation rules for each spec
- ✨ Add dynamic spec loading from API
- ✨ Add localization files for multi-language support
- ✨ Use InkSpecsBlock in pricing page, inspiration gallery, filters
- ✨ Create InkSpecsFilter variant for search/filtering
- ✨ Add animations and transitions to InkSpecsBlock

## Why "InkSpecs"?

**Broad & Reusable**: Not tied to "Card 7" or any specific page  
**Descriptive**: Clearly indicates tattoo specifications  
**Scalable**: Can be used in:
- Questionnaire flows
- Pricing calculators
- Inspiration galleries
- Search filters
- Artist portfolios
- Booking forms

---

**Date**: October 4, 2025  
**Status**: ✅ Complete - Ready for reuse across the app
