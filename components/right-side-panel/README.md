# RightSidePanel Component

A dynamic panel component that conditionally renders different content based on the current questionnaire card.

## Purpose

This component encapsulates the logic for displaying the right-side content in the tattoo questionnaire flow:
- **Questions 1-6**: Animated StateCard
- **Card 7**: Image galleries for visual selection (style, color, size, placement)
- **Card 8**: Summary display of all user selections

## Usage

```tsx
import { RightSidePanel } from "@/components/right-side-panel"

<RightSidePanel
  isCard7={currentStep === 6}
  isCard8={currentStep === 7}
  card7Categories={categories}
  categoryImages={images}
  selectedImages={selections}
  onImageSelect={handleSelect}
  sentMessages={messages}
  cardData={questions}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `isCard7` | `boolean` | Whether currently on Card 7 (visual selection) |
| `isCard8` | `boolean` | Whether currently on Card 8 (final review) |
| `card7Categories` | `Card7Category[]` | Categories for Card 7 galleries |
| `categoryImages` | `{[key: string]: ImageObject[]}` | Images for each category |
| `selectedImages` | `{[key: string]: ImageObject[]}` | Currently selected images |
| `onImageSelect` | `(category: string, image: ImageObject) => void` | Handler for image selection |
| `sentMessages` | `string[]` | User responses for summary display |
| `cardData` | `QuestionCard[]` | Question data for summary display |

## Conditional Rendering Logic

```tsx
if (isCard7) {
  // Show image galleries for all categories
  return <ImageGalleries ... />
}

if (isCard8) {
  // Show summary of all selections
  return <SummaryDisplay ... />
}

// Default: Show animated state card (Questions 1-6)
return <StateCard />
```

## Examples

### Basic Usage
```tsx
<RightSidePanel
  isCard7={false}
  isCard8={false}
  card7Categories={[]}
  categoryImages={{}}
  selectedImages={{}}
  onImageSelect={() => {}}
  sentMessages={[]}
  cardData={[]}
/>
// Renders: StateCard (default)
```

### Card 7 (Visual Selection)
```tsx
<RightSidePanel
  isCard7={true}
  isCard8={false}
  card7Categories={[
    { id: 'style', label: 'Style' },
    { id: 'color', label: 'Color' },
  ]}
  categoryImages={{
    style: [img1, img2, img3],
    color: [img4, img5, img6],
  }}
  selectedImages={{
    style: [img1],
    color: [],
  }}
  onImageSelect={(cat, img) => console.log(cat, img)}
  sentMessages={[]}
  cardData={[]}
/>
// Renders: Multiple ImageGallery components
```

### Card 8 (Final Review)
```tsx
<RightSidePanel
  isCard7={false}
  isCard8={true}
  card7Categories={[]}
  categoryImages={{}}
  selectedImages={{
    style: [img1],
    color: [img2],
  }}
  onImageSelect={() => {}}
  sentMessages={["msg1", "msg2", "msg3"]}
  cardData={questions}
/>
// Renders: SummaryDisplay component
```

## Styling

### Card 7 Container
```css
w-full lg:w-[45%]       /* Responsive width */
flex flex-col gap-6     /* Vertical layout with gaps */
p-4 pt-32              /* Padding with extra top */
overflow-y-auto        /* Scrollable */
max-h-screen           /* Limited height */
hide-scrollbar         /* Custom class to hide scrollbar */
```

### Card 8 Container
```css
w-full lg:w-[45%]      /* Same responsive width */
flex flex-col          /* Vertical layout */
p-4 pt-20 lg:pt-4     /* Responsive padding */
overflow-y-auto       /* Scrollable */
max-h-screen          /* Limited height */
hide-scrollbar        /* Hidden scrollbar */
```

## Component Dependencies

- `StateCard` - Animated card for Questions 1-6
- `ImageGallery` - Gallery for Card 7 categories
- `SummaryDisplay` - Summary for Card 8
- Types from `@/data/tattty-qs/types` and `@/data/tattty-card-7/types`

## Benefits

### Encapsulation
- Conditional rendering logic isolated in one place
- Easier to understand and maintain
- Clear component responsibility

### Reusability
- Can be used in other questionnaire flows
- Easy to test independently
- Props interface is flexible

### Maintainability
- Adding new card types is straightforward
- Modifying panel behavior doesn't affect page.tsx
- Clear separation of concerns

## Future Enhancements

### Add Card 9
```tsx
if (isCard9) {
  return <AnotherPanel ... />
}
```

### Add Loading States
```tsx
if (isLoading) {
  return <Skeleton />
}
```

### Add Error States
```tsx
if (hasError) {
  return <ErrorDisplay error={error} />
}
```

## Testing

```tsx
import { render } from '@testing-library/react'
import { RightSidePanel } from './RightSidePanel'

describe('RightSidePanel', () => {
  it('renders StateCard by default', () => {
    const { container } = render(
      <RightSidePanel
        isCard7={false}
        isCard8={false}
        {...defaultProps}
      />
    )
    expect(container.querySelector('.state-card')).toBeInTheDocument()
  })

  it('renders image galleries on Card 7', () => {
    const { getAllByRole } = render(
      <RightSidePanel
        isCard7={true}
        isCard8={false}
        card7Categories={mockCategories}
        {...otherProps}
      />
    )
    expect(getAllByRole('img')).toHaveLength(mockCategories.length * 8)
  })

  it('renders summary on Card 8', () => {
    const { getByText } = render(
      <RightSidePanel
        isCard7={false}
        isCard8={true}
        sentMessages={['test message']}
        {...otherProps}
      />
    )
    expect(getByText('test message')).toBeInTheDocument()
  })
})
```

## Notes

- The component uses the `hide-scrollbar` CSS class from `inked.css`
- Card 7 has extra top padding (`pt-32`) to account for the fixed headline
- Card 8 uses responsive top padding (`pt-20 lg:pt-4`)
- All panels maintain consistent width on desktop (`lg:w-[45%]`)
