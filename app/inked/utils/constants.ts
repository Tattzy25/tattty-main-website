/**
 * Inked Page Constants
 * All static data and configuration for the tattoo design questionnaire
 */

import { Sparkles, Heart, MapPin, Users, Calendar, Building } from "lucide-react"

export const TOTAL_CARDS = 9 // 6 text cards + Card 7 (visual) + Card 8 (AI) + Card 9

export const CARD_DATA = [
  {
    icon: Sparkles,
    title: "DYNAMIC_HEADLINE_1",
    subtitle: "What ACTUAL things, places, or people define you?",
    description: "This gives concrete, visual, personal elements",
    placeholder: "(OPTIONAL) In your own words",
    options: [
      "My '64 Impala / specific vehicle",
      "The block I grew up on", 
      "My grandmother's hands",
      "Basketball court on 42nd street",
      "My daughter's birthday (date)",
      "The restaurant I built",
      "My father's workshop",
      "The old oak tree in our yard",
      "My wedding ring",
      "The scar on my left knee",
      "My first apartment key",
      "The family photo on the mantle"
    ]
  },
  {
    icon: Heart,
    title: "DYNAMIC_HEADLINE_2",
    subtitle: "What moment or achievement are you most proud of?",
    description: "Your wins, your battles, your crowning moments",
    placeholder: "(OPTIONAL) In your own words",
    options: [
      "Starting my own business",
      "Graduating college",
      "Buying my first house",
      "Becoming a parent",
      "Overcoming addiction",
      "Survived a serious illness",
      "Military service",
      "Published my first book",
      "Won a championship",
      "Paid off all my debt",
      "Left a toxic relationship",
      "Forgave someone who hurt me"
    ]
  },
  {
    icon: MapPin,
    title: "DYNAMIC_HEADLINE_3",
    subtitle: "Where do you feel most yourself?",
    description: "Your sacred space, your comfort zone",
    placeholder: "(OPTIONAL) In your own words",
    options: [
      "On the basketball court",
      "In my kitchen",
      "At the beach",
      "In the mountains",
      "My home gym",
      "The recording studio",
      "My garage",
      "The family dinner table",
      "On stage",
      "In my garden",
      "On the road",
      "At my desk creating"
    ]
  },
  {
    icon: Users,
    title: "DYNAMIC_HEADLINE_4",
    subtitle: "Who shaped who you are today?",
    description: "The people who left their mark on your soul",
    placeholder: "(OPTIONAL) In your own words",
    options: [
      "My mother",
      "My father",
      "My grandparents",
      "My children",
      "My spouse/partner",
      "My best friend",
      "My mentor",
      "My coach",
      "My sibling",
      "A teacher who believed in me",
      "Someone I lost",
      "My younger self"
    ]
  },
  {
    icon: Calendar,
    title: "DYNAMIC_HEADLINE_5",
    subtitle: "What date or time period changed everything?",
    description: "Before and after moments",
    placeholder: "(OPTIONAL) In your own words",
    options: [
      "The year I was born",
      "When I got sober",
      "My wedding day",
      "The day my child was born",
      "When I lost someone",
      "The day I started over",
      "My graduation year",
      "When I moved to a new city",
      "The summer of '99",
      "My deployment year",
      "When I found my purpose",
      "The day everything clicked"
    ]
  },
  {
    icon: Building,
    title: "DYNAMIC_HEADLINE_6",
    subtitle: "What symbol or image represents your journey?",
    description: "Visual metaphors for your story",
    placeholder: "(OPTIONAL) In your own words",
    options: [
      "A phoenix rising",
      "A lion",
      "An anchor",
      "A compass",
      "A cross",
      "Mountains",
      "Ocean waves",
      "A tree with roots",
      "A broken chain",
      "A crown",
      "Wings",
      "A lighthouse"
    ]
  }
]

export const CARD_7_DATA = {
  title: "Pick Your Vibes",
  subtitle: "Pick your visual vibe",
  description: "Select styles that match your tattoo vision",
  placeholder: "(OPTIONAL) In your own words",
  options: [
    "Traditional",
    "Realism",
    "Watercolor",
    "Tribal",
    "Neo-Traditional",
    "Japanese",
    "Minimalist",
    "Geometric",
    "Blackwork",
    "Dotwork",
    "American Traditional",
    "Abstract"
  ]
}

export const CARD_7_CATEGORIES = [
  { id: 'style', name: 'Style', label: 'Style' },
  { id: 'color', name: 'Color', label: 'Color' },
  { id: 'size', name: 'Size', label: 'Size' },
  { id: 'placement', name: 'Placement', label: 'Placement' }
]

export const CARD_8_DATA = {
  icon: Sparkles,
  title: "DYNAMIC_HEADLINE_8",
  subtitle: "[AI will generate a personalized question based on your previous answers]",
  description: "Based on what you've shared, we have a follow-up question",
  placeholder: "Share your thoughts...",
  options: []
}

// Category image labels for Card 7
export const CATEGORY_LABELS = {
  style: ["Traditional", "Realism", "Tribal", "Japanese", "Watercolor", "Geometric", "Minimalist", "Neo-Traditional"],
  color: ["Black & Grey", "Full Color", "Pastel", "Vibrant", "Monochrome", "Earth Tones", "Neon", "Muted"],
  size: ["Small", "Medium", "Large", "Sleeve", "Half Sleeve", "Full Back", "Tiny", "XL"],
  placement: ["Arm", "Leg", "Back", "Chest", "Shoulder", "Wrist", "Neck", "Ribs"]
}
