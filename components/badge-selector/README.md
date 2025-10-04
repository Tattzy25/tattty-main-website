# BadgeSelector Component

## Overview
A reusable component for displaying selectable badge options with visual feedback. Used across multiple questionnaire flows.

## Usage

```tsx
import { BadgeSelector } from '@/components/badge-selector';

// In your component
const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

const handleOptionClick = (option: string, index: number) => {
  setSelectedOptions(prev => 
    prev.includes(index) 
      ? prev.filter(i => i !== index) 
      : [...prev, index]
  );
  // Add the option text to your response or perform other actions
};

<BadgeSelector
  options={['Option 1', 'Option 2', 'Option 3']}
  selectedIndices={selectedOptions}
  onOptionClick={handleOptionClick}
  label="Select all that apply:"
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | `string[]` | ✅ Yes | - | Array of option labels to display as badges |
| `selectedIndices` | `number[]` | ✅ Yes | - | Array of currently selected option indices |
| `onOptionClick` | `(option: string, index: number) => void` | ✅ Yes | - | Callback when a badge is clicked |
| `label` | `string` | No | "Select all that apply:" | Label text above the badges |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline'` | No | `'secondary'` | Badge variant style |
| `className` | `string` | No | `''` | Additional CSS classes for the container |

## Features

- **Visual Feedback**: Selected badges show orange glow (`bg-orange-500/30`)
- **Responsive**: Adapts text size for mobile (`text-xs`) and desktop (`text-sm`)
- **Animations**: Hover scale effect and smooth transitions
- **Auto-wrap**: Badges wrap to multiple lines on smaller screens
- **Null-safe**: Returns `null` if no options provided

## Example Use Cases

### 1. Multiple Choice Questions
```tsx
<BadgeSelector
  options={["My mother", "A phoenix rising", "Strength", "Freedom"]}
  selectedIndices={selectedOptions}
  onOptionClick={handleOptionClick}
/>
```

### 2. Style Preferences
```tsx
<BadgeSelector
  options={["Traditional", "Realistic", "Minimalist", "Watercolor"]}
  selectedIndices={selectedStyles}
  onOptionClick={(option, index) => {
    setSelectedStyles([...selectedStyles, index]);
    updateUserPreferences(option);
  }}
  label="Choose your preferred styles:"
/>
```

### 3. Size Selection
```tsx
<BadgeSelector
  options={["Small", "Medium", "Large", "Extra Large"]}
  selectedIndices={selectedSize}
  onOptionClick={handleSizeSelection}
  label="How big should it be?"
  variant="outline"
/>
```

## State Management Pattern

```tsx
// Typical state setup for badge selection
const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
const [response, setResponse] = useState<string>('');

const handleOptionClick = (option: string, index: number) => {
  // Toggle selection
  setSelectedOptions(prev => 
    prev.includes(index) 
      ? prev.filter(i => i !== index) 
      : [...prev, index]
  );
  
  // Add option to response text (optional)
  setResponse(prev => {
    const current = prev.trim();
    if (!current) return option;
    return selectedOptions.includes(index)
      ? current.replace(new RegExp(`\\b${option}\\b,?\\s*`, 'g'), '').trim()
      : `${current}, ${option}`;
  });
};

// Reset between questions
const resetSelection = () => {
  setSelectedOptions([]);
  setResponse('');
};
```

## Styling

The component uses:
- **Selected state**: Orange glow with semi-transparent background
- **Hover state**: Lighter orange tint on hover
- **Animation**: Scale transform on hover (1.05x)
- **Spacing**: Responsive gaps (1.5 on mobile, 2 on desktop)
- **Shape**: Rounded corners (`rounded-2xl`)

## Where It's Used

- ✅ `/inked` - Questions 1-6 (tattoo questionnaire)
- 🔄 `/inspiration` - (planned)
- 🔄 `/pricing` - (planned)
- 🔄 Other feature pages - (planned)

## Files

- **Component**: `components/badge-selector/BadgeSelector.tsx`
- **Export**: `components/badge-selector/index.ts`
- **Used in**: `components/chat-box/ChatBox.tsx`
