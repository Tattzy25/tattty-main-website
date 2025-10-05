# Tattoo Generation Flow - Complete UX/UI Specification

## Overview
This document outlines the complete user flow for the tattoo design questionnaire from start to final image generation, including the merge of Card 8 and Card 9 logic.

---

## Card Structure (8 Total Cards)

### **Cards 1-6: Personal Story Questions**
- **Type**: Text-based Q&A with badge options
- **Left Side**: Chat box with question, badge options, text input, send button
- **Right Side**: StateCard animation (neon loading animation)
- **User Input**: Select badges (optional) + Type text (optional) + Click Send (required)
- **Validation**: Must send a message to proceed

### **Card 7: Visual Style Selection**
- **Type**: Image gallery selection
- **Left Side**: Chat box showing category labels/instructions
- **Right Side**: 4 scrollable image galleries (Style, Color, Size, Placement)
- **User Input**: Select images from galleries
- **Validation**: Must select at least Style + Color to proceed
- **No text required**: Pure visual selection

### **Card 8: Final Review + AI Follow-up (MERGED WITH CARD 9)**
- **Type**: Conversational final step + Summary display
- **Left Side**: Chat box with:
  - AI-generated deep follow-up question based on answers 1-7
  - OR question about skipped items
  - PLUS: "Did you forget anything? Want to add more?"
  - **NEW**: Image upload button (next to microphone icon)
  - Text input area
  - **"Build" button** (replaces "Send" or "Next")
- **Right Side**: Summary display showing:
  - All answers from Cards 1-6 (badges + text responses)
  - Visual selections from Card 7 (Style, Color, Size, Placement images)
  - Clean, organized, scrollable layout
  - User can review their entire journey
- **Validation**: Optional - user can proceed without answering

---

## The Generation Flow (After Card 8)

### **Step 1: User Clicks "Build" Button**
- **Entire screen transitions** to full-screen loading state
- Chat box fades out completely (300ms)
- Summary display fades out (300ms)
- StateCard loading animation takes over full screen (300ms fade in)

### **Step 2: Loading State**
- **Full Screen**: StateCard loading animation displayed
- No chat visible
- No other UI elements
- StateCard displays with rotating hints:
  - "PREPARING YOUR CANVAS..."
  - "MIXING THE COLORS..."
  - "WARMING UP THE MACHINE..."
  - "SETTING UP THE STATION..."
  - "READY TO INK..."
- **Duration**: While backend generates images (uses 5 different AI models)
- **User cannot go back** - Generation is in progress

### **Step 3: Images Generated (4 Total)**
- **2 Full Color Images**: Complete colored tattoo designs
- **2 Stencil Images**: Black line work/sketch versions of the same designs
- StateCard loading fades out (300ms)
- Results screen fades in (300ms)

### **Step 4: Results Display (Full Screen)**
- **NO Chat Box** - Completely removed/hidden
- **NO Conversation Mode** - No iterative editing
- **Full Screen Image Gallery**:
  - 4 large images displayed prominently
  - Grid layout (2x2 on desktop) or vertical scroll (mobile)
  - Each image card shows:
    - The tattoo design (full size, high quality)
    - Label: "Full Color - Option 1" / "Stencil - Option 1" / etc.
    - Action buttons below each image:
      - 💾 **Download** button
      - 💌 **Email to Me** button
      - ⭐ **Save to Profile** button (if logged in)

### **Step 5: Navigation Options (Bottom of Screen)**
- Fixed footer with action buttons:
  - **"← Back to Home"** - Return to main page
  - **"↻ Start New Design"** - Restart from Question 1
  - Optional: **"📤 Share"** button for social media

---

## What Users CANNOT Do After Generation:
❌ **No conversation/chat** - Generation is final  
❌ **No regeneration** - No "make it darker" requests  
❌ **No editing** - Results are what they are  
❌ **No going back to questions** - Unless they click "Start New Design"

## What Users CAN Do:
✅ **Download** all 4 images individually  
✅ **Email** images to themselves  
✅ **Save** to their account/profile  
✅ **Start completely fresh** design  
✅ **Go back home**

---

## State Management Updates Needed

### Remove Card 9 References
- Update `TOTAL_CARDS` constant: Change from 9 to 8
- Remove any `isCard9()` logic
- Update `getTotalSteps()` to return 8

