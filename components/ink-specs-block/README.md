# InkSpecsBlock Component

## Overview
A reusable, flexible component for displaying ink specifications (Style, Color, Size, Placement). Designed to be layout-agnostic and can be dropped anywhere in the application.

## Features
✅ **Reusable**: Use across any page or component  
✅ **Flexible**: Multiple variants (default, compact, grid)  
✅ **Type-safe**: Full TypeScript support  
✅ **Interactive**: Optional selection handling  
✅ **Layout-agnostic**: Adapts to any container  

## Usage

### Basic Display
```tsx
import { InkSpecsBlock } from '@/components/ink-specs-block'
import { allInkSpecs } from '@/data/tattty-card-7'

<InkSpecsBlock specs={Object.values(allInkSpecs)} />
```

### With Selection Handling
```tsx
<InkSpecsBlock 
  specs={inkSpecsArray}
  selectedSpecs={selectedSpecs}
  onSpecChange={(specId, value) => {
    console.log(`${specId} selected: ${value}`)
  }}
/>
```

### Different Variants
```tsx
// Default spacing
<InkSpecsBlock specs={specs} variant="default" />

// Compact spacing
<InkSpecsBlock specs={specs} variant="compact" />

// Grid layout (2 columns on desktop)
<InkSpecsBlock specs={specs} variant="grid" />
```

### Custom Styling
```tsx
<InkSpecsBlock 
  specs={specs}
  className="my-8 p-4 bg-black/50 rounded-xl"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `specs` | `InkSpec[]` | required | Array of ink specifications |
| `selectedSpecs` | `{ [key: string]: any[] }` | `{}` | Currently selected specs |
| `onSpecChange` | `(specId: string, value: any) => void` | undefined | Selection handler |
| `className` | `string` | `''` | Additional CSS classes |
| `variant` | `'default' \| 'compact' \| 'grid'` | `'default'` | Layout variant |

## Types

### InkSpec
```typescript
interface InkSpec {
  id: string          // 'style', 'color', 'size', 'placement'
  name: string        // Display name
  label: string       // Label for UI
  labels: string[]    // Available options
}
```

## Examples

### In a Card
```tsx
<GlassCard>
  <GlassCardHeader>
    <h2>Choose Your Specs</h2>
  </GlassCardHeader>
  <GlassCardContent>
    <InkSpecsBlock specs={allInkSpecs} variant="compact" />
  </GlassCardContent>
</GlassCard>
```

### In a Modal/Dialog
```tsx
<Dialog>
  <DialogContent>
    <DialogTitle>Ink Specifications</DialogTitle>
    <InkSpecsBlock 
      specs={inkSpecsArray}
      variant="grid"
      className="max-h-[500px] overflow-y-auto"
    />
  </DialogContent>
</Dialog>
```

### In a Sidebar
```tsx
<aside className="sidebar">
  <InkSpecsBlock 
    specs={[styleSpec, colorSpec]}
    variant="compact"
  />
</aside>
```

## Why "InkSpecs"?
- **Broad enough**: Not tied to "Card 7" or any specific page
- **Descriptive**: Clearly indicates tattoo specifications
- **Reusable**: Can be used in pricing pages, galleries, filters, etc.
- **Scalable**: Easy to extend with new spec types

---

**Created**: October 4, 2025  
**Status**: ✅ Ready for use across the app
