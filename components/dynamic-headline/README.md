# DynamicHeadline Component

A reusable headline component with 3D shadow layers and gradient text effect.

## Features
- 5-layer shadow effect for depth
- Gradient text overlay (red → amber → purple)
- Fade transitions
- Responsive typography
- Custom Audiowide font

## Usage

```tsx
import { DynamicHeadline } from "@/components/dynamic-headline"

<DynamicHeadline 
  title="PICK YOUR VIBES"
  isContentFading={false}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | The headline text to display |
| `isContentFading` | `boolean` | Controls fade-out transition during navigation |

## Styling

The component uses:
- **Font**: Audiowide (sans-serif fallback)
- **Shadow Layers**: 5 black/transparent layers with progressive offsets (3px, 6px, 9px, 12px, 15px)
- **Gradient**: Red (#ef4444) → Amber (#fbbf24) → Purple (#9333ea)
- **Responsive Sizes**:
  - Mobile: `text-4xl` (2.25rem)
  - Tablet: `text-5xl` (3rem)
  - Desktop: `text-7xl` (4.5rem)

## Examples

### Basic Usage
```tsx
<DynamicHeadline 
  title="CREATE YOUR TATTOO"
  isContentFading={false}
/>
```

### With Fade Transition
```tsx
<DynamicHeadline 
  title={currentQuestion.title}
  isContentFading={isNavigating}
/>
```

### Conditional Rendering
```tsx
{showHeadline && (
  <DynamicHeadline 
    title="FINAL REVIEW"
    isContentFading={isFading}
  />
)}
```

## Implementation Details

The component creates a 3D effect by layering multiple `<span>` elements:
1. 5 shadow layers (black → transparent) offset progressively
2. Top gradient layer with `bg-clip-text` for text effect
3. All wrapped in responsive container with padding

## Notes
- The component uses inline styles for the shadow transform effects (required for dynamic positioning)
- Shadow layers use negative z-index to stay behind the text
- Transition duration is 300ms for smooth fading