### New Card 8 States
```typescript
// Add to page state
const [showSummary, setShowSummary] = useState(false)
const [isGenerating, setIsGenerating] = useState(false)
const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
const [uploadedImages, setUploadedImages] = useState<File[]>([])
const [showResults, setShowResults] = useState(false)
```

### New Types Needed
```typescript
interface GeneratedImage {
  id: string
  url: string
  type: 'color' | 'stencil'
  option: 1 | 2
  label: string
}
```

---

## Components to Create/Update

### 1. **SummaryDisplay Component** (NEW)
- Location: `components/summary-display/`
- Props:
  - `responses`: User text responses from Cards 1-6
  - `selectedOptions`: Selected badges from Cards 1-6
  - `selectedImages`: Visual selections from Card 7
  - `cardData`: Question data for context
- Displays organized, scrollable summary of user's journey

### 2. **ImageUpload Component** (NEW)
- Location: `components/image-upload/` or add to ChatBox
- Props:
  - `onImageUpload`: Callback for file upload
  - `disabled`: Boolean
- Shows next to microphone icon on Card 8

### 3. **GenerationResults Component** (NEW)
- Location: `components/generation-results/`
- Props:
  - `images`: Array of GeneratedImage objects (4 images)
  - `onDownload`: Callback for downloading individual images
  - `onEmail`: Callback for emailing images
  - `onSave`: Callback for saving to profile
  - `onBackHome`: Navigate back to home page
  - `onStartNew`: Restart questionnaire from Question 1
- Full screen display of 4 generated images with action buttons
- Grid layout (2x2 desktop, vertical mobile)
- Fixed footer with navigation buttons

### 4. **ChatBox Component** (UPDATE)
- Add image upload feature for Card 8
- Change button text to "Build" on Card 8
- Remove any conversation mode logic after generation

### 5. **StateCard Component** (REUSE)
- Already created and working
- Use for full-screen generation loading state
- No changes needed

---

## Technical Implementation Steps

### Phase 1: Card 8 Summary Display
1. Create `SummaryDisplay` component
2. Update `page.tsx` to show Summary on Card 8 right side
3. Update Card 8 logic to detect when user is on final step

### Phase 2: Image Upload Feature
1. Create `ImageUpload` component
2. Add to ChatBox for Card 8 only
3. Wire up file upload handler
4. Store uploaded images in state

### Phase 3: Generation Flow
1. Create `GenerationResults` component (full screen image display)
2. Add "Build" button logic to trigger generation
3. Show full-screen StateCard during loading
4. On completion: Hide everything, show `GenerationResults` full screen
5. Wire up Download, Email, Save actions
6. Add "Start New Design" button to restart from Question 1

---

## UX Principles

### Why This Flow Works
✅ **Clean completion** - Full screen results feel final and polished  
✅ **No false promises** - No regeneration = no disappointment  
✅ **Simple actions** - Download, Email, Save are clear and immediate  
✅ **Focused experience** - Full screen shows off the designs  
✅ **Clear restart path** - "Start New Design" button resets to Question 1  
✅ **Fast to ship** - No complex conversation/regeneration logic  

### What to Avoid
❌ **Don't allow editing after generation** - Results are final  
❌ **Don't keep chat visible** - Distracting from results  
❌ **Don't add regeneration** - Scope creep, delays launch  
❌ **Don't use modals** - Full screen is better for showcasing  

---

## Animation Timing (Consistency)
- Fade out: 300ms
- Fade in: 300ms
- Delay between transitions: 100ms
- Use existing `ANIMATION_TIMING` constants from `lib/constants`

---

## Future Enhancements (Version 2.0)
- **ControlNet Editing**: Allow iterative changes to generated images
- **Conversation Mode**: Chat-based refinements using ControlNet
- **Image Zoom**: Lightbox view for detailed inspection
- **Social Sharing**: Direct share to Instagram, Pinterest, etc.
- **Multiple Generations**: Generate more variations from same inputs
- **Favorites System**: Save and compare favorite designs
- **Artist Booking**: Connect with tattoo artists for consultation
- **Style Variations**: "Generate in different style" option

---

## Database Schema (Already Complete)
- Tables ready with UUIDs
- Backend API endpoints prepared
- Multiple AI model integration in progress (5 models)
- Data connection pending frontend completion

---

**Last Updated**: October 4, 2025  
**Status**: Card 8 implementation pending  
**Priority**: High - Core flow completion
