# States Components

This folder contains state-based UI components for the tattoo design flow.

## StateCard

An animated, neon-styled loading card component that displays on desktop (hidden on mobile) with the TaTTTy branding and dynamic visual effects.

### Features
- **Animated Neon Sign**: Flickering "TaTTTy" text with neon glow effects
- **Moving Dot with Trailing Stars**: Animated dot that travels around the card border with sparkling trail effects
- **SVG Drawing Lines**: Decorative animated lines that draw and fade in a loop
- **Dynamic Hint Text**: Rotating messages like "PREPARING YOUR CANVAS...", "MIXING THE COLORS...", etc.
- **12 Sparkle Elements**: Positioned sparkles that pulse at different intervals
- **Responsive**: Hidden on mobile, displays on desktop (lg breakpoint)
- **Custom Typography**: Uses "Rock Salt" Google Font for the neon sign

### Usage

```tsx
import { StateCard } from "@/components/states"

// Basic usage with defaults
<StateCard />

// Custom usage with props
<StateCard 
  title="Loading..."
  hints={['CUSTOM MESSAGE 1...', 'CUSTOM MESSAGE 2...']}
  hintInterval={5000}
  showSparkles={false}
  showLines={true}
  showTrails={true}
  className="custom-class"
/>
```

### Props

- `className` (optional): Additional CSS classes to apply to the outer wrapper
- `hints` (optional): Custom array of hint messages to display. Defaults to tattoo-themed messages
- `title` (optional): Custom title text for the neon sign. Defaults to "TaTTTy"
- `hintInterval` (optional): Milliseconds between hint rotations. Defaults to 3000 (3 seconds)
- `showSparkles` (optional): Toggle sparkle animations on/off. Defaults to `true`
- `showLines` (optional): Toggle decorative border lines on/off. Defaults to `true`
- `showTrails` (optional): Toggle trailing star effect on/off. Defaults to `true`

### Styling

The component uses:
- **Size**: `400px × 300px` card
- **Gradient Border**: Orange to purple gradient (`#ff6b35` to `#9333ea`)
- **Dark Glass Background**: Black background with subtle gradient overlay
- **Neon Colors**: Orange (`#ff6b35`) and purple (`#9333ea`)
- **Animations**:
  - Dot moves around card border (6s loop)
  - Neon text flickers (3s loop)
  - SVG lines draw in/out (8s loop)
  - Sparkles pulse (2s loop with staggered delays)
  - Hint text rotates every 3 seconds
  - Trail stars follow the dot with fade effect

### Customization

The component is now fully reusable with props. You can customize:
1. **Title**: Change the neon sign text via the `title` prop
2. **Hint Messages**: Pass custom hint messages via the `hints` array prop
3. **Animation Speed**: Adjust hint rotation speed with `hintInterval` prop
4. **Visual Elements**: Toggle sparkles, lines, or trails on/off with boolean props
5. **Styling**: Pass a `className` prop for outer wrapper styles
6. **CSS Modifications**: 
   - Adjust animation timings in `StateCard.css`
   - Change the neon colors (orange `#ff6b35` / purple `#9333ea` gradient)
   - Modify the font size of the neon text

### Files

- `StateCard.tsx` - React component with hooks for animation logic
- `StateCard.css` - All animation styles and keyframes
- `index.ts` - Export barrel

### External Dependencies

- Google Fonts: "Rock Salt" font family (loaded via CSS import)
- React hooks: `useState`, `useEffect`, `useRef` for animation control

